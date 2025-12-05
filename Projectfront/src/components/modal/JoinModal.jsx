import React, { useRef } from "react";
import axios from "axios";
import styles from "./JoinModal.module.css";

const JoinModal = ({ onClose, onOpenLogin }) => {
  const inputId = useRef();
  const inputPw = useRef();
  const inputPwCheck = useRef();
  const inputEmail = useRef();
  const inputName = useRef();
  const inputBirth = useRef();
  const inputGender = useRef();

  const tryJoin = async () => {
    const account_id = inputId.current.value.trim();
    const user_pw = inputPw.current.value.trim();
    const pwCheck = inputPwCheck.current.value.trim();
    const user_email = inputEmail.current.value.trim();
    const user_name = inputName.current.value.trim();
    const birth = inputBirth.current.value;
    const gender = inputGender.current.value;

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
      alert("비밀번호가 일치하지 않습니다.");
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
        alert(res.data.message || "회원가입 실패");
      }
    } catch (err) {
      console.error("JOIN ERROR:", err);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <h2>회원가입</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <p style={{ marginBottom: "18px", fontSize: "14px" }}>
          새로운 계정을 만들어 MindCare를 시작하세요.
        </p>

        <label>아이디</label>
        <input ref={inputId} type="text" className={styles.inputStyle} placeholder="아이디" />

        <label>비밀번호</label>
        <input ref={inputPw} type="password" className={styles.inputStyle} placeholder="비밀번호" />

        <label>비밀번호 확인</label>
        <input ref={inputPwCheck} type="password" className={styles.inputStyle} placeholder="비밀번호 확인" />

        <label>이메일</label>
        <input ref={inputEmail} type="email" className={styles.inputStyle} placeholder="example@email.com" />

        <label>이름</label>
        <input ref={inputName} type="text" className={styles.inputStyle} placeholder="이름" />

        <label>생년월일</label>
        <input ref={inputBirth} type="date" className={styles.inputStyle} />

        <label>성별</label>
        <select ref={inputGender} className={styles.inputStyle}>
          <option>성별 선택</option>
          <option>남성</option>
          <option>여성</option>
        </select>

        <button className={styles.actionBtn} onClick={tryJoin}>
          회원가입
        </button>

        <p style={{ marginTop: "16px", fontSize: "13px", textAlign: "center" }}>
          이미 계정이 있으신가요?{" "}
          <span className={styles.smallLink} onClick={onOpenLogin}>로그인</span>
        </p>
      </div>
    </div>
  );
};

export default JoinModal;
