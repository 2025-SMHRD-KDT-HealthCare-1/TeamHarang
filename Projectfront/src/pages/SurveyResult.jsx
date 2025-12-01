import React, { useEffect, useRef, useState } from "react";
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

const improveGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginTop: "20px",
};

const improveCard = {
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

  // 백엔드에서 받은 점수
  const { type, totalScore, emotionalScore, physicalScore } = location.state || {};

  // 화면 출력용 useRef
  const resultRef = useRef({
    score: null,
    level: "",
    message: "",
    emotionalScore: 0,
    physicalScore: 0,
  });

  // 리렌더 트리거
  const [tick, setTick] = useState(0);

  // 점수 분석
  useEffect(() => {
    if (totalScore == null) return;

    // 점수 저장
    resultRef.current.score = totalScore;
    resultRef.current.emotionalScore = emotionalScore;
    resultRef.current.physicalScore = physicalScore;

    /* ------------ 설문별 등급 구분 ------------ */
    if (type === "PHQ") {
      if (totalScore <= 4) resultRef.current.level = "정상 범위";
      else if (totalScore <= 9) resultRef.current.level = "가벼운 우울감";
      else if (totalScore <= 14) resultRef.current.level = "중등도 우울감";
      else resultRef.current.level = "중증 우울 가능성";

      resultRef.current.message =
        "지속적인 우울감이 느껴진다면 전문가 상담을 권장합니다.";
    }

    if (type === "GAD") {
      if (totalScore <= 4) resultRef.current.level = "정상";
      else if (totalScore <= 9) resultRef.current.level = "경미한 불안";
      else if (totalScore <= 14) resultRef.current.level = "중등도 불안";
      else resultRef.current.level = "중증 불안";

      resultRef.current.message =
        "불안감이 지속될 경우 휴식과 안정이 필요합니다.";
    }

    if (type === "PSS") {
      if (totalScore <= 13) resultRef.current.level = "낮은 스트레스 수준";
      else if (totalScore <= 26) resultRef.current.level = "보통 스트레스 수준";
      else resultRef.current.level = "높은 스트레스 수준";

      resultRef.current.message =
        "스트레스 해소 활동이 도움이 될 수 있습니다.";
    }

    setTick((prev) => prev + 1); // 리렌더
  }, [totalScore, emotionalScore, physicalScore, type]);

  // 잘못된 접근 처리
  if (totalScore == null) {
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
      {/* ---------------- 헤더 ---------------- */}
      <div style={headerBox}>
        <h2 style={{ margin: 0 }}>체크 완료!</h2>
        <p style={{ opacity: 0.8 }}>
          {type === "GAD" && "불안 검사 결과"}
          {type === "PHQ" && "우울 검사 결과"}
          {type === "PSS" && "스트레스 검사 결과"}
        </p>
      </div>

      {/* ---------------- 점수 카드 ---------------- */}
      <div style={card}>
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
          {resultRef.current.score}
        </h1>

        <p style={{ fontWeight: 600, marginBottom: "10px" }}>
          {resultRef.current.level}
        </p>

        <p style={{ opacity: 0.75 }}>{resultRef.current.message}</p>
      </div>

      {/* ---------------- 개선 방안 ---------------- */}
      <div style={categoryContainer}>
        <h2 style={{ margin: 0 }}>사용자 맞춤 개선방안 제시</h2>
        <p style={{ opacity: 0.8, marginBottom: "20px" }}>도와드릴게요!</p>

        <div style={improveGrid}>
          <div style={improveCard}>
            <div style={improveHeader}>
              <div style={iconCircle("#b28bff")}>💜</div>
              <div>
                <h3 style={{ margin: 0 }}>정서적 반응 개선</h3>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  감정 정리와 마음 관리 방법을 제안합니다.
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
                  몸의 긴장을 낮추고 스트레스를 완화하는 방법입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 버튼 ---------------- */}
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
