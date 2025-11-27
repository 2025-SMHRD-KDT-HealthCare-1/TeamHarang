/**
const express = require('express');
const conn = require('../config/database');
const router = express.Router();


function query(sql, params) {                // sql문과 바인딩할 params(배열)를 받는 함수 선언
    return new Promise((resolve, reject) => { // Promise 생성: 비동기 작업의 성공/실패를 제어
        conn.query(sql, params, (err, rows) => { // MySQL 쿼리 실행 (기존 콜백 방식)
            if (err) reject(err);            // 쿼리 실패 → Promise의 실패(reject)로 전달
            else resolve(rows);              // 쿼리 성공 → 조회된 결과 rows를 resolve로 반환
        });
    });
}


router.get('/', async (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.status(400).send("uid 값이 필요합니다.");
    }


    const queries = {
        // 최근 설문 3개
        latestSurveyEach: `
            SELECT insepection_type, insepection_date, response_score, score_level
            FROM survey_response
            WHERE uid = ?
            ORDER BY insepection_date DESC
            LIMIT 3
        `,

        // 최신 투두 1개
        latestTodo: `
            SELECT *
            FROM todolist
            WHERE uid = ?
            ORDER BY date DESC
            LIMIT 1
        `
    };

    try {
        const [
            surveyEach,
            todo
        ] = await Promise.all([
            query(queries.latestSurveyEach, [uid]),
            query(queries.latestTodo, [uid])
        ]);

        res.send({
            surveyEach: surveyEach || [],
            todo: todo[0] || null
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("데이터 로딩 실패");
    }
});

module.exports = router; */


const express = require('express');
const conn = require('../config/database');
const router = express.Router();

function query(sql, params) {
    return new Promise((resolve, reject) => {
        conn.query(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

router.post('/', async (req, res) => {
    const { uid } = req.body;

    if (!uid) {
        return res.status(400).send("uid 값이 필요합니다.");
    }

    const queries = {
        latestSurveyEach: `
            SELECT insepection_type, insepection_date, response_score, score_level
            FROM survey_response
            WHERE uid = ?
            ORDER BY insepection_date DESC
            LIMIT 3
        `,
        latestTodo: `
            SELECT *
            FROM todolist
            WHERE uid = ?
            ORDER BY date DESC
            LIMIT 1
        `
    };

    try {
        const [surveyEach, todo] = await Promise.all([
            query(queries.latestSurveyEach, [uid]),
            query(queries.latestTodo, [uid])
        ]);

        res.send({
            surveyEach: surveyEach || [],
            todo: todo[0] || null
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("데이터 로딩 실패");
    }
});

module.exports = router;
