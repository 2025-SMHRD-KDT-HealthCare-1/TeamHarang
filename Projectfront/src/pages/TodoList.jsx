// src/pages/TodoList.jsx
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./TodoList.module.css";

export default function TodoList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState([]);

  const [todayInput, setTodayInput] = useState("");
  const [tomorrowInput, setTomorrowInput] = useState("");

  const yesterdayPercent = useRef(0);
  const weekPercent = useRef(0);
  const monthPercent = useRef(0);
  const [, setRefresh] = useState(0);

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  /* ===============================
      🔥 한국 yyyy-mm-dd 변환
  =============================== */
  const toKoreanDate = (dateObj) => {
    return dateObj.toLocaleDateString("sv-SE"); // yyyy-mm-dd
  };

  /* ===============================
      특정 날짜 Todo 조회
  =============================== */
  const loadTodos = (date) => {
    const dateStr = toKoreanDate(date);

    axios
      .post(
        "http://localhost:3001/todo/GetTodos",
        { uid: userId, date: dateStr },
        { headers }
      )
      .then((res) => setTodos(res.data.todos || []))
      .catch((err) => console.error("투두 조회 실패:", err));
  };

  useEffect(() => {
    if (userId) loadTodos(selectedDate);
  }, [selectedDate]);

  /* ===============================
      🔥 달성도 불러오기
  =============================== */
  const loadProgress = () => {
    axios
      .get("http://localhost:3001/api/progress/all", {
        params: { userId },
        headers,
      })
      .then((res) => {
        yesterdayPercent.current = res.data.yesterdayPercent;
        weekPercent.current = res.data.weekPercent;
        monthPercent.current = res.data.monthPercent;
        setRefresh((prev) => prev + 1);
      })
      .catch((err) => console.error("달성도 조회 실패:", err));
  };

  useEffect(() => {
    if (!userId || !token) return;
    loadProgress();
  }, [userId, token]);

  /* ===============================
      오늘 Todo 추가
  =============================== */
  const addTodayTodo = () => {
    if (!todayInput.trim()) return;

    const dateStr = toKoreanDate(new Date());

    axios
      .post(
        "http://localhost:3001/todo/AddTodo",
        {
          uid: userId,
          content: todayInput,
          date: dateStr,
        },
        { headers }
      )
      .then(() => {
        setTodayInput("");

        // 오늘 선택돼있으면 바로 반영
        if (isTodaySelected()) loadTodos(selectedDate);

        // 🔥 달성도 반영
        loadProgress();
      })
      .catch((err) => console.error("오늘 할 일 추가 실패:", err));
  };

  /* ===============================
      내일 Todo 추가
  =============================== */
  const addTomorrowTodo = () => {
    if (!tomorrowInput.trim()) return;

    const t = new Date();
    t.setDate(t.getDate() + 1);
    const dateStr = toKoreanDate(t);

    axios
      .post(
        "http://localhost:3001/todo/AddTodo",
        {
          uid: userId,
          content: tomorrowInput,
          date: dateStr,
        },
        { headers }
      )
      .then(() => {
        setTomorrowInput("");

        if (isTomorrowSelected()) loadTodos(selectedDate);

        // 🔥 달성도 반영
        loadProgress();
      })
      .catch((err) => console.error("내일 할 일 추가 실패:", err));
  };

  /* ===============================
      완료 토글
  =============================== */
  const toggleTodo = (tid) => {
    axios
      .post(
        "http://localhost:3001/todo/ToggleTodo",
        { uid: userId, tid },
        { headers }
      )
      .then(() => {
        loadTodos(selectedDate);

        // 🔥 달성도 반영
        loadProgress();
      })
      .catch((err) => console.error("토글 실패:", err));
  };

  /* ===============================
      삭제
  =============================== */
  const deleteTodo = (tid) => {
    axios
      .post(
        "http://localhost:3001/todo/DeleteTodo",
        { uid: userId, tid },
        { headers }
      )
      .then(() => {
        loadTodos(selectedDate);

        // 🔥 달성도 반영
        loadProgress();
      })
      .catch((err) => console.error("삭제 실패:", err));
  };

  /* ===============================
      오늘 / 내일 판별
  =============================== */
  const isTodaySelected = () =>
    toKoreanDate(selectedDate) === toKoreanDate(new Date());

  const isTomorrowSelected = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return toKoreanDate(selectedDate) === toKoreanDate(t);
  };

  return (
    <div className={styles.wrapper}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.calendarBox}>
          <Calendar value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div className={styles.todoBox}>
          <h3>그날의 투두리스트</h3>

          {todos.length === 0 ? (
            <p>등록된 할 일이 없습니다.</p>
          ) : (
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  <input
                    type="checkbox"
                    checked={todo.is_done === 1}
                    onChange={() => toggleTodo(todo.id)}
                    style={{ marginRight: "8px" }}
                  />

                  <span
                    style={{
                      textDecoration: todo.is_done ? "line-through" : "none",
                      opacity: todo.is_done ? 0.6 : 1,
                    }}
                  >
                    {todo.content}
                  </span>

                  <button onClick={() => deleteTodo(todo.id)}>삭제</button>
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
            <input
              type="text"
              value={todayInput}
              onChange={(e) => setTodayInput(e.target.value)}
              placeholder="오늘 할 일"
            />
            <button onClick={addTodayTodo}>추가</button>
          </div>

          <div className={styles.smallCard}>
            <h3>내일 할일 추가</h3>
            <input
              type="text"
              value={tomorrowInput}
              onChange={(e) => setTomorrowInput(e.target.value)}
              placeholder="내일 할 일"
            />
            <button onClick={addTomorrowTodo}>추가</button>
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
