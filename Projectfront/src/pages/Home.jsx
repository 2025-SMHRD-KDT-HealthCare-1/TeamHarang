import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* ====== 1행 : 스트레스 체크 / 마음 일기 ====== */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        
        {/* 스트레스 체크 */}
        <div
          style={{
            flex: 1,
            background: "#dceaff",
            borderRadius: "15px",
            padding: "20px",
          }}
        >
          <h2 style={{ color: "#2c5cd3" }}>📊 스트레스 체크</h2>
          <p style={{ fontSize: "14px" }}>
            검증된 설문을 통해 우울, 불안, 스트레스 수준을 측정해보세요.
          </p>
          <ul style={{ fontSize: "13px", marginTop: "10px" }}>
            <li>각 7~10개 문항, 5분 소요</li>
            <li>즉시 결과 확인 가능</li>
            <li>맞춤형 개선방안 제공</li>
          </ul>

          <button
            onClick={() => navigate("/survey/start")}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "12px",
              background: "#2c5cd3",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            체크 시작하기
          </button>
        </div>

        {/* 마음 일기 */}
        <div
          style={{
            flex: 1,
            background: "#cdfadc",
            borderRadius: "15px",
            padding: "20px",
          }}
        >
          <h2 style={{ color: "#1ea75f" }}>✍ 마음 일기</h2>
          <p style={{ fontSize: "14px" }}>
            매일의 감정과 생각을 기록하며 마음 패턴을 발견해보세요.
          </p>
          <ul style={{ fontSize: "13px", marginTop: "10px" }}>
            <li>감정 표현과 자기 이해 향상</li>
            <li>스트레스 해소 및 마음 정리</li>
            <li>개인 기록 안전하게 보관</li>
          </ul>

          <button
            onClick={() => navigate("/diary/text")}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "12px",
              background: "#1ea75f",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            마음 일기 쓰러 가기
          </button>
        </div>
      </div>

      {/* ====== 2행 : 체크 결과 / 오늘의 할 일 ====== */}
      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* 체크 결과 */}
        <div
          style={{
            flex: 1,
            background: "#f0dfff",
            borderRadius: "15px",
            padding: "20px",
          }}
        >
          <h2 style={{ color: "#8e44ad" }}>📈 체크 결과 분석</h2>
          <p style={{ fontSize: "14px" }}>
            전체 체크 이력을 확인할 수 있어요.
          </p>

          <div
            style={{
              height: "160px",
              background: "white",
              borderRadius: "10px",
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "15px",
              color: "#666",
            }}
          >
            체크 결과가 없습니다
          </div>

          <button
            onClick={() => navigate("/survey/result")}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "12px",
              background: "#8e44ad",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            체크 결과 확인하기
          </button>
        </div>

        {/* 오늘의 할 일 */}
        <div
          style={{
            flex: 1,
            background: "#ffe2c2",
            borderRadius: "15px",
            padding: "20px",
          }}
        >
          <h2 style={{ color: "#d35400" }}>📅 오늘의 할 일</h2>
          <p style={{ fontSize: "14px" }}>
            목표를 체크하며 성취감을 느껴보세요.
          </p>

          <button
            onClick={() => navigate("/todo/list")}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "12px",
              background: "#d35400",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            할 일 목록 보러가기
          </button>
        </div>
      </div>

        {/* ====== 오른쪽 아래 AI 상담사 버튼 ====== */}
      <button
        onClick={() => navigate("/chat/bot")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",

          background: "#7b47ff",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "28px",

          // ★ 아이콘을 완전 중앙 정렬하는 부분
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        🤖
      </button>

    </div>
  );
};

export default Home;
