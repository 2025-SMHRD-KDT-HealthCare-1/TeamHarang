import React, { useState } from "react";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const send = async () => {
  const token = localStorage.getItem("accessToken");  // ⭐ 최신 토큰 읽기

  if (!input.trim()) return;
  console.log("TOKEN:", token);

  const newMessages = [...messages, { role: "user", content: input }];
  setMessages(newMessages);

  try {
    const res = await fetch("http://localhost:3001/chatbot/chat", {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_message: input,
      }),
    });

    const data = await res.json();
    if (!data.reply) throw new Error("응답 없음");

    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setInput("");

  } catch (err) {
    console.error(err);
    alert("서버 오류가 발생했습니다.");
  }
};

  return (
    <div style={{ padding: 30 }}>
      <h2>🧠 MindCare 상담봇</h2>

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
          marginBottom: 20,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <b>{msg.role === "user" ? "나" : "상담봇"}</b>  
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{ flex: 1, padding: 12 }}
          placeholder="하고 싶은 이야기를 들려주세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button style={{ padding: "12px 20px" }} onClick={send}>
          보내기
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
