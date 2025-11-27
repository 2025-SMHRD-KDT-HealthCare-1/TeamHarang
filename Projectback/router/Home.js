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
