import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";

const Slide1 = ({ onLogin, onJoin }) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/start-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 🔥 오버레이 레이어(배경 위 검정 반투명)*/}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(19, 18, 100, 0.5)",
          zIndex: 1,
        }}
      />

      {/* 콘텐츠 */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            lineHeight: "1.4",
            textShadow: "0 2px 6px rgba(0,0,0,0.55)",
          }}
        >
          의학 기반 <br /> 당신만을 위한 방법
        </h1>

        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            marginTop: "12px",
            textShadow: "0 2px 6px rgba(0,0,0,0.55)",
          }}
        >
          과학적으로 입증된 치료 방법
        </p>

        <div style={{ marginTop: "30px", display: "flex", gap: "15px", justifyContent: "center" }}>
          <button style={btn} onClick={onLogin}>로그인</button>
          <button style={btn} onClick={onJoin}>회원가입</button>
          <button style={btn}>비회원</button>
        </div>
      </div>

      {/* 인디케이터 */}
      <div style={indicatorWrapper}>
        <div style={activeDot}></div>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
      </div>
    </div>
  );
};

const btn = {
  padding: "10px 22px",
  borderRadius: "10px",
  border: "1px solid rgba(64, 145, 141, 0.62)",
  background: "rgba(255,255,255,0.9)",
  color: "#0066ff",
  fontWeight: "600",
  cursor: "pointer",
  backdropFilter: "blur(3px)",
};

export default Slide1;
