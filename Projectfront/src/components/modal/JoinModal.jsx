import React from "react";

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

const JoinModal = ({ onClose, onOpenLogin }) => {
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <div style={modalHeader}>
          <h2>회원가입</h2>
          <button style={closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <p style={{ marginBottom: "18px", fontSize: "14px" }}>
          새로운 계정을 만들어 MindCare를 시작하세요.
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

        <label style={{ fontSize: "14px" }}>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          style={inputStyle}
        />

        <label style={{ fontSize: "14px" }}>이메일</label>
        <input
          type="email"
          placeholder="example@email.com"
          style={inputStyle}
        />

        <label style={{ fontSize: "14px" }}>이름</label>
        <input
          type="text"
          placeholder="이름을 입력하세요"
          style={inputStyle}
        />

        <label style={{ fontSize: "14px" }}>생년월일</label>
        <input type="date" style={inputStyle} />

        <label style={{ fontSize: "14px" }}>성별</label>
        <select style={inputStyle}>
          <option>성별 선택</option>
          <option>남성</option>
          <option>여성</option>
        </select>

        <button style={actionBtn}>회원가입</button>

        <p
          style={{
            marginTop: "16px",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          이미 계정이 있으신가요?{" "}
          <span style={smallLink} onClick={onOpenLogin}>
            로그인
          </span>
        </p>
      </div>
    </div>
  );
};

export default JoinModal;
