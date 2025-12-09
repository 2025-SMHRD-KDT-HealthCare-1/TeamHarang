// src/pages/SurveyStart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SurveyStart.module.css";
import { useAuthStore } from "../store/useAuthStore";

export default function SurveyStart() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();
  const isLoggedIn = user && accessToken;

  const goProtected = (path) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    navigate(path);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <h1 className={styles.title}>나의 상태 체크하기</h1>
        <p className={styles.subtitle}>당신에게 필요한 체크를 선택해주세요</p>

        <div className={styles.cardRow}>

          {/* ===================== */}
          {/*   그룹 1: 정서 검사 3개 */}
          {/* ===================== */}
          <div className={styles.group}>
            <SurveyCard
              color="#3d7eff"
              icon="🧠"
              title="우울 체크"
              descList={[
                "지난 2주 동안 얼마나 자주 불편함을 느꼈나요?",
                "총 9개 문항으로 구성",
                "0~3점으로 평가",
                "약 3~5분 소요",
                "솔직하게 답변해주세요",
              ]}
              notice="본 체크는 자가평가 용도로 사용되며, 전문 상담을 대체하지 않습니다."
              btnColor="#3d7eff"
              onClick={() => navigate("/survey/phq")}
            />

            <SurveyCard
              color="#b04bff"
              icon="💜"
              title="불안 체크"
              descList={[
                "지난 2주 동안 얼마나 자주 방해를 받았나요?",
                "총 7개 문항으로 구성",
                "0~3점 평가",
                "약 3분 소요",
                "최근 2주 기준으로 답변",
              ]}
              notice="본 체크는 자가평가 용도로 사용되며, 전문 상담을 대체하지 않습니다."
              btnColor="#b04bff"
              onClick={() => navigate("/survey/gad")}
            />

            <SurveyCard
              color="#ff7b3d"
              icon="⚡"
              title="스트레스 체크"
              descList={[
                "지난 한 달간의 경험에 대한 질문입니다.",
                "총 10개 문항으로 구성",
                "0~4점 평가",
                "약 3~5분 소요",
                "한 달간의 경험을 떠올려주세요",
              ]}
              notice="본 체크는 주관적 스트레스 수준을 측정하는 도구입니다."
              btnColor="#ff7b3d"
              onClick={() => navigate("/survey/pss")}
            />
          </div>

          {/* ===================== */}
          {/*   그룹 2: HTP         */}
          {/* ===================== */}
          <div className={styles.group}>
            <SurveyCard
              color="#ffb347"
              icon="🎨"
              title="HTP 그림 검사"
              descList={[
                "집·나무·사람을 자유롭게 그려보세요.",
                "AI가 그린 요소를 탐지해줍니다.",
                "특징을 기반으로 간단 분석 제공",
                "약 3~5분 소요",
                "참고용으로만 활용해주세요",
                "출처 : AI Hub AI 기반 미술심리 진단 데이터"
              ]}
              notice="본 검사는 자가 이해 목적이며 전문적 진단을 대신하지 않습니다."
              btnColor="#ffb347"
              isHtp={true}
              onClick={() => navigate("/htp/drawing")}
            />
          </div>

        </div>

        <button className={styles.homeBtn} onClick={() => goProtected("/home")}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   SurveyCard 컴포넌트
--------------------------------------------------- */
function SurveyCard({
  color,
  icon,
  title,
  descList,
  notice,
  btnColor,
  onClick,
  isHtp,
}) {
  return (
    <div className={`${styles.card} ${isHtp ? styles.cardHtp : ""}`}>
      {isHtp && <div className={styles.htpBadge}>그림 기반 검사</div>}

      <div className={styles.cardIcon}>{icon}</div>

      <h2 className={styles.cardTitle} style={{ color }}>
        {title}
      </h2>

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
