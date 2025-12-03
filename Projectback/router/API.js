/**
 * ==========================================================
 *  routes/API.js
 *  ----------------------------------------------------------
 *  주요 역할:
 *    - /api/start  : 대화 시작 (RAG1 생성 체크 → greeting 생성 → AI 첫 메시지 저장)
 *    - /api/chat   : 일반 대화 (RAG1 + RAG2 기반 GPT 응답 → DB 저장)
 *
 *  규칙 요약:
 *    - RAG1 : user_rag 테이블 1행(유저별 1개). 매일 1회만 생성/업데이트.
 *    - RAG2 : 어제+오늘 전체 대화(raw). DB에 저장하지 않고 GPT 세션 생성용으로만 사용.
 *    - Chat 저장 규칙:
 *        GPT 호출 전 → 사용자 메시지를 DB에 넣지 않는다.
 *        GPT 호출 후 → user → ai 순서로 반드시 DB 저장.
 *
 *  핵심 의도:
 *    사용자가 방금 보낸 메시지가 RAG2에 포함되면 안 되므로,
 *    GPT 호출 후 DB 저장 순서를 엄격히 보장한다.
 * ==========================================================
 */

const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const OpenAI = require("openai");


// -------------------------
// JWT 토큰 관련
// -------------------------
const { generateTokens, verifyAccessToken, verifyRefreshToken } = require('./Token');


// -------------------------
// OpenAI 설정
// -------------------------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// -------------------------
// 모델 및 기본 옵션
// -------------------------
const MODEL_NAME = "gpt-4o-mini";
const DEFAULT_OPTIONS = {
  model: MODEL_NAME,
  temperature: 0.7,
  max_tokens: 600,
  top_p: 0.9,
};

// -------------------------
// System Prompt: RAG 생성용
// -------------------------
const systemPrompt_rag = `
당신은 전문 심리요약 분석가입니다.

사용자가 최근 7일 동안 기록한 일기(감정/상태)를 바탕으로
다음 항목을 8~12줄 이내로 분석 보고서 형식으로 출력하세요:

- 주요 감정 흐름 (예: 분노/불안/우울 등)
- 반복적으로 나타나는 패턴
- 스트레스 주요 원인
- 컨디션/기분 변화 추이
- 유용한 관찰(대처 패턴/행동)
- 주의할 점 (의학적 판단은 피함)

출력은 한국어로, 사용자에게 직접 말하는 문장(권유형 인사)은 제외하고 분석 보고서 형식으로 서술해주세요.
`;

// -------------------------
// System Prompt: 상담 대화용
// -------------------------
const systemPrompt_chat = `
당신은 MindCare의 전문 심리상담사입니다.
항상 따뜻하고 공감적으로, 판단하지 않는 톤으로 응답하세요.

말투 예시:
- "그럴 수 있어요."
- "많이 힘드셨겠어요."
- "말해줘서 고마워요."
- "천천히 이야기해도 괜찮아요."

금지:
- 의학적 진단 단정
- 위험하거나 법적/의학적 조언
- 명령조 어투
`;

// ==========================================================
//  유틸 함수
// ==========================================================

// YYYY-MM-DD 반환
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ==========================================================
//  DB Helper Functions
// ==========================================================

/** user_rag 최신 1행 조회 */
async function selectUserRag(user_id) {
  const sql = `
    SELECT RAGID, user_id, rag_date, rag_data
    FROM user_rag
    WHERE user_id = ?
    LIMIT 1
  `;
  const [rows] = await conn.promise().query(sql, [user_id]);
  return rows.length ? rows[0] : null;
}

/** 오늘자 rag 존재 여부 확인 */
async function hasUserRagForToday(user_id) {
  const sql = `
    SELECT RAGID FROM user_rag
    WHERE user_id = ? AND rag_date = ?
    LIMIT 1
  `;
  const [rows] = await conn.promise().query(sql, [user_id, todayStr()]);
  return rows.length > 0;
}

