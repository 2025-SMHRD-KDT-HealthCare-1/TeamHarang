const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 오늘 Todo 추가
router.post("/AddTodo", (req, res) => {
  const { uid, content } = req.body;

  if (!uid || !content) {
    return res.status(400).json({ message: "uid 또는 content 누락" });
  }

  const today = new Date().toISOString().split("T")[0];

  const sql = `
    INSERT INTO todo (user_id, todo_date, content, completion)
    VALUES (?, ?, ?, 0)
  `;

  conn.query(sql, [uid, today, content], (err, result) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ message: "DB 저장 실패" });
    }
    return res.json({
      message: "오늘 Todo 추가 성공",
      todo_id: result.insertId,
    });
  });
});

// Todo 삭제
router.post("/DeleteTodo", (req, res) => {
  const { uid, tid } = req.body;

  if (!uid || !tid) {
    return res.status(400).json({ message: "uid 또는 tid 누락" });
  }

  const sql = `DELETE FROM todo WHERE todo_id = ? AND user_id = ?`;

  conn.query(sql, [tid, uid], (err, result) => {
    if (err) {
      console.error("DB Delete Error:", err);
      return res.status(500).json({ message: "DB 삭제 실패" });
    }

    return res.json({ message: "Todo 삭제 성공" });
  });
});

// Todo 완료 여부 토글
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

  conn.query(sql, [tid, uid], (err, result) => {
    if (err) {
      console.error("DB Toggle Error:", err);
      return res.status(500).json({ message: "상태 변경 실패" });
    }

    return res.json({ message: "Todo 상태 반전 성공" });
  });
});

// 오늘 Todo 목록 조회
router.post("/GetTodos", (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: "uid 누락" });
  }

  const today = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT
      todo_id AS id,
      content,
      completion AS is_done
    FROM todo
    WHERE user_id = ? AND todo_date = ?
    ORDER BY todo_id DESC
  `;

  conn.query(sql, [uid, today], (err, result) => {
    if (err) {
      console.error("DB Select Error:", err);
      return res.status(500).json({ message: "DB 조회 실패" });
    }

    return res.json({
      message: "조회 성공",
      todos: result,
    });
  });
});

module.exports = router;
