import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

// -----------------------------------------------------------
// JoinModal COMPONENT (최종 완성본)
// -----------------------------------------------------------
const JoinModal = ({ onClose, onOpenLogin }) => {
  const inputId = useRef();
  const inputPw = useRef();
  const inputPwCheck = useRef();
  const inputEmail = useRef();
  const inputName = useRef();
  const inputBirth = useRef();
  const inputGender = useRef();

  const navigate = useNavigate();

  const tryJoin = async () => {
    const account_id = inputId.current.value.trim();
    const user_pw = inputPw.current.value.trim();
    const pwCheck = inputPwCheck.current.value.trim();
    const user_email = inputEmail.current.value.trim();
    const user_name = inputName.current.value.trim();
    const birth = inputBirth.current.value; // date는 value 자체 확인
    const gender = inputGender.current.value;

    // 🔥 콘솔에 전송값 출력 (문제 파악용 / 나중에 제거해도 됨)
    console.log("보내는 값:", {
      account_id,
      user_pw,
      user_name,
      user_email,
      birth,
      gender: gender === "남성" ? "M" : "F"
    });

    // 🔥 빈 값 검사 (핵심)
    if (
      !account_id ||
      !user_pw ||
      !pwCheck ||
      !user_email ||
      !user_name ||
      birth.trim() === "" ||
      gender === "성별 선택"
    ) {
      alert("모든 값을 입력해주세요!");
      return;
    }

    if (user_pw !== pwCheck) {
      alert("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/user/join", {
        account_id,
        user_pw,
        user_name,
        user_email,
        birth,
        gender: gender === "남성" ? "M" : "F",
      });

      if (res.data.result === "success") {
        alert("회원가입 성공! 로그인해주세요.");
        onOpenLogin();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("JOIN ERROR:", err);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <div style={modalHeader}>
          <h2>회원가입</h2>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>

        <p style={{ marginBottom: "18px", fontSize: "14px" }}>
          새로운 계정을 만들어 MindCare를 시작하세요.
        </p>

        <label>아이디</label>
        <input ref={inputId} type="text" style={inputStyle} placeholder="아이디" />

        <label>비밀번호</label>
        <input ref={inputPw} type="password" style={inputStyle} placeholder="비밀번호" />

        <label>비밀번호 확인</label>
        <input ref={inputPwCheck} type="password" style={inputStyle} placeholder="비밀번호 확인" />

        <label>이메일</label>
        <input ref={inputEmail} type="email" style={inputStyle} placeholder="example@email.com" />

        <label>이름</label>
        <input ref={inputName} type="text" style={inputStyle} placeholder="이름" />

        <label>생년월일</label>
        <input ref={inputBirth} type="date" style={inputStyle} />

        <label>성별</label>
        <select ref={inputGender} style={inputStyle}>
          <option>성별 선택</option>
          <option>남성</option>
          <option>여성</option>
        </select>

        <button style={actionBtn} onClick={tryJoin}>
          회원가입
        </button>

        <p style={{ marginTop: "16px", fontSize: "13px", textAlign: "center" }}>
          이미 계정이 있으신가요?{" "}
          <span style={smallLink} onClick={onOpenLogin}>로그인</span>
        </p>
      </div>
    </div>
  );
};

export default JoinModal;
