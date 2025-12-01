import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useAuthStore } from "../../store/authstore"; 

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
  const navigate = useNavigate(); 
  const inputId = useRef();
  const inputPw = useRef();
  const [error, setError] = useState("");
  const { setAuth } = useAuthStore();

  const tryLogin = async () => {
    const account_id = inputId.current.value.trim();
    const user_pw = inputPw.current.value.trim();

    if (!account_id || !user_pw) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/user/login", {
        account_id,
        user_pw,
      });

      if (res.data.result === "success") {

        // 토큰 관련
        const { accessToken, refreshToken, user } = res.data;
        // 상태 관리 스토어에 토큰과 사용자 정보 저장
        setAuth({ accessToken, refreshToken, user });
        // 로컬 스토리지에 리프레시 토큰 저장
        localStorage.setItem("refreshToken", refreshToken);
        // 추가로 사용자 정보를 로컬 스토리지에 저장 (필요시)

        alert("로그인 성공!");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onClose();
        navigate("/home");
      } else {
        setError(res.data.message || "아이디 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <div style={modalHeader}>
          <h2>로그인</h2>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>

        <p style={{ marginBottom: "18px", fontSize: "14px" }}>
          계정에 로그인하여 서비스를 이용하세요.
        </p>

        <label>아이디</label>
        <input 
          ref={inputId} 
          type="text" 
          style={inputStyle} 
          placeholder="아이디" 
        />

        <label>비밀번호</label>
        <input 
          ref={inputPw} 
          type="password" 
          style={inputStyle} 
          placeholder="비밀번호" 
        />

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginTop: "-8px" }}>
            {error}
          </p>
        )}

        <button style={actionBtn} onClick={tryLogin}>
          로그인
        </button>

        <p style={{ marginTop: "16px", fontSize: "13px", textAlign: "center" }}>
          계정이 없으신가요?{" "}
          <span style={smallLink} onClick={onOpenJoin}>회원가입</span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
