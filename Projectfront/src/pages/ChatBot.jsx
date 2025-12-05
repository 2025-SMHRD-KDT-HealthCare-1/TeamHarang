import React, { useState } from "react";
import styles from "./ChatBot.module.css";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const send = async () => {
    const token = localStorage.getItem("accessToken"); 

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
    <div className={styles.pageWrapper}>
      <div className={styles.inner}>
        
        <div className={styles.title}>
          <span></span> MindCare 상담봇
        </div>

        <div className={styles.chatBox}>
          {messages.map((msg, i) => (
            <div key={i} className={styles.message}>
              <b>{msg.role === "user" ? "나" : "상담봇"}</b>
              <div>{msg.content}</div>
            </div>
          ))}
        </div>

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder="하고 싶은 이야기를 들려주세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className={styles.button} onClick={send}>
            보내기
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatBot;
