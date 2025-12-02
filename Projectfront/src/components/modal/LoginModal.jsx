import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./LoginModal.module.css";
import {useAuthStore} from "../../store/useAuthStore";


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
        // 로컬 스토리지에 액세스 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        // 로컬 스토리지에 리프레시 토큰 저장
        localStorage.setItem("refreshToken", refreshToken);
        // 추가로 사용자 정보를 로컬 스토리지에 저장 (필요시)
        localStorage.setItem("account_id", user.account_id);   // ⭐ 추가 1
        // 로컬스토리지에 account추가
        localStorage.setItem("user_id", user.user_id);         // ⭐ 추가 2
        // 로컬스토리지에 user추가
        localStorage.setItem("user", JSON.stringify(user));
        // Diary / Survey 저장용 UID 추가
        localStorage.setItem("uid", user.user_id);
        

        alert("로그인 성공!");
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <h2>로그인</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <p style={{ marginBottom: "18px", fontSize: "14px" }}>
          계정에 로그인하여 서비스를 이용하세요.
        </p>

        <label>아이디</label>
        <input
          ref={inputId}
          type="text"
          className={styles.inputStyle}
          placeholder="아이디"
        />

        <label>비밀번호</label>
        <input
          ref={inputPw}
          type="password"
          className={styles.inputStyle}
          placeholder="비밀번호"
        />

        {error && (
          <p className={styles.errorText}>{error}</p>
        )}

        <button className={styles.actionBtn} onClick={tryLogin}>
          로그인
        </button>

        <p style={{ marginTop: "16px", fontSize: "13px", textAlign: "center" }}>
          계정이 없으신가요?{" "}
          <span className={styles.smallLink} onClick={onOpenJoin}>회원가입</span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
