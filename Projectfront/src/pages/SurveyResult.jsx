import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SurveyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 설문 종류 + 사용자 답변
  const { type, answers } = location.state || {};

  // ---------------------- ref 데이터 ----------------------
  const resultRef = useRef({
    score: null,
    level: "",
    message: "",
  });

  // 강제 렌더링용 (ref만으로는 화면이 안 바뀌므로)
  const refreshRef = useRef(0);

  // 첫 로드 시 백엔드 호출(임시)
  useEffect(() => {
    if (!answers || !type) return;

    resultRef.current = {
      score: 0,
      level: "백엔드 결과 대기",
      message: "백엔드 연결 전 임시 메시지입니다.",
    };

    // 화면 한 번 업데이트
    refreshRef.current++;
  }, [answers, type]);

  // 예외 처리
  if (!answers || !type) {
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
          {resultRef.current.score !== null ? resultRef.current.score : "-"}
        </h1>

        <p style={{ fontWeight: 600, marginBottom: "10px" }}>
          {resultRef.current.level}
        </p>

        <p style={{ opacity: 0.75 }}>{resultRef.current.message}</p>
      </div>

      {/* ---------------- 개선 방안 제목 ---------------- */}
      <div style={categoryContainer}>
        <h2 style={{ margin: 0 }}>사용자 맞춤 개선방안 제시</h2>
        <p style={{ opacity: 0.8, marginBottom: "20px" }}>
          도와드릴게요!
        </p>

        {/*  여기만 수정됨 — 정서적 / 신체적 반응 개선 “틀만” */}
        <div style={improveGrid}>

          {/* 정서적 반응 개선 */}
          <div style={improveCard}>
            <div style={improveHeader}>
              <div style={iconCircle("#b28bff")}>💜</div>
              <div>
                <h3 style={{ margin: 0 }}>정서적 반응 개선</h3>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  마음에서 느껴지는 감정들을 다루는 방법
                </p>
              </div>
            </div>
            {/* 내용은 넣지 않음 (요청한 틀만) */}
          </div>

          {/* 신체적 반응 개선 */}
          <div style={improveCard}>
            <div style={improveHeader}>
              <div style={iconCircle("#8ae3c7")}>💚</div>
              <div>
                <h3 style={{ margin: 0 }}>신체적 반응 개선</h3>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  몸에서 느껴지는 증상들을 완화하는 방법
                </p>
              </div>
            </div>
            {/* 내용 없음 */}
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

export default SurveyResult;
