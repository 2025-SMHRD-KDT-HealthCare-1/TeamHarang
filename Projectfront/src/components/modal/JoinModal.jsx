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
  const [form, setForm] = useState({
    id: "",
    pw: "",
    pw2: "",
    email: "",
    name: "",
    birth: "",
    gender: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.pw !== form.pw2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/join", {
        id: form.id,
        pw: form.pw,
        email: form.email,
        name: form.name,
        birth: form.birth,
        gender: form.gender,
      });

      if (res.data.success) {
        alert("회원가입 완료!");
        onClose();
        onOpenLogin();
      } else {
        alert(res.data.message || "회원가입 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류: 회원가입 실패");
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
        <input name="id" style={inputStyle} onChange={handleChange} />

        <label>비밀번호</label>
        <input type="password" name="pw" style={inputStyle} onChange={handleChange} />

        <label>비밀번호 확인</label>
        <input type="password" name="pw2" style={inputStyle} onChange={handleChange} />

        <label>이메일</label>
        <input name="email" style={inputStyle} onChange={handleChange} />

        <label>이름</label>
        <input name="name" style={inputStyle} onChange={handleChange} />

        <label>생년월일</label>
        <input type="date" name="birth" style={inputStyle} onChange={handleChange} />

        <label>성별</label>
        <select name="gender" style={inputStyle} onChange={handleChange}>
          <option value="">성별 선택</option>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>

        <button style={actionBtn} onClick={handleSubmit}>회원가입</button>

        <p style={{ marginTop: "16px", textAlign: "center" }}>
          이미 계정이 있으신가요?{" "}
          <span style={smallLink} onClick={onOpenLogin}>로그인</span>
        </p>
      </div>
    </div>
  );
};

export default JoinModal;
