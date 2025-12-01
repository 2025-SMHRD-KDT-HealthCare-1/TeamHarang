// ========================
//  SurveyResult.jsx (최종본 — 백엔드 totalScore 방식 대응)
// ========================

import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ---------------- 스타일 ---------------- */

const container = {
  padding: "30px",
  maxWidth: "700px",
  margin: "40px auto",
};

const headerBox = {
  background: "linear-gradient(135deg, #a28bff, #7d4dff)",
  padding: "40px 20px",
  borderRadius: "20px",
  color: "white",
  textAlign: "center",
  marginBottom: "30px",
};

const card = {
  background: "white",
  padding: "30px 20px",
  borderRadius: "16px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  textAlign: "center",
  marginBottom: "25px",
};

const categoryContainer = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  marginBottom: "30px",
};

const improveRow = {
  display: "flex",
  gap: "20px",
  marginBottom: "20px",
};

const improveCard = {
  flex: 1,
  background: "#fafafa",
  border: "1px solid #eaeaea",
  borderRadius: "15px",
  padding: "20px",
};

const improveHeader = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const iconCircle = (bg) => ({
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background: bg,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "24px",
});

const btnWrap = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const mainBtn = {
  padding: "12px 28px",
  background: "linear-gradient(135deg, #6e6eff, #aa72ff)",
  color: "white",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "15px",
};

const subBtn = {
  padding: "12px 22px",
  background: "#ffffff",
  border: "1px solid #dcdcdc",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const btnStyle = {
  marginTop: "20px",
  padding: "12px 20px",
  background: "#6e6eff",
  color: "white",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

/* ---------------- 컴포넌트 ---------------- */

const SurveyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { type, totalScore, emotionalScore, physicalScore } =
    location.state || {};

  // 잘못된 접근 방지
  if (!type) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        잘못된 접근입니다.
        <button onClick={() => navigate("/home")} style={btnStyle}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={container}>
      {/* 헤더 */}
      <div style={headerBox}>
        <h2 style={{ margin: 0 }}>체크 완료!</h2>
        <p style={{ opacity: 0.8 }}>
          {type === "GAD" && "불안 검사 결과"}
          {type === "PHQ" && "우울 검사 결과"}
          {type === "PSS" && "스트레스 검사 결과"}
        </p>
      </div>

      {/* 점수 카드 */}
      <div style={card}>
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>{totalScore}</h1>

        <p style={{ opacity: 0.75 }}>정서 점수: {emotionalScore}</p>
        <p style={{ opacity: 0.75 }}>신체 점수: {physicalScore}</p>
      </div>

      {/* 정서 / 신체 카드 */}
      <div style={improveRow}>
        <div style={improveCard}>
          <div style={improveHeader}>
            <div style={iconCircle("#b28bff")}>💜</div>
            <div>
              <h3 style={{ margin: 0 }}>정서적 반응 개선</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>
                감정 정리 · 인지 전환 도움
              </p>
            </div>
          </div>
        </div>

        <div style={improveCard}>
          <div style={improveHeader}>
            <div style={iconCircle("#8ae3c7")}>💚</div>
            <div>
              <h3 style={{ margin: 0 }}>신체적 반응 개선</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>
                호흡 · 이완 · 명상 중심
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 백엔드 개선방안 (아직 없음 → 표시 X) */}
      <div style={categoryContainer}>
        <h2 style={{ margin: 0 }}>개선방안</h2>
        <p style={{ opacity: 0.8, marginBottom: "20px" }}>
          아래 내용을 실천해보세요.
        </p>

        <ul>
          <li>백엔드 개선방안 기능 개발 예정</li>
        </ul>
      </div>

      {/* 버튼 */}
      <div style={btnWrap}>
        <button style={subBtn} onClick={() => navigate("/survey/start")}>
          다른 검사 하기
        </button>

        <button style={subBtn} onClick={() => navigate("/survey/record")}>
          기록 보기
        </button>

        <button style={mainBtn} onClick={() => navigate("/home")}>
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default SurveyResult;
