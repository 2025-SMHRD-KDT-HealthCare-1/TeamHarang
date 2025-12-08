// src/pages/TodoList.jsx
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";          //  캘린더 컴포넌트
import "react-calendar/dist/Calendar.css";      //  기본 스타일 적용
import styles from "./TodoList.module.css";

export default function TodoList() {
  const [selectedDate, setSelectedDate] = useState(new Date()); //  선택한 날짜
  const [todos, setTodos] = useState([]);                        //  선택 날짜의 투두 리스트

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

  /* ===============================
        달력 날짜 변경 → 투두 조회
     =============================== */
  useEffect(() => {
    if (!userId) return;

    const dateStr = selectedDate.toISOString().split("T")[0];

    axios
      .post("http://localhost:3001/api/todo/GetTodos", {
        uid: userId,
        date: dateStr,
      })
      .then((res) => {
        setTodos(res.data.todos || []);
      })
      .catch((err) => console.error("투두 조회 실패:", err));
  }, [selectedDate, userId]);

  /* ===============================
        달성도 조회
     =============================== */
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
        weekPercent.current = data.weekPercent;
        monthPercent.current = data.monthPercent;

        setRefresh((prev) => prev + 1);
      })
      .catch((err) => console.error("달성도 조회 실패:", err));
  }, [userId, token]);

  return (
    <div className={styles.wrapper}>

      {/* LEFT */}
      <div className={styles.left}>
        
        {/* 캘린더 영역 */}
        <div className={styles.calendarBox}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
          />
        </div>

        {/*  날짜에 따른 투두 리스트 */}
        <div className={styles.todoBox}>
          <h3>그날의 투두리스트</h3>
          {todos.length === 0 ? (
            <p>등록된 할 일이 없습니다.</p>
          ) : (
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  {todo.is_done ? "✔️ " : "⬜ "} {todo.content}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>

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
