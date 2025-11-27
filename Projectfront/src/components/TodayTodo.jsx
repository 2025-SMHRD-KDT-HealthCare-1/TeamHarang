// src/components/TodayTodo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TodayTodo = ({ userId }) => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // ✅ 1) 처음 마운트 시 / userId 바뀔 때 목록 불러오기
  useEffect(() => {
    if (!userId) return;

    const fetchTodos = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/todos/today", {
          params: { userId },
        });

        if (res.data.success) {
          setTodos(res.data.todos);
        }
      } catch (err) {
        console.error("오늘의 할 일 불러오기 실패", err);
      }
    };

    fetchTodos();
  }, [userId]);

  // ✅ 2) 추가
  const handleAdd = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post("http://localhost:8080/api/todos/today", {
        userId,
        content: text,
      });

      if (res.data.success) {
        // 새로고침 대신 프론트에서 목록에 바로 추가
        const newTodo = {
          id: res.data.id,
          content: text,
          is_done: 0,
        };
        setTodos((prev) => [newTodo, ...prev]);
        setText("");
      }
    } catch (err) {
      console.error("오늘의 할 일 추가 실패", err);
    }
  };

  // ✅ 3) 완료 토글
  const handleToggle = async (id, current) => {
    try {
      const newValue = current ? 0 : 1;
      const res = await axios.patch(
        `http://localhost:8080/api/todos/today/${id}`,
        { isDone: newValue }
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

  // ✅ 4) 삭제
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/todos/today/${id}`
      );

      if (res.data.success) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  return (
    <div style={{ fontSize: "14px" }}>
      {/* 입력 영역 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘 할 일을 입력하세요"
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#d35400",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          추가
        </button>
      </div>

      {/* 리스트 영역 */}
      {todos.length === 0 ? (
        <p style={{ color: "#666" }}>아직 등록된 할 일이 없어요.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {todos.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #f3cda4",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={item.is_done === 1}
                  onChange={() => handleToggle(item.id, item.is_done === 1)}
                />
                <span
                  style={{
                    textDecoration: item.is_done === 1 ? "line-through" : "none",
                    color: item.is_done === 1 ? "#999" : "#333",
                  }}
                >
                  {item.content}
                </span>
              </label>

              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#c0392b",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
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
