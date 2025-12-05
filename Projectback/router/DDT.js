const express = require("express")
const router = express.Router()
const conn = require("../config/database")

let dairy = [
    { did: 1, content: "크리스마스" }
]

/* ------------------------------
    1) 일기 추가
--------------------------------*/
router.post('/AddDiary', async (req, res) => {
    const { user_id, date, content, strees, anxiety, depression } = req.body;

    if (!user_id || !date || !content) {
        return res.status(400).json({ message: "user_id, date, content 필수 입력" });
    }

    const sql = `
        INSERT INTO diary (user_id, date, content, strees, anxiety, depression)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    conn.query(
        sql,
        [user_id, date, content, strees || 0, anxiety || 0, depression || 0],
        async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "일기 저장 실패" });
            }
            const ragResult = await generateRagAfterDiary(user_id);
            return res.json({
                message: "일기 저장 성공",
                diary_id: result.insertId
            });
        }
    );
});


/* ------------------------------
    2) 월별 날짜 조회  ★★★ 추가된 부분 ★★★
--------------------------------*/
router.post("/MonthDiary", (req, res) => {
    const { uid, year, month } = req.body;

    if (!uid || !year || !month) {
        return res.status(400).json({ message: "uid, year, month 누락" });
    }

    const sql = `
        SELECT date
        FROM diary
        WHERE user_id = ?
          AND YEAR(date) = ?
          AND MONTH(date) = ?
        ORDER BY date ASC
    `;

    conn.query(sql, [uid, year, month], (err, result) => {
        if (err) {
            console.log("MonthDiary Error:", err);
            return res.status(500).json({ message: "월별 일기 조회 실패" });
        }

        return res.json({
            message: "월별 일기 조회 성공",
            dates: result.map(r => r.date)
        });
    });
});


/* ------------------------------
    4) 일기 수정
--------------------------------*/
router.put("/Diary", async (req, res) => {
    const { user_id, date, content, strees, anxiety, depression } = req.body;

    if (!user_id || !date) {
        return res.status(400).json({ message: "user_id, date 누락" });
    }

    const sql = `
        UPDATE diary
        SET content=?, strees=?, anxiety=?, depression=?
        WHERE user_id=? AND date=?
    `;

    conn.query(
        sql,
        [content, strees, anxiety, depression, user_id, date],
        async (err, result) => {
            if (err) return res.status(500).json({ message: "일기 수정 실패" });


            const ragResult = await generateRagAfterDiary(user_id);
            return res.json({ message: "수정 성공" });
        }
    );
});


/* ------------------------------
    5) 특정 날짜 조회 (POST)
--------------------------------*/
router.post('/GetDiaryDate', (req, res) => {
    const { user_id, date } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "user_id 누락" });
    }

    let targetDate = date;
    if (!targetDate) {
        const today = new Date();
        targetDate = today.toISOString().split("T")[0];
    }

    const sql = `
        SELECT diary_id, user_id, date, content, strees, anxiety, depression
        FROM diary
        WHERE user_id = ? AND date = ?
    `;

    conn.query(sql, [user_id, targetDate], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "일기 조회 실패" });
        }

        if (result.length === 0) {
            return res.json({
                message: "특정 날짜 일기 조회 성공",
                date: targetDate,
                info: "작성안함"
            });
        }

        return res.json({
            message: "특정 날짜 일기 조회 성공",
            date: targetDate,
            diaries: result
        });
    });
});


/* ------------------------------
    6) 일기 삭제
--------------------------------*/
router.post('/DeleteDiary', async (req, res) => {
    const { user_id, date } = req.body;

    if (!user_id || !date) {
        return res.status(400).json({ message: "user_id 또는 date 누락" });
    }

    const sql = `
        DELETE FROM diary
        WHERE user_id = ? AND date = ?
    `;

    conn.query(sql, [user_id, date], async (err, result) => {   // ← ★ 여기 async 추가 (유일한 수정)
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "일기 삭제 실패" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "삭제할 일기가 없음" });
        }

        
        const ragResult = await generateRagAfterDiary(user_id);

        return res.json({ message: "일기 삭제 성공" });
    });
});

// ================================
//  RAG 생성용 System Prompt
// ================================
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

// OpenAI
const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL_NAME = "gpt-4o-mini";

// ================================
//  최근 7일 일기 조회 함수
// ================================
async function selectRecent7Diary(user_id) {
  const sql = `
    SELECT date, content
    FROM diary
    WHERE user_id = ?
      AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
    ORDER BY date ASC
  `;
  const [rows] = await conn.promise().query(sql, [user_id]);
  return rows;
}

// ================================
//  user_rag Upsert 
// ================================
async function upsertRagDirect(user_id, ragData) {
  const check = `
    SELECT RAGID FROM user_rag WHERE user_id = ? LIMIT 1
  `;
  const [rows] = await conn.promise().query(check, [user_id]);

  if (rows.length === 0) {
    const ins = `
      INSERT INTO user_rag (user_id, rag_date, rag_data)
      VALUES (?, CURDATE(), ?)
    `;
    await conn.promise().query(ins, [user_id, ragData]);
  } else {
    const upd = `
      UPDATE user_rag
      SET rag_date = CURDATE(), rag_data = ?
      WHERE user_id = ?
    `;
    await conn.promise().query(upd, [ragData, user_id]);
  }
}

// ================================
//  일기 저장 이후 자동 RAG 생성 추가 블록
// ================================
async function generateRagAfterDiary(user_id) {
  const diaries = await selectRecent7Diary(user_id);

  if (!diaries || diaries.length === 0) return;

  const diaryText = diaries
    .map(d => `날짜: ${d.date}\n내용: ${d.content}`)
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

  const ragContent = ragRes.choices[0].message.content.trim();

  await upsertRagDirect(user_id, ragContent);

  return ragContent;
}


module.exports = router;
