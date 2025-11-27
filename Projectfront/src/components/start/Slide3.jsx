import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import SurveyCard from "./SurveyCard";

const Slide3 = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/slide3-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        paddingTop: "100px",
      }}
    >
      {/* 🔥 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.25)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
        }}
      >
        <img
          src="/survey-icon.png"
          style={{
            width: "80px",
            marginBottom: "20px",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
          }}
        />

        <h1
          style={{
            fontSize: "36px",
            marginBottom: "10px",
            textShadow: "0 2px 6px rgba(0,0,0,0.55)",
          }}
        >
          설문 검사
        </h1>

        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            marginBottom: "40px",
            textShadow: "0 2px 6px rgba(0,0,0,0.55)",
          }}
        >
          검증된 설문으로 정신 건강 상태를 평가합니다
        </p>

        <div
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "80%",
            margin: "0 auto",
          }}
        >
          <SurveyCard
            num="1"
            color="#2f7bff"
            title="스트레스 측정"
            items={["총 20문항", "5분 소요", "즉시 결과 제공"]}
          />
          <SurveyCard
            num="2"
            color="#8a39ff"
            title="우울감 평가"
            items={["표준화 검사", "익명 보장", "전문가 추천 제공"]}
          />
          <SurveyCard
            num="3"
            color="#ff3b82"
            title="불안 수준 확인"
            items={["다각도 분석", "대처 전략 제공", "정기적 추적"]}
          />
          <SurveyCard
            num="4"
            color="#ff8a00"
            title="종합 리포트"
            items={["차트 분석", "개선 방안 제공", "진행 상황 추적"]}
          />
        </div>
      </div>

      {/* 인디케이터 */}
      <div style={indicatorWrapper}>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
        <div style={activeDot}></div>
        <div style={inactiveDot}></div>
      </div>
    </div>
  );
};

export default Slide3;
