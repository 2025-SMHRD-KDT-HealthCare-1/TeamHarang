// src/components/start/Slide1.jsx
import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import styles from "./Slide1.module.css";

const Slide1 = ({ onLogin, onJoin }) => {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.iconCircle}>
          <img src="/images/slide1/bg-icon.svg" className={styles.icon} />
        </div>

        <h1 className={styles.title}>의학 기반<br />당신만을 위한 방법</h1>
        <p className={styles.subtitle}>
          {/* 과학적으로 검증된 심리 평가와 개인 맞춤형 개선 전략을 제공합니다. -> 여기다 문구 들어갈 말 추천 */}
        </p>

        <div className={styles.btnRow}>
          <button className={styles.btn} onClick={onLogin}>로그인</button>
          <button className={styles.btn} onClick={onJoin}>회원가입</button>
          <button className={styles.btn}>비회원</button>
        </div>
      </div>

      <div style={indicatorWrapper}>
        <div style={activeDot}></div>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
      </div>
    </div>
  );
};

export default Slide1;
