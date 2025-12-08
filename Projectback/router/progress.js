const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const { verifyAccessToken } = require("./Token");

// yyyy-mm-dd
function toDateStr(dateObj) {
  return dateObj.toLocaleDateString("sv-SE");
}

router.get("/all", verifyAccessToken, async (req, res) => {
  try {
    // ⭐ 프론트 userId > 토큰 user_id 순으로 읽기
    let user_id = req.query.userId || req.user.user_id;
    user_id = Number(user_id);

    if (!user_id)
      return res.status(400).json({ message: "user_id required" });

    const today = toDateStr(new Date());

    // ─────────── 어제 ───────────
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = toDateStr(y);

    const [yDone] = await conn.promise().query(
      `SELECT COUNT(*) AS cnt FROM todo 
       WHERE user_id=? AND todo_date=? AND completion=1`,
      [user_id, yesterday]
    );

    const [yTotal] = await conn.promise().query(
      `SELECT COUNT(*) AS cnt FROM todo 
       WHERE user_id=? AND todo_date=?`,
      [user_id, yesterday]
    );

    const yesterdayPercent =
      yTotal[0].cnt === 0
        ? 0
        : Math.round((yDone[0].cnt / yTotal[0].cnt) * 100);

    // ─────────── 이번 주 ───────────
    const weekStart = new Date();
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    const weekStartStr = toDateStr(weekStart);

    const [wDone] = await conn.promise().query(
      `SELECT COUNT(*) AS cnt FROM todo
       WHERE user_id=? 
       AND todo_date BETWEEN ? AND ?
       AND completion=1`,
      [user_id, weekStartStr, today]
    );

    const [wTotal] = await conn.promise().query(
      `SELECT COUNT(*) AS cnt FROM todo
       WHERE user_id=? 
       AND todo_date BETWEEN ? AND ?`,
      [user_id, weekStartStr, today]
    );

    const weekPercent =
      wTotal[0].cnt === 0
        ? 0
        : Math.round((wDone[0].cnt / wTotal[0].cnt) * 100);

    // ─────────── 이번 달 ───────────
    const monthStart = today.slice(0, 8) + "01";

    const [mDone] = await conn.promise().query(
      `SELECT COUNT(*) AS cnt FROM todo
       WHERE user_id=? 
       AND todo_date BETWEEN ? AND ?
       AND completion=1`,
      [user_id, monthStart, today]
    );

    const [mTotal] = await conn.promise().query(
      `SELECT COUNT(*) AS cnt FROM todo
       WHERE user_id=? 
       AND todo_date BETWEEN ? AND ?`,
      [user_id, monthStart, today]
    );

    const monthPercent =
      mTotal[0].cnt === 0
        ? 0
        : Math.round((mDone[0].cnt / mTotal[0].cnt) * 100);

    return res.json({
      yesterdayPercent,
      weekPercent,
      monthPercent,
      detail: { 
        yesterday, 
        weekStart: weekStartStr, 
        monthStart 
      },
    });
  } catch (err) {
    console.error("Progress API Error:", err);
    return res
      .status(500)
      .json({ message: "progress server error", detail: err.message });
  }
});

module.exports = router;
