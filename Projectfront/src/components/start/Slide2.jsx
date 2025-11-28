import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import ServiceBox from "./ServiceBox";

const Slide2 = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        marginLeft: "calc(50% - 50vw)",
        backgroundColor: "#ffffff",
        backgroundImage: "url('/slide2-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "100px",
        textAlign: "center",
      }}
    >
      {/* 오버레이 */}
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

      {/* 콘텐츠 */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "10px",
            textShadow: "0 2px 6px rgba(0,0,0,0.55)",
            color: "#fff",
          }}
        >
          MindCare 주요 서비스
        </h1>

        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            marginBottom: "45px",
            textShadow: "0 2px 6px rgba(0,0,0,0.55)",
            color: "#fff",
          }}
        >
          과학적인 치료와 관리 시스템을 당신에게 제공합니다
        </p>

        <div
          style={{
            display: "flex",
            gap: "60px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <ServiceBox
            icon="/icon1.png"
            title="검사 하러 가기"
            desc="스트레스 수준을 측정하고 과학적으로 관리합니다."
          />
          <ServiceBox
            icon="/icon2.png"
            title="심리테라피 추천"
            desc="증상 분석 후 적합한 치료를 추천합니다."
          />
          <ServiceBox
            icon="/icon3.png"
            title="일지 작성"
            desc="감정/신체 데이터 패턴 분석 제공합니다."
          />
          <ServiceBox
            icon="/icon4.png"
            title="커뮤니티"
            desc="비슷한 고민을 가진 사람들과 안전한 소통 공간."
          />
        </div>
      </div>

      {/* 인디케이터 */}
      <div style={indicatorWrapper}>
        <div style={inactiveDot}></div>
        <div style={activeDot}></div>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
      </div>
    </div>
  );
};

export default Slide2;
