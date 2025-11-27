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

    const keys = ["q1","q2","q3","q4","q5","q6","q7","q8","q9"];

    // 각 문항의 E/P 구분
    const categoryMap = {
        q1: "E",
        q2: "E",
        q3: "P",
        q4: "P",
        q5: "P",
        q6: "P",
        q7: "E",
        q8: "P",
        q9: "E"
    };

    // 필수 문항 체크 + 유효성 검사
    for (const key of keys) {
        if (data[key] === undefined) {
            return res.status(400).json({
                result: "fail",
                message: `필수 문항(${key})이 누락되었습니다`
            });
        }
        if (![0,1,2,3].includes(data[key])) {
            return res.status(400).json({
                result: "fail",
                message: `문항(${key})은 0~3 중 하나여야 합니다`
            });
        }
    }

    // 총점 & E/P 점수 계산
    let totalScore = 0;
    let emotionalScore = 0; // E
    let physicalScore = 0;  // P

    keys.forEach(key => {
        const score = data[key];
        totalScore += score;

        if (categoryMap[key] === "E") emotionalScore += score;
        else if (categoryMap[key] === "P") physicalScore += score;
    });

    return res.json({
        result: "success",
        totalScore: totalScore,
        emotionalScore: emotionalScore,
        physicalScore: physicalScore
    });
});


// -----------------------------
// GAD-7 (7문항)
// -----------------------------
router.post("/gad7", (req, res) => {
    const data = req.body;

    const keys = ["q1","q2","q3","q4","q5","q6","q7"];

    // 각 문항별 E / P 분류
    const categoryMap = {
        q1: "E",
        q2: "P",
        q3: "P",
        q4: "P",
        q5: "P",
        q6: "E",
        q7: "E"
    };

    // 필수 문항 체크 + 유효성 검사
    for (const key of keys) {
        if (data[key] === undefined) {
            return res.status(400).json({
                result: "fail",
                message: `필수 문항(${key})이 누락되었습니다`
            });
        }
        if (![0,1,2,3].includes(data[key])) {
            return res.status(400).json({
                result: "fail",
                message: `문항(${key})은 0~3 중 하나여야 합니다`
            });
        }
    }

    // 총점 & E/P 계산
    let totalScore = 0;
    let emotionalScore = 0; // E
    let physicalScore = 0;  // P

    keys.forEach(key => {
        const score = data[key];
        totalScore += score;

        if (categoryMap[key] === "E") emotionalScore += score;
        else if (categoryMap[key] === "P") physicalScore += score;
    });

    return res.json({
        result: "success",
        totalScore: totalScore,
        emotionalScore: emotionalScore,
        physicalScore: physicalScore
    });
});


// -----------------------------
// PSS (10문항, 선택지 0~4, 일부 문항 역채점)
// -----------------------------
router.post("/pss10", (req, res) => {
    const data = req.body;

    const keys = [
        "q1","q2","q3","q4","q5",
        "q6","q7","q8","q9","q10"
    ];

    // E = 정서적 / P = 신체적
    const categoryMap = {
        q1: "E",
        q2: "P",
        q3: "E",
        q4: "P", // 역문항
        q5: "P", // 역문항
        q6: "P",
        q7: "E", // 역문항
        q8: "P", // 역문항
        q9: "E",
        q10: "P"
    };

    // 역문항 리스트
    const reverseItems = ["q4", "q5", "q7", "q8"];

    // 필수 문항 체크 + 유효성 검사
    for (const key of keys) {
        if (data[key] === undefined) {
            return res.status(400).json({
                result: "fail",
                message: `필수 문항(${key})이 누락되었습니다`
            });
        }
        if (![0,1,2,3,4].includes(data[key])) {
            return res.status(400).json({
                result: "fail",
                message: `문항(${key})은 0~4 중 하나여야 합니다`
            });
        }
    }

    // 총점 + E/P 계산
    let totalScore = 0;
    let emotionalScore = 0; // E 정서적
    let physicalScore = 0;  // P 신체적

    keys.forEach(key => {
        let score = data[key];

        // 역문항 처리
        if (reverseItems.includes(key)) {
            score = 4 - score; // 반전 점수
        }

        totalScore += score;

        if (categoryMap[key] === "E") emotionalScore += score;
        else if (categoryMap[key] === "P") physicalScore += score;
    });

    return res.json({
        result: "success",
        totalScore: totalScore,
        emotionalScore: emotionalScore,
        physicalScore: physicalScore
    });
});


module.exports = router;