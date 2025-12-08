const express = require("express");
const router = express.Router();
const conn = require("../config/database");

/* =======================================
    Todo 추가 (프론트 date 완전 반영)
======================================= */
router.post("/AddTodo", (req, res) => {
  const { uid, content, date } = req.body;

  if (!uid || !content) {
    return res.status(400).json({ message: "uid 또는 content 누락" });
  }

  // 🔥 date가 오면 그대로 사용, 안 오면 오늘 날짜
  let todoDate = date;

  if (!todoDate) {
    todoDate = new Date().toLocaleDateString("sv-SE"); // yyyy-mm-dd
  } else {
    // 🔥 프론트가 yyyy-mm-dd가 아닌 경우 대비 변환
    todoDate = new Date(todoDate).toLocaleDateString("sv-SE");
  }

  const sql = `
    INSERT INTO todo (user_id, todo_date, content, completion)
    VALUES (?, ?, ?, 0)
  `;

  conn.query(sql, [uid, todoDate, content], (err, result) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ message: "DB 저장 실패" });
    }

    return res.json({
      message: "Todo 추가 성공",
      todo_id: result.insertId,
      saved_date: todoDate, // 디버그용
    });
  });
});

/* =======================================
    Todo 삭제
======================================= */
router.post("/DeleteTodo", (req, res) => {
  const { uid, tid } = req.body;

  if (!uid || !tid) {
    return res.status(400).json({ message: "uid 또는 tid 누락" });
  }

  const sql = `DELETE FROM todo WHERE todo_id = ? AND user_id = ?`;

  conn.query(sql, [tid, uid], (err) => {
    if (err) {
      console.error("DB Delete Error:", err);
      return res.status(500).json({ message: "DB 삭제 실패" });
    }
    return res.json({ message: "Todo 삭제 성공" });
  });
});

/* =======================================
    체크토글
======================================= */
router.post("/ToggleTodo", (req, res) => {
  const { uid, tid } = req.body;

  if (!uid || !tid) {
    return res.status(400).json({ message: "uid 또는 tid 누락" });
  }

  const sql = `
    UPDATE todo
    SET completion = NOT completion
    WHERE todo_id = ? AND user_id = ?
  `;

  conn.query(sql, [tid, uid], (err) => {
    if (err) {
      console.error("DB Toggle Error:", err);
      return res.status(500).json({ message: "상태 변경 실패" });
    }
    return res.json({ message: "Todo 상태 토글 성공" });
  });
});

/* =======================================
    특정 날짜 Todo 조회
======================================= */
router.post("/GetTodos", (req, res) => {
  const { uid, date } = req.body;

  if (!uid || !date) {
    return res.status(400).json({ message: "uid 또는 date 누락" });
  }

  const queryDate = new Date(date).toLocaleDateString("sv-SE");

  const sql = `
    SELECT
      todo_id AS id,
      content,
      CAST(completion AS UNSIGNED) AS is_done
    FROM todo
    WHERE user_id = ? AND todo_date = ?
    ORDER BY todo_id DESC
  `;

  conn.query(sql, [uid, queryDate], (err, result) => {
    if (err) {
      console.error("DB Select Error:", err);
      return res.status(500).json({ message: "DB 조회 실패" });
    }

    return res.json({
      message: "조회 성공",
      todos: result,
      date: queryDate,
    });
  });
});
module.exports = router;
