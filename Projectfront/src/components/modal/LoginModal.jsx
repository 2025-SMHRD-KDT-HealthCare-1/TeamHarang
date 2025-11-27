import React, { useState } from "react";
import axios from "axios";

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalBox = {
  width: "420px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "white",
  borderRadius: "12px",
  padding: "24px 28px 30px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
  position: "relative",
};

/* 🔥 누락된 부분 → 반드시 필요 */
const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const closeBtn = {
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "6px",
  marginBottom: "12px",
  fontSize: "14px",
};

const actionBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#2f73ff",
  color: "white",
  fontWeight: 600,
  fontSize: "15px",
  marginTop: "8px",
  cursor: "pointer",
};

const smallLink = {
  color: "#2f73ff",
  cursor: "pointer",
};

const LoginModal = ({ onClose, onOpenJoin }) => {
  // 입력값
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!userId.trim() || !pw.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/login", {
        id: userId,
        pw: pw,
      });

      if (response.data.success) {
        alert("로그인 성공!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        onClose();
      } else {
        setError("아이디 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        
        {/* 모달 헤더 */}
        <div style={modalHeader}>
          <h2>로그인</h2>
          <button style={closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <p style={{ marginBottom: "18px", fontSize: "14px" }}>
          계정에 로그인하여 서비스를 이용하세요.
        </p>

        <label style={{ fontSize: "14px" }}>아이디</label>
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          style={inputStyle}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <label style={{ fontSize: "14px" }}>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          style={inputStyle}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {/* 에러 메시지 */}
        {error && (
          <p style={{ color: "red", fontSize: "13px", marginTop: "-8px" }}>
            {error}
          </p>
        )}

        <button style={actionBtn} onClick={handleLogin}>
          로그인
        </button>

        <p
          style={{
            marginTop: "16px",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          계정이 없으신가요?{" "}
          <span style={smallLink} onClick={onOpenJoin}>
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
