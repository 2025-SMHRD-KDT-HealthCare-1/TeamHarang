// src/pages/TodoList.jsx
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import styles from "./TodoList.module.css";

export default function TodoList() {
  const yesterdayPercent = useRef(0);
  const yesterdayDone = useRef(0);
  const yesterdayTotal = useRef(0);

  const weekPercent = useRef(0);
  const weekDone = useRef(0);
  const weekTotal = useRef(0);

  const monthPercent = useRef(0);
  const monthDone = useRef(0);
  const monthTotal = useRef(0);

  const [, setRefresh] = useState(0);

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!userId || !token) return;

    axios
      .get("http://localhost:3001/api/progress/all", {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;

        yesterdayPercent.current = data.yesterdayPercent;
        yesterdayDone.current = data.yesterdayDone;
        yesterdayTotal.current = data.yesterdayTotal;

        weekPercent.current = data.weekPercent;
        weekDone.current = data.weekDone;
        weekTotal.current = data.weekTotal;

        monthPercent.current = data.monthPercent;
        monthDone.current = data.monthDone;
        monthTotal.current = data.monthTotal;

        setRefresh((prev) => prev + 1);
      })
      .catch((err) => console.error("달성도 조회 실패:", err));
  }, [userId, token]);

  return (
    <div className={styles.wrapper}>

      {/* LEFT AREA */}
      <div className={styles.left}>
        <div className={styles.calendarBox}>Calendar</div>

        <div className={styles.todoBox}>
          <h3>그날의 투두리스트</h3>
          <p>할 일 목록 들어갈 예정</p>
        </div>
      </div>

      {/* RIGHT AREA */}
      <div className={styles.right}>

        {/* 상단 2개 카드 */}
        <div className={styles.topRow}>
          <div className={styles.smallCard}>
            <h3>오늘 할일 추가</h3>
            <p>여기에 입력폼들</p>
          </div>

          <div className={styles.smallCard}>
            <h3>내일 할일 추가</h3>
            <p>내일 할일 추가 폼 예정</p>
          </div>
        </div>

        {/* 하단 달성도 */}
        <div className={styles.bottomLarge}>
          <h3>이번 주 / 이번 달 달성도</h3>

          <p>어제: {yesterdayPercent.current}%</p>
          <p>이번 주: {weekPercent.current}%</p>
          <p>이번 달: {monthPercent.current}%</p>
        </div>
      </div>

    </div>
  );
}
