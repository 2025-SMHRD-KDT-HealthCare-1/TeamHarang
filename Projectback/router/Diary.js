const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// ===============================
// 날짜 helper (YYYY-MM-DD)
// ===============================
function toDateStr(dateObj) {
  return dateObj.toLocaleDateString("sv-SE"); // YYYY-MM-DD
}

// ===============================
// 1) 일기 추가
// ===============================
router.post("/AddDiary", async (req, res) => {
  console.log("📌 AddDiary BODY:", req.body);

  let { user_id, uid, date, content, strees, anxiety, depression } = req.body;

  // uid로 오는 것도 지원
  user_id = user_id || uid;

  if (!user_id || !date || !content) {
    console.log("❌ 필수값 누락:", { user_id, date, content });
    return res.status(400).json({ message: "user_id, date, content 필수 입력" });
  }

  // 날짜 강제 변환
  const saveDate = new Date(date).toLocaleDateString("sv-SE");

  const sql = `
    INSERT INTO diary (user_id, date, content, strees, anxiety, depression)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  conn.query(
    sql,
    [user_id, saveDate, content, strees || 0, anxiety || 0, depression || 0],
    async (err, result) => {
      if (err) {
        console.log("❌ INSERT ERROR:", err);
        return res.status(500).json({ message: "일기 저장 실패", error: err });
      }

      await generateRagAfterDiary(user_id);

      return res.json({
        message: "일기 저장 성공",
        diary_id: result.insertId,
      });
    }
  );
});

// ===============================
// 2) 월별 날짜 조회
// ===============================
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
      console.log("❌ MonthDiary Error:", err);
      return res.status(500).json({ message: "월별 일기 조회 실패" });
    }

    return res.json({
      message: "월별 일기 조회 성공",
      dates: result.map((r) => r.date),
    });
  });
});

// ===============================
// 3) 특정 날짜 조회
// ===============================
router.post("/GetDiaryDate", (req, res) => {
  const { user_id, uid, date } = req.body;

  const finalUid = user_id || uid;
  if (!finalUid) {
    return res.status(400).json({ message: "user_id 누락" });
  }

  const targetDate = new Date(date).toLocaleDateString("sv-SE");

  const sql = `
    SELECT diary_id, user_id, date, content, strees, anxiety, depression
    FROM diary
    WHERE user_id = ? AND date = ?
  `;

  conn.query(sql, [finalUid, targetDate], (err, result) => {
    if (err) {
      console.log("❌ GetDiaryDate Error:", err);
      return res.status(500).json({ message: "일기 조회 실패" });
    }

    if (result.length === 0) {
      return res.json({
        message: "특정 날짜 일기 조회 성공",
        date: targetDate,
        info: "작성안함",
      });
    }

    return res.json({
      message: "특정 날짜 일기 조회 성공",
      date: targetDate,
      diaries: result,
    });
  });
});

// ===============================
// 4) 일기 수정
// ===============================
router.put("/Diary", async (req, res) => {
  let { user_id, uid, date, content, strees, anxiety, depression } = req.body;
  user_id = user_id || uid;

  if (!user_id || !date) {
    return res.status(400).json({ message: "user_id 또는 date 누락" });
  }

  const saveDate = new Date(date).toLocaleDateString("sv-SE");

  const sql = `
    UPDATE diary
    SET content=?, strees=?, anxiety=?, depression=?
    WHERE user_id=? AND date=?
  `;

  conn.query(
    sql,
    [content, strees, anxiety, depression, user_id, saveDate],
    async (err, result) => {
      if (err) {
        console.log("❌ Update Error:", err);
        return res.status(500).json({ message: "일기 수정 실패" });
      }

      await generateRagAfterDiary(user_id);
      return res.json({ message: "수정 성공" });
    }
  );
});

// ===============================
// 5) 일기 삭제
// ===============================
router.post("/DeleteDiary", async (req, res) => {
  let { user_id, uid, date } = req.body;
  user_id = user_id || uid;

  if (!user_id || !date) {
    return res.status(400).json({ message: "user_id 또는 date 누락" });
  }

  const saveDate = new Date(date).toLocaleDateString("sv-SE");

  const sql = `
    DELETE FROM diary
    WHERE user_id = ? AND date = ?
  `;

  conn.query(sql, [user_id, saveDate], async (err, result) => {
    if (err) {
      console.log("❌ Delete Error:", err);
      return res.status(500).json({ message: "일기 삭제 실패" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "삭제할 일기가 없음" });
    }

    await generateRagAfterDiary(user_id);
    return res.json({ message: "일기 삭제 성공" });
  });
});

// ===============================
// RAG 관련 함수는 그대로 유지
// ===============================

const systemPrompt_rag = ` ... 동일 ... `;
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL_NAME = "gpt-4o-mini";

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

async function upsertRagDirect(user_id, ragData) {
  const check = `SELECT RAGID FROM user_rag WHERE user_id = ? LIMIT 1`;
  const [rows] = await conn.promise().query(check, [user_id]);

  if (rows.length === 0) {
    await conn
      .promise()
      .query(
        `INSERT INTO user_rag (user_id, rag_date, rag_data) VALUES (?, CURDATE(), ?)`,
        [user_id, ragData]
      );
  } else {
    await conn
      .promise()
      .query(
        `UPDATE user_rag SET rag_date = CURDATE(), rag_data=? WHERE user_id=?`,
        [ragData, user_id]
      );
  }
}

async function generateRagAfterDiary(user_id) {
  const diaries = await selectRecent7Diary(user_id);
  if (!diaries || diaries.length === 0) return;

  const diaryText = diaries
    .map((d) => `날짜: ${d.date}\n내용: ${d.content}`)
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
