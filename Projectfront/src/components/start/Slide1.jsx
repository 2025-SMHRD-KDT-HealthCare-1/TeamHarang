// src/components/start/Slide1.jsx
import React from "react";
import styles from "./Slide1.module.css";

const Slide1 = ({ onLogin, onJoin }) => {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.iconCircle}>
          <img src="/images/slide1/bg-icon.svg" className={styles.icon} />
        </div>

        <h1 className={styles.title}>
          의학 기반<br />당신만을 위한 방법
        </h1>

        {/* 추천 문구 추가 */}
        <p className={styles.subtitle}>
          과학적으로 설계된 평가와 맞춤형 솔루션으로  
          나에게 꼭 맞는 마음 관리 시작하기
        </p>

        <div className={styles.btnRow}>
          <button className={styles.btn} onClick={onLogin}>로그인</button>
          <button className={styles.btn} onClick={onJoin}>회원가입</button>
          <button className={styles.btn}>비회원</button>
        </div>
      </div>

    </div>
  );
};

export default Slide1;
