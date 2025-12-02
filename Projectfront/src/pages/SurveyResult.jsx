import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SurveyResult.module.css";

const SurveyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { type, totalScore, emotionalScore, physicalScore } =
    location.state || {};

  // 잘못된 접근 방지
  if (!type) {
    return (
      <div className={styles.notAllowedBox}>
        잘못된 접근입니다.
        <button
          className={styles.backBtn}
          onClick={() => navigate("/home")}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {/* 헤더 */}
      <div className={styles.headerBox}>
        <h2 style={{ margin: 0 }}>체크 완료!</h2>
        <p style={{ opacity: 0.8 }}>
          {type === "GAD" && "불안 검사 결과"}
          {type === "PHQ" && "우울 검사 결과"}
          {type === "PSS" && "스트레스 검사 결과"}
        </p>
      </div>

      {/* 점수 카드 */}
      <div className={styles.card}>
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>{totalScore}</h1>

        <p style={{ opacity: 0.75 }}>정서 점수: {emotionalScore}</p>
        <p style={{ opacity: 0.75 }}>신체 점수: {physicalScore}</p>
      </div>

      {/* 정서 / 신체 카드 */}
      <div className={styles.improveRow}>

        <div className={styles.improveCard}>
          <div className={styles.improveHeader}>
            <div
              className={styles.iconCircle}
              style={{ background: "#b28bff" }}
            >
              💜
            </div>
            <div>
              <h3 style={{ margin: 0 }}>정서적 반응 개선</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>
                감정 정리 · 인지 전환 도움
              </p>
            </div>
          </div>
        </div>

        <div className={styles.improveCard}>
          <div className={styles.improveHeader}>
            <div
              className={styles.iconCircle}
              style={{ background: "#8ae3c7" }}
            >
              💚
            </div>
            <div>
              <h3 style={{ margin: 0 }}>신체적 반응 개선</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>
                호흡 · 이완 · 명상 중심
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 개선방안 */}
      <div className={styles.categoryContainer}>
        <h2 style={{ margin: 0 }}>개선방안</h2>
        <p style={{ opacity: 0.8, marginBottom: "20px" }}>
          아래 내용을 실천해보세요.
        </p>

        <ul>
          <li>백엔드 개선방안 기능 개발 예정</li>
        </ul>
      </div>

      {/* 버튼 */}
      <div className={styles.btnWrap}>
        <button className={styles.subBtn} onClick={() => navigate("/survey/start")}>
          다른 검사 하기
        </button>

        <button className={styles.subBtn} onClick={() => navigate("/survey/record")}>
          기록 보기
        </button>

        <button className={styles.mainBtn} onClick={() => navigate("/home")}>
          홈으로 이동
        </button>
      </div>

    </div>
  );
};

export default SurveyResult;
