const express = require("express")
const router = express.Router()
const conn = require("../config/database")  // DB 쓰게 되면 이 형태로 사용

let todo = [
    { tid : 1, content : "뭐할까", completion : true }
];

// todo 전체 조회 (GET /todo)
// router.get('/', (req, res) => {
//     res.json(todo)
// });

// 1. 오늘 날짜 Todo 추가
router.post('/AddTod', (req, res) => {
    const { uid, content } = req.body;

    if (!uid || !content) {
        return res.status(400).json({ message: "uid 또는 content가 누락되었습니다." });
    }

    const today = new Date();
    const formatted = today.toISOString().split('T')[0];  // YYYY-MM-DD 형식

    const sql = `
        INSERT INTO todo (user_id, todo_date, content, completion)
        VALUES (?, ?, ?, false)
    `;

    conn.query(sql, [uid, formatted, content], (err, result) => {
        if (err) {
            console.error("DB Insert Error:", err);
            return res.status(500).json({ message: "DB 저장 실패" });
        }
        return res.json({ message: "오늘 날짜 Todo 추가 성공", todo_id: result.insertId });
    });
});

// 2. 내일 날짜 Todo 추가
router.post('/AddTom', (req, res) => {
    const { uid, content } = req.body;

    if (!uid || !content) {
        return res.status(400).json({ message: "uid 또는 content가 누락되었습니다." });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = tomorrow.toISOString().split('T')[0];

    const sql = `
        INSERT INTO todo (user_id, todo_date, content, completion)
        VALUES (?, ?, ?, false)
    `;

    conn.query(sql, [uid, formatted, content], (err, result) => {
        if (err) {
            console.error("DB Insert Error:", err);
            return res.status(500).json({ message: "DB 저장 실패" });
        }
        return res.json({ message: "내일 날짜 Todo 추가 성공", todo_id: result.insertId });
    });
});


// 특정 todo 삭제
router.post('/DeleteTodo', (req, res) => {
    const { uid, tid } = req.body;

    if (!uid || !tid) {
        return res.status(400).json({ message: "uid 또는 tid가 누락되었습니다." });
    }

    const sql = `
        DELETE FROM todo
        WHERE todo_id = ? AND user_id = ?
    `;

    conn.query(sql, [tid, uid], (err, result) => {
        if (err) {
            console.error("DB Delete Error:", err);
            return res.status(500).json({ message: "DB 삭제 실패" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "삭제할 Todo가 없거나 권한이 없습니다."
            });
        }

        return res.json({ message: "Todo 삭제 성공" });
    });
});

// 특정 todo 완료여부
router.post('/ToggleTodo', (req, res) => {
    const { uid, tid } = req.body;

    if (!uid || !tid) {
        return res.status(400).json({ message: "uid 또는 tid가 누락되었습니다." });
    }

    // completion = NOT completion 로 true<=>false 반전
    const sql = `
        UPDATE todo
        SET completion = NOT completion
        WHERE todo_id = ? AND user_id = ?
    `;

    conn.query(sql, [tid, uid], (err, result) => {
        if (err) {
            console.error("DB Toggle Error:", err);
            return res.status(500).json({ message: "상태 반전 실패" });
        }

        // 일치하는 row가 없으면 실패 처리
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "해당 Todo가 없거나 권한이 없습니다."
            });
        }

        return res.json({ message: "Todo 상태 반전 성공" });
    });
});

// 오늘, 내일 날짜에 대한 화면 요청
router.post('/GetTodos', (req, res) => {
    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ message: "uid가 누락되었습니다." });
    }

    // 오늘 날짜
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 내일 날짜
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const sql = `
        SELECT todo_id, user_id, todo_date, content, completion
        FROM todo
        WHERE user_id = ?
          AND (todo_date = ? OR todo_date = ?)
        ORDER BY todo_date ASC, todo_id ASC
    `;

    conn.query(sql, [uid, todayStr, tomorrowStr], (err, result) => {
        if (err) {
            console.error("DB Select Error:", err);
            return res.status(500).json({ message: "DB 조회 실패" });
        }

        return res.json({
            message: "Todo 조회 성공",
            today: todayStr,
            tomorrow: tomorrowStr,
            todos: result
        });
    });
});

// 특정날짜에 대한 조회요청
router.post('/GetTodosByDate', (req, res) => {
    const { uid, date } = req.body;

    // 요청 값 확인
    if (!uid || !date) {
        return res.status(400).json({ message: "uid 또는 date가 누락되었습니다." });
    }

    const sql = `
        SELECT todo_id, user_id, todo_date, content, completion
        FROM todo
        WHERE user_id = ?
          AND todo_date = ?
        ORDER BY todo_id ASC
    `;

    conn.query(sql, [uid, date], (err, result) => {
        if (err) {
            console.error("DB Select Error:", err);
            return res.status(500).json({ message: "DB 조회 실패" });
        }

        return res.json({
            message: "특정 날짜 Todo 조회 성공",
            date: date,
            todos: result
        });
    });
});

module.exports = router