/** user_rag insert 또는 update */
async function upsertUserRag(user_id, ragData) {
  const checkSql = `SELECT RAGID FROM user_rag WHERE user_id = ? LIMIT 1`;
  const [rows] = await conn.promise().query(checkSql, [user_id]);
  const nowDate = todayStr();

  if (rows.length === 0) {
    const insSql = `
      INSERT INTO user_rag (user_id, rag_date, rag_data)
      VALUES (?, ?, ?)
    `;
    await conn.promise().query(insSql, [user_id, nowDate, ragData]);
    return { action: "inserted" };
  } else {
    const updSql = `
      UPDATE user_rag SET rag_date = ?, rag_data = ?
      WHERE user_id = ?
    `;
    await conn.promise().query(updSql, [nowDate, ragData, user_id]);
    return { action: "updated" };
  }
}

/** 최근 7일 일기 조회 */
async function selectRecent7DaysDiary(user_id) {
  const sql = `
    SELECT diary_date, diary_text
    FROM user_diary
    WHERE user_id = ?
      AND diary_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
    ORDER BY diary_date ASC
  `;
  const [rows] = await conn.promise().query(sql, [user_id]);
  return rows;
}

/** 어제+오늘의 chat logs 조회(RAG2 raw) */
async function selectChatLogYesterdayToday(user_id) {
  const sql = `
    SELECT chat_id, user_id, chat_type, chat_text, chat_time
    FROM chat_log
    WHERE user_id = ?
      AND chat_time >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    ORDER BY chat_time ASC
  `;
  const [rows] = await conn.promise().query(sql, [user_id]);
  return rows;
}

/** chat 저장 */
async function insertChatLog(user_id, chat_type, chat_text) {
  const sql = `
    INSERT INTO chat_log (user_id, chat_type, chat_text, chat_time)
    VALUES (?, ?, ?, NOW())
  `;
  const [result] = await conn.promise().query(sql, [user_id, chat_type, chat_text]);
  return result.insertId;
}

// ==========================================================
//  OpenAI wrapper
// ==========================================================
async function callOpenAIWithMessages(messages, options = {}) {
  const payload = { ...DEFAULT_OPTIONS, messages, ...options };
  const res = await client.chat.completions.create(payload);
  return res.choices[0].message.content;
}

// ==========================================================
//                    ★ /api/start ★
// ==========================================================
router.post("/start",verifyAccessToken,async (req, res) => {
  try {
    const user_id = req.user.user_id; // JWT 토큰에서 user_id 가져오기
    if (!user_id)
      return res.status(400).json({ result: "fail", message: "user_id is required" });

    // 1) 오늘 RAG 생성 여부 확인
    const todayExists = await hasUserRagForToday(user_id);
    let rag1 = "";
    let ragAction = "none";

    if (todayExists) {
      // 오늘자 RAG가 이미 있다 → 그대로 사용
      const existing = await selectUserRag(user_id);
      rag1 = existing ? existing.rag_data : "";
      ragAction = "today_exists";
    } else {
      // 오늘자 RAG가 없다 → 최근 7일 일기 검사
      const diaries = await selectRecent7DaysDiary(user_id);

      if (!diaries || diaries.length === 0) {
        rag1 = "";
        ragAction = "no_diary";
      } else {
        // GPT로 RAG1 생성
        const diaryText = diaries
          .map(d => `날짜: ${d.diary_date}\n내용: ${d.diary_text}`)
          .join("\n\n");

        const messages = [
          { role: "system", content: systemPrompt_rag },
          {
            role: "user",
            content: `최근 7일 일기:\n\n${diaryText}\n\n위 자료를 기반으로 RAG 요약을 생성하십시오.`,
          },
        ];

        const ragRes = await client.chat.completions.create({
          model: MODEL_NAME,
          temperature: 0.2,
          messages,
          max_tokens: 600,
        });

        rag1 = ragRes.choices[0].message.content.trim();

        // DB에 upsert
        const upsertRes = await upsertUserRag(user_id, rag1);
        ragAction = upsertRes.action;
      }
    }

    // 2) RAG2 생성
    const chatLogs = await selectChatLogYesterdayToday(user_id);
    const rag2 = chatLogs.length
      ? chatLogs
          .map(
            r =>
              `${r.chat_type === "user" ? "USER" : "AI"} [${r.chat_time.toISOString()}]: ${r.chat_text}`
          )
          .join("\n")
      : "";

    // 3) greeting 생성
    const greetingMessages = [
      { role: "system", content: systemPrompt_chat },
    ];

    if (rag1.trim()) greetingMessages.push({ role: "assistant", content: `RAG1:\n${rag1}` });
    if (rag2.trim()) greetingMessages.push({ role: "assistant", content: `RAG2:\n${rag2}` });

    greetingMessages.push({
      role: "user",
      content: "위 정보를 참고하여 오늘의 첫 인사말(한두 문장)을 생성해주세요.",
    });

    const greetRes = await client.chat.completions.create({
      model: MODEL_NAME,
      temperature: 0.7,
      messages: greetingMessages,
      max_tokens: 200,
    });

    const greeting = greetRes.choices[0].message.content.trim();

    // 4) greeting 저장 (AI)
    await insertChatLog(user_id, "ai", greeting);

    return res.json({
      result: "success",
      rag_action: ragAction,
      rag1,
      rag2_length: rag2.length,
      greeting,
    });
  } catch (err) {
    console.error("START Error:", err);
    return res.status(500).json({
      result: "error",
      message: "server error",
      detail: err.message,
    });
  }
});

