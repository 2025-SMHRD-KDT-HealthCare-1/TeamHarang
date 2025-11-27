import React from "react";
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
  // const res = await fetch("http://localhost:3000/user/login",{
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ id, pw }),
  // })
  // const data = await res.json()

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
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
        />

        <label style={{ fontSize: "14px" }}>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            fontSize: "13px",
          }}
        >
          <label>
            <input type="checkbox" /> 로그인 상태 유지
          </label>
          <span style={smallLink}>비밀번호 찾기</span>
        </div>

        <button style={actionBtn}>로그인</button>

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
