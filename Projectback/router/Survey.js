/* 

*/

const express = require('express');
const router = express.Router();
const conn = require('../config/database');

router.post("/", (req, res) => {

});

// -----------------------------
// PHQ-9 (9문항)
// -----------------------------
router.post("/phq9", (req, res) => {
    const data = req.body;
    const user_id = data.user_id;   // ✔ 수정됨

    const keys = ["q0","q1","q2","q3","q4","q5","q6","q7","q8"];

    const categoryMap = {
        q0: "E", q1: "E",
        q2: "P", q3: "P", q4: "P", q5: "P",
        q6: "E", q7: "P", q8: "E"
    };

    for (const key of keys) {
        const val = Number(data[key]);
        if (isNaN(val)) {
            return res.status(400).json({ result: "fail", message: `필수 문항(${key}) 누락` });
        }
        if (![0,1,2,3].includes(val)) {
            return res.status(400).json({ result: "fail", message: `문항(${key}) 값 오류` });
        }
    }

    let totalScore = 0, emotionalScore = 0, physicalScore = 0;

    keys.forEach(key => {
        const score = Number(data[key]);
        totalScore += score;
        if (categoryMap[key] === "E") emotionalScore += score;
        else physicalScore += score;
    });

    const sql = `
        INSERT INTO SURVEYRESULT
        (user_id, survey_type,total_score, survey_date, physical_point, emotional_point)
        VALUES (?, ?, ?, CURRENT_DATE, ?, ?)
    `;

    conn.query(sql, [user_id, "PHQ9", totalScore, physicalScore, emotionalScore], (err, result) => {
        if (err) return res.status(500).json({ result: "fail", message: "DB 저장 실패" });

        return res.json({ result: "success", totalScore, emotionalScore, physicalScore });
    });
});

// -----------------------------
// GAD-7 (7문항)
// -----------------------------
router.post("/gad7", (req, res) => {
    const data = req.body;
    const user_id = data.user_id;   // ✔ 수정됨

    const keys = ["q0","q1","q2","q3","q4","q5","q6"];

    const categoryMap = {
        q0: "E",
        q1: "P", q2: "P", q3: "P", q4: "P",
        q5: "E", q6: "E"
    };

    for (const key of keys) {
        const val = Number(data[key]);
        if (isNaN(val)) return res.status(400).json({ result: "fail", message: `필수 문항(${key}) 누락` });
        if (![0,1,2,3].includes(val)) return res.status(400).json({ result: "fail", message: `문항(${key}) 값 오류` });
    }

    let totalScore = 0, emotionalScore = 0, physicalScore = 0;

    keys.forEach(key => {
        const score = Number(data[key]);
        totalScore += score;
        if (categoryMap[key] === "E") emotionalScore += score;
        else physicalScore += score;
    });

    const sql = `
        INSERT INTO SURVEYRESULT
        (user_id, survey_type,total_score, survey_date, physical_point, emotional_point)
        VALUES (?, ?, ?, CURRENT_DATE, ?, ?)
    `;

    conn.query(sql, [user_id, "GAD7", totalScore, physicalScore, emotionalScore], (err, result) => {
        if (err) return res.status(500).json({ result: "fail", message: "DB 저장 실패" });

        return res.json({ result: "success", totalScore, emotionalScore, physicalScore });
    });
});

// -----------------------------
// PSS-10 (10문항, 일부 역문항)
// -----------------------------
router.post("/pss10", (req, res) => {
    const data = req.body;
    const user_id = data.user_id;   // ✔ 수정됨

    const keys = ["q0","q1","q2","q3","q4","q5","q6","q7","q8","q9"];

    const categoryMap = {
        q0: "E", q1: "P", q2: "E",
        q3: "P", q4: "P", q5: "P",
        q6: "E", q7: "P", q8: "E", q9: "P"
    };

    const reverseItems = ["q3","q4","q6","q7"];

    for (const key of keys) {
        const val = Number(data[key]);
        if (isNaN(val)) return res.status(400).json({ result: "fail", message: `필수 문항(${key}) 누락` });
        if (![0,1,2,3,4].includes(val)) return res.status(400).json({ result: "fail", message: `문항(${key}) 값 오류` });
    }

    let totalScore = 0, emotionalScore = 0, physicalScore = 0;

    keys.forEach(key => {
        let score = Number(data[key]);
        if (reverseItems.includes(key)) score = 4 - score;
        totalScore += score;

        if (categoryMap[key] === "E") emotionalScore += score;
        else physicalScore += score;
    });

    const sql = `
        INSERT INTO SURVEYRESULT
        (user_id, survey_type,total_score,survey_date, physical_point, emotional_point)
        VALUES (?, ?, ?, CURRENT_DATE, ?, ?)
    `;

    conn.query(sql, [user_id, "PSS10", totalScore, physicalScore, emotionalScore], (err, result) => {
        if (err) return res.status(500).json({ result: "fail", message: "DB 저장 실패" });

        return res.json({ result: "success", totalScore, emotionalScore, physicalScore });
    });
});

// -----------------------------
// 최근 검사 3개 조회
// -----------------------------
router.post("/recent", (req, res) => {
    const user_id = req.body.user_id;   // ✔ body에서 받음

    if (!user_id) {
        return res.status(400).json({ result: "fail", message: "user_id 누락" });
    }

    const sql = `
        SELECT r.*
        FROM SURVEYRESULT r
        INNER JOIN (
            SELECT survey_type, MAX(survey_date) AS latest_date
            FROM SURVEYRESULT
            WHERE user_id = ?
            GROUP BY survey_type
        ) latest
        ON r.survey_type = latest.survey_type
        AND r.survey_date = latest.latest_date
        WHERE r.user_id = ?
        ORDER BY r.result_id DESC
        LIMIT 3
    `;

    conn.query(sql, [user_id,user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ result: "fail", message: "DB 조회 실패" });
        }

        return res.json({
            result: "success",
            results
        });
    });
});
// ==============================
// 전체 검사 기록 조회 (SurveyRecord.jsx에서 사용)
// ==============================
router.get("/result/:uid", (req, res) => {
    const user_id = req.params.uid;

    const sql = `
        SELECT 
            result_id,
            user_id,
            survey_type,
            total_score,
            emotional_point,
            physical_point,
            survey_date
        FROM SURVEYRESULT
        WHERE user_id = ?
        ORDER BY survey_date DESC, result_id DESC
    `;

    conn.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("DB Select Error:", err);
            return res.status(500).json({ result: "fail", message: "DB 조회 실패" });
        }

        return res.json(results);
    });
});
module.exports = router;
