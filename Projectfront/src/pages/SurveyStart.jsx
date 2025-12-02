// src/pages/SurveyStart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SurveyStart.module.css";

export default function SurveyStart() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>

        <h1 className={styles.title}>정신건강 체크 선택</h1>
        <p className={styles.subtitle}>당신에게 필요한 체크를 선택해주세요</p>

        <div className={styles.cardRow}>
          <SurveyCard
            color="#3d7eff"
            icon="🧠"
            title="우울 체크"
            descList={[
              "지난 2주 동안 다음의 문제들로 인해 얼마나 자주 방해를 받았습니까?",
              "총 9개의 문항으로 구성되어 있습니다",
              "각 문항은 0점부터 3점까지 평가됩니다",
              "약 3~5분 정도 소요됩니다",
              "정확한 평가를 위해 솔직하게 답변해주세요",
            ]}
            notice="본 체크는 자가평가 목적으로만 사용되며, 전문가의 상담이 필요한 경우 전문가와 상담하시기 바랍니다."
            btnColor="#3d7eff"
            onClick={() => navigate("/survey/phq")}
          />

          <SurveyCard
            color="#b04bff"
            icon="💜"
            title="불안 체크"
            descList={[
              "지난 2주 동안 다음의 문제들로 인해 얼마나 자주 방해를 받았습니까?",
              "총 7개의 문항으로 구성되어 있습니다",
              "각 문항은 0점부터 3점까지 평가됩니다",
              "약 3분 정도 소요됩니다",
              "최근 2주간의 상태를 기준으로 답변해주세요",
            ]}
            notice="본 체크는 자가평가 목적으로만 사용되며, 전문가의 상담이 필요한 경우 전문가와 상담하시기 바랍니다."
            btnColor="#b04bff"
            onClick={() => navigate("/survey/gad")}
          />

          <SurveyCard
            color="#ff7b3d"
            icon="⚡"
            title="스트레스 체크"
            descList={[
              "지난 한 달 동안 귀하의 느낌과 생각에 대한 질문입니다.",
              "총 10개의 문항으로 구성되어 있습니다",
              "각 문항은 0점부터 4점까지 평가됩니다",
              "약 3~5분 정도 소요됩니다",
              "최근 한 달간의 경험을 떠올리며 답변해주세요",
            ]}
            notice="본 체크는 주관적 스트레스 수준을 측정하는 도구입니다."
            btnColor="#ff7b3d"
            onClick={() => navigate("/survey/pss")}
          />
        </div>

        <button className={styles.homeBtn} onClick={() => navigate("/home")}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   SurveyCard 컴포넌트
--------------------------------------------------- */
function SurveyCard({ color, icon, title, descList, notice, btnColor, onClick }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>{icon}</div>

      <h2 className={styles.cardTitle} style={{ color }}>{title}</h2>

      <ul className={styles.descList}>
        {descList.map((text, idx) => (
          <li key={idx} className={styles.descItem}>
            {text}
          </li>
        ))}
      </ul>

      <div className={styles.noticeBox}>{notice}</div>

      <button
        className={styles.startBtn}
        onClick={onClick}
        style={{ background: btnColor }}
      >
        체크 시작하기
      </button>
    </div>
  );
}
