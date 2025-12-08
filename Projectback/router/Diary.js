const express = require("express")
const router = express.Router()
const conn = require("../config/database")

let dairy = [
    { did: 1, content: "크리스마스" }
]

/* ------------------------------
    1) 일기 추가
--------------------------------*/
router.post('/AddDiary', (req, res) => {
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
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "일기 저장 실패" });
            }

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
router.put("/Diary", (req, res) => {
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
        (err, result) => {
            if (err) return res.status(500).json({ message: "일기 수정 실패" });

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
router.post('/DeleteDiary', (req, res) => {
    const { user_id, date } = req.body;

    if (!user_id || !date) {
        return res.status(400).json({ message: "user_id 또는 date 누락" });
    }

    const sql = `
        DELETE FROM diary
        WHERE user_id = ? AND date = ?
    `;

    conn.query(sql, [user_id, date], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "일기 삭제 실패" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "삭제할 일기가 없음" });
        }

        return res.json({ message: "일기 삭제 성공" });
    });
});


module.exports = router;