// ==========================================================
//                    ★ /api/chat ★
// ==========================================================

/**
 * /api/chat
 *
 * 절차:
 *  1) 현재 RAG1 불러오기
 *  2) RAG2(raw) 생성 (어제+오늘)
 *     ⚠ 사용자 방금 메시지는 DB에 들어가지 않았으므로 RAG2에 포함되지 않음
 *  3) GPT (RAG1+RAG2+사용자 메시지) 호출
 *  4) GPT 호출 후 user_message → ai_reply 순으로 DB 저장
 *  5) 결과 반환
 */
router.post("/chat",verifyAccessToken, async (req, res) => {
  try {
     console.log("AUTH:", req.headers.authorization);
    const user_id = req.user.user_id; // JWT 토큰에서 user_id 가져오기
    const { user_message } = req.body;
    if (!user_id || !user_message) {
      return res.status(400).json({
        result: "fail",
        message: "user_id and user_message required",
      });
    }

    // 1) RAG1
    const userRagRow = await selectUserRag(user_id);
    const rag1 = userRagRow ? userRagRow.rag_data : "";

    // 2) RAG2
    const chatLogs = await selectChatLogYesterdayToday(user_id);
    const rag2 = chatLogs.length
      ? chatLogs
          .map(
            r =>
              `${r.chat_type === "user" ? "USER" : "AI"} [${r.chat_time.toISOString()}]: ${r.chat_text}`
          )
          .join("\n")
      : "";

    // 3) GPT 메시지 구성
    const messages = [
      { role: "system", content: systemPrompt_chat },
    ];

    if (rag1.trim()) messages.push({ role: "assistant", content: `RAG1:\n${rag1}` });
    if (rag2.trim()) messages.push({ role: "assistant", content: `RAG2:\n${rag2}` });

    messages.push({ role: "user", content: user_message });

    const gptRes = await client.chat.completions.create({
      model: MODEL_NAME,
      temperature: 0.7,
      messages,
      max_tokens: 600,
    });

    const aiReply = gptRes.choices[0].message.content.trim();

    // 4) DB 저장 (GPT 이후)
    await insertChatLog(user_id, "user", user_message);
    await insertChatLog(user_id, "ai", aiReply);

    return res.json({
      result: "success",
      reply: aiReply,
    });
  } catch (err) {
    console.error("CHAT Error:", err);
    return res.status(500).json({
      result: "error",
      message: "server error",
      detail: err.message,
    });
  }
});

module.exports = router;
