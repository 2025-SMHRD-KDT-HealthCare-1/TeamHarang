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
    const user_id = req.user.user_id;   // 🔥 수정됨

    const keys = ["q0","q1","q2","q3","q4","q5","q6","q7","q8"];

    // 각 문항의 E/P 구분
    const categoryMap = {
        q0: "E",
        q1: "E",
        q2: "P",
        q3: "P",
        q4: "P",
        q5: "P",
        q6: "E",
        q7: "P",
        q8: "E"
    };

    // 필수 문항 체크 + 유효성 검사
    for (const key of keys) {
        const val = Number(data[key]);

        if (isNaN(val)) {
            return res.status(400).json({
                result: "fail",
                message: `필수 문항(${key})이 누락되었거나 값이 잘못되었습니다`
            });
        }

        if (![0,1,2,3].includes(val)) {
            return res.status(400).json({
                result: "fail",
                message: `문항(${key})은 0~3 중 하나여야 합니다`
            });
        }
    }

    // 총점 & E/P 계산
    let totalScore = 0;
    let emotionalScore = 0; 
    let physicalScore = 0;  

    keys.forEach(key => {
        const score = Number(data[key]);
        totalScore += score;

        if (categoryMap[key] === "E") emotionalScore += score;
        else physicalScore += score;
    });

    const sql = `
        INSERT INTO SURVEYRESULT
        (user_id, survey_type,total_score, survey_date, physical_point, emotional_point)
        VALUES (?, ?,?, CURRENT_DATE, ?, ?)
    `;

    const params = [user_id, "PHQ9", totalScore,physicalScore, emotionalScore];

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ result: "fail", message: "DB 저장 실패" });
        }

        return res.json({
            result: "success",
            totalScore,
            emotionalScore,
            physicalScore
        });
    });
});


// -----------------------------
// GAD-7 (7문항)
// -----------------------------
router.post("/gad7", (req, res) => {
    const data = req.body;
    const user_id = req.user.user_id;   // 🔥 수정됨

    const keys = ["q0","q1","q2","q3","q4","q5","q6"];

    const categoryMap = {
        q0: "E",
        q1: "P",
        q2: "P",
        q3: "P",
        q4: "P",
        q5: "E",
        q6: "E"
    };

    for (const key of keys) {
        const val = Number(data[key]);

        if (isNaN(val)) {
            return res.status(400).json({
                result: "fail",
                message: `필수 문항(${key})이 누락되었거나 값이 잘못되었습니다`
            });
        }

        if (![0,1,2,3].includes(val)) {
            return res.status(400).json({
                result: "fail",
                message: `문항(${key})은 0~3 중 하나여야 합니다`
            });
        }
    }

    let totalScore = 0;
    let emotionalScore = 0;
    let physicalScore = 0;

    keys.forEach(key => {
        const score = Number(data[key]);
        totalScore += score;

        if (categoryMap[key] === "E") emotionalScore += score;
        else physicalScore += score;
    });

    const sql = `
        INSERT INTO SURVEYRESULT
        (user_id, survey_type,total_score, survey_date, physical_point, emotional_point)
        VALUES (?, ?,?, CURRENT_DATE, ?, ?)
    `;

    const params = [user_id, "GAD7",totalScore,physicalScore, emotionalScore];

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ result: "fail", message: "DB 저장 실패" });
        }

        return res.json({
            result: "success",
            totalScore,
            emotionalScore,
            physicalScore
        });
    });
});


// -----------------------------
// PSS-10 (10문항, 일부 역문항)
// -----------------------------
router.post("/pss10", (req, res) => {
    const data = req.body;
    const user_id = req.user.user_id;    // 🔥 수정됨

    const keys = [
        "q0","q1","q2","q3","q4",
        "q5","q6","q7","q8","q9"
    ];

    const categoryMap = {
        q0: "E",
        q1: "P",
        q2: "E",
        q3: "P",
        q4: "P",
        q5: "P",
        q6: "E",
        q7: "P",
        q8: "E",
        q9: "P"
    };

    const reverseItems = ["q3", "q4", "q6", "q7"];

    for (const key of keys) {
        const val = Number(data[key]);

        if (isNaN(val)) {
            return res.status(400).json({
                result: "fail",
                message: `필수 문항(${key})이 누락되었거나 값이 잘못되었습니다`
            });
        }

        if (![0,1,2,3,4].includes(val)) {
            return res.status(400).json({
                result: "fail",
                message: `문항(${key})은 0~4 중 하나여야 합니다`
            });
        }
    }

    let totalScore = 0;
    let emotionalScore = 0;
    let physicalScore = 0;

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
        VALUES (?, ?,?,CURRENT_DATE, ?, ?)
    `;

    const params = [user_id, "PSS10", totalScore,physicalScore, emotionalScore];

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ result: "fail", message: "DB 저장 실패" });
        }

        return res.json({
            result: "success",
            totalScore,
            emotionalScore,
            physicalScore
        });
    });
});

module.exports = router;
