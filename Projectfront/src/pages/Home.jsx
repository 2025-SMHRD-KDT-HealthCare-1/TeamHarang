// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import TodayTodo from "../components/TodayTodo";
import CheckResult from "../components/CheckResult";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>

      {/* ====== 1행 ====== */}
      <div className={styles.row}>

        {/* 스트레스 체크 */}
        <div className={`${styles.box} ${styles.boxBlue}`}>
          <h2 className={styles.titleBlue}>스트레스 체크</h2>
          <p className={styles.desc}>
            검증된 설문을 통해 우울, 불안, 스트레스 수준을 측정해보세요.
          </p>

          <ul className={styles.list}>
            <li>각 7~10개 문항, 5분 소요</li>
            <li>즉시 결과 확인 가능</li>
            <li>맞춤형 개선방안 제공</li>
          </ul>

          <button
            className={`${styles.btn} ${styles.btnBlue}`}
            onClick={() => navigate("/survey/start")}
          >
            체크 시작하기
          </button>
        </div>

        {/* 마음 일기 */}
        <div className={`${styles.box} ${styles.boxGreen}`}>
          <h2 className={styles.titleGreen}>마음 일기</h2>
          <p className={styles.desc}>
            매일의 감정과 생각을 기록하며 마음 패턴을 발견해보세요.
          </p>

          <ul className={styles.list}>
            <li>감정 표현과 자기 이해 향상</li>
            <li>스트레스 해소 및 마음 정리</li>
            <li>개인 기록 안전하게 보관</li>
          </ul>

          <button
            className={`${styles.btn} ${styles.btnGreen}`}
            onClick={() => navigate("/diary/text")}
          >
            마음 일기 쓰러 가기
          </button>
        </div>

      </div>

      {/* ====== 2행 ====== */}
      <div className={styles.row}>

        {/* 체크 결과 */}
        <div className={`${styles.box} ${styles.boxPurple}`}>
          <h2 className={styles.titlePurple}>체크 결과 분석</h2>
          <p className={styles.desc}>전체 체크 이력을 확인할 수 있어요.</p>

          <CheckResult />
        </div>

        {/* 오늘의 할 일 */}
        <div className={`${styles.box} ${styles.boxOrange}`}>
          <h2 className={styles.titleOrange}>오늘의 할 일</h2>
          <p className={styles.desc}>목표를 체크하며 성취감을 느껴보세요.</p>

          <div className={styles.todoWrapper}>
            <TodayTodo />
          </div>

          <button
            className={`${styles.btn} ${styles.btnOrange}`}
            onClick={() => navigate("/todo/list")}
          >
            내 달성도 확인
          </button>
        </div>

      </div>

      {/* AI 버튼 */}
      <button className={styles.aiButton} onClick={() => navigate("/chatbot")}>
        🤖
      </button>

    </div>
  );
};

export default Home;
