import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SurveyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 설문 종류 + 사용자 답변
  const { type, answers } = location.state || {};

  // 백엔드에서 받은 결과 저장
  const [result, setResult] = useState({
    score: null,
    level: "",
    message: "",
  });

  // 첫 로드 시 백엔드 호출(임시)
  useEffect(() => {
    if (!answers || !type) return;

    setResult({
      score: 0,
      level: "백엔드 결과 대기",
      message: "백엔드 연결 전 임시 메시지입니다.",
    });
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
          {result.score !== null ? result.score : "-"}
        </h1>
        <p style={{ fontWeight: 600, marginBottom: "10px" }}>
          {result.level}
        </p>
        <p style={{ opacity: 0.75 }}>{result.message}</p>
      </div>

      {/* ---------------- 추후 제목 추가예정 ---------------- */}
      <div style={categoryContainer}>
        <h2 style={{ margin: 0 }}>사용자 맞춤 개선방안 제시</h2>
        <p style={{ opacity: 0.8, marginBottom: "20px" }}>
          도와드릴게요!
        </p>

        <div style={categoryGrid}>

          {/* ---------------- 1) .. ---------------- */}
          <div style={categoryCard}>
            <div style={categoryLeft}>
              <div style={iconBox("#7146cec0")}></div>
              <div>
                <h3 style={{ margin: 0 }}>추후 넣을 예정</h3>
                <p style={{ margin: 0, opacity: 0.7 }}>추후 넣을 예정</p>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <p style={levelText()}>
                증상 수준{" "}
                <span style={{ color: "#d32f2f", fontWeight: 700 }}>
                  추후 넣을 예정
                </span>
                <span style={{ float: "right" }}>0</span>
              </p>

              <div style={progressWrapper}>
                <div style={progressBar(0)}></div>
              </div>
            </div>
          </div>

          {/* ---------------- 2) ---------------- */}
          <div style={categoryCard}>
            <div style={categoryLeft}>
              <div style={iconBox("#547ceb88")}></div>
              <div>
                <h3 style={{ margin: 0 }}>추후 넣을 예정</h3>
                <p style={{ margin: 0, opacity: 0.7 }}>추후 넣을 예정</p>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <p style={levelText()}>
                증상 수준{": "}
                <span style={{ color: "#d32f2f", fontWeight: 700 }}>
                  추후 넣을 예정
                </span>
                <span style={{ float: "right" }}>0</span>
              </p>

              <div style={progressWrapper}>
                <div style={progressBar(0)}></div>
              </div>
            </div>
          </div>

          {/* ---------------- 3) ---------------- */}
          <div style={categoryCard}>
            <div style={categoryLeft}>
              <div style={iconBox("#e1e9ff")}></div>
              <div>
                <h3 style={{ margin: 0 }}>추후 넣을 예정</h3>
                <p style={{ margin: 0, opacity: 0.7 }}>추후 넣을 예정</p>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <p style={levelText()}>
                증상 수준{": "}
                <span style={{ color: "#d32f2f", fontWeight: 700 }}>
                  추후 넣을 예정
                </span>
                <span style={{ float: "right" }}>..</span>
              </p>

              <div style={progressWrapper}>
                <div style={progressBar(0)}></div>
              </div>
            </div>
          </div>

          {/* ---------------- 4) ---------------- */}
          <div style={categoryCard}>
            <div style={categoryLeft}>
              <div style={iconBox("#e1f0ff")}></div>
              <div>
                <h3 style={{ margin: 0 }}>추후 넣을 예정</h3>
                <p style={{ margin: 0, opacity: 0.7 }}>추후 넣을 예정</p>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <p style={levelText()}>
                증상 수준 {": "}
                <span style={{ color: "#e57300", fontWeight: 700 }}>
                  추후 넣을 예정
                </span>
                <span style={{ float: "right" }}>0</span>
              </p>

              <div style={progressWrapper}>
                <div style={progressBar(0)}></div>
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

/* ---------------- 카테고리 분석 UI ---------------- */

const categoryContainer = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  marginBottom: "30px",
};

const categoryGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const categoryCard = {
  padding: "20px",
  background: "white",
  borderRadius: "15px",
  border: "1px solid #eeeeee",
};

const categoryLeft = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const iconBox = (bg) => ({
  width: "60px",
  height: "60px",
  borderRadius: "15px",
  background: bg,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const levelText = () => ({
  margin: "0 0 6px 0",
  fontSize: "14px",
  color: "#333",
});

const progressWrapper = {
  background: "#e6e6e6",
  height: "8px",
  borderRadius: "5px",
};

const progressBar = (percent) => ({
  height: "100%",
  width: `${percent}%`,
  background: "#333",
  borderRadius: "5px",
});

/* ---------------- 버튼 스타일 ---------------- */

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
