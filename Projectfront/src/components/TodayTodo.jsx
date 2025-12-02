// src/components/TodayTodo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TodayTodo.module.css";

const TodayTodo = ({ userId }) => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!userId) return;

    const fetchTodos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/todos/today", {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) setTodos(res.data.todos);
      } catch (err) {
        console.error("오늘의 할 일 불러오기 실패", err);
      }
    };

    fetchTodos();
  }, [userId, token]);

  const handleAdd = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/api/todos/today",
        { userId, content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newTodo = { id: res.data.id, content: text, is_done: 0 };
        setTodos((prev) => [newTodo, ...prev]);
        setText("");
      }
    } catch (err) {
      console.error("오늘의 할 일 추가 실패", err);
    }
  };

  const handleToggle = async (id, current) => {
    try {
      const newValue = current ? 0 : 1;

      const res = await axios.patch(
        `http://localhost:3001/api/todos/today/${id}`,
        { isDone: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTodos((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, is_done: newValue } : t
          )
        );
      }
    } catch (err) {
      console.error("완료 상태 변경 실패", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/api/todos/today/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* 입력 */}
      <div className={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘 할 일을 입력하세요"
          className={styles.input}
        />

        <button onClick={handleAdd} className={styles.addBtn}>
          추가
        </button>
      </div>

      {/* 리스트 */}
      {todos.length === 0 ? (
        <p className={styles.empty}>아직 등록된 할 일이 없어요.</p>
      ) : (
        <ul className={styles.list}>
          {todos.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={item.is_done === 1}
                  onChange={() => handleToggle(item.id, item.is_done === 1)}
                />

                <span
                  className={
                    item.is_done === 1 ? styles.textDone : styles.text
                  }
                >
                  {item.content}
                </span>
              </label>

              <button
                onClick={() => handleDelete(item.id)}
                className={styles.deleteBtn}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodayTodo;
