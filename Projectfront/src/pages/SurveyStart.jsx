import React from "react";
import { useNavigate } from "react-router-dom";

export default function SurveyStart() {
  const navigate = useNavigate();

  return (
    // ★ 화면 전체를 가운데 정렬하는 바깥 래퍼
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",   // 가로 중앙
        alignItems: "center",       // 세로 중앙
        background: "#f6f8ff",
        boxSizing: "border-box",
      }}
    >
      {/* ★ 실제 내용 박스: 중앙에 모아서 위아래로 배치 */}
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 제목 */}
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          정신건강 체크 선택
        </h1>
        <p
          style={{
            opacity: 0.7,
            marginBottom: "40px",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          당신에게 필요한 체크를 선택해주세요
        </p>

        {/* 카드 3개 묶음 */}
        <div
          style={{
            display: "flex",
            gap: "35px",
            justifyContent: "center", // ★ 가로 중앙
            alignItems: "stretch",
          }}
        >
          {/* 우울 체크 카드 */}
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

          {/* 불안 체크 */}
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

          {/* 스트레스 체크 */}
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

        {/* 홈으로 돌아가기 버튼 */}
        <button
          onClick={() => navigate("/home")}
          style={{
            marginTop: "40px",
            padding: "10px 24px",
            borderRadius: "10px",
            background: "#333",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   SurveyCard 컴포넌트 (기능 그대로)
--------------------------------------------------- */
function SurveyCard({ color, icon, title, descList, notice, btnColor, onClick }) {
  return (
    <div
      style={{
        width: "380px",
        background: "white",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: "40px", marginBottom: "15px" }}>{icon}</div>

      <h2 style={{ color, marginBottom: "15px" }}>{title}</h2>

      <ul style={{ paddingLeft: "18px", lineHeight: "1.6", flexGrow: 1 }}>
        {descList.map((text, idx) => (
          <li key={idx} style={{ fontSize: "15px", opacity: 0.8 }}>
            {text}
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: "20px",
          background: "#fff7d5",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "13px",
          opacity: 0.9,
        }}
      >
        {notice}
      </div>

      <button
        onClick={onClick}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px 0",
          background: btnColor,
          color: "white",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        체크 시작하기
      </button>
    </div>
  );
}
