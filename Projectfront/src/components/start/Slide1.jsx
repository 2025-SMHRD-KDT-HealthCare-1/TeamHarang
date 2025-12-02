import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import styles from "./Slide1.module.css";

const Slide1 = ({ onLogin, onJoin }) => {
  return (
    <div className={styles.slideWrapper}>

      {/* 오버레이 */}
      <div className={styles.overlay}></div>

      {/* 콘텐츠 */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          의학 기반 <br /> 당신만을 위한 방법
        </h1>

        <p className={styles.subtitle}>
          과학적으로 입증된 치료 방법
        </p>

        <div className={styles.btnRow}>
          <button className={styles.btn} onClick={onLogin}>로그인</button>
          <button className={styles.btn} onClick={onJoin}>회원가입</button>
          <button className={styles.btn}>비회원</button>
        </div>
      </div>

      {/* 인디케이터 */}
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
