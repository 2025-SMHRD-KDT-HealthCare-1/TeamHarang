import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import TodoCard from "./TodoCard";

const Slide4 = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
         marginLeft: "calc(50% - 50vw)",
        paddingTop: "70px",
        backgroundColor: "#f3f8ff",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: "linear-gradient(180deg, #b47bff, #7d4dff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 25px",
        }}
      >
        <img src="/todo-icon.png" style={{ width: "45px" }} />
      </div>

      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>TODO 리스트</h1>

      <p style={{ fontSize: "18px", opacity: 0.7, marginBottom: "50px" }}>
        매일의 작은 성취를 기록하고 습관을 만들어가세요
      </p>

      <div style={{ display: "flex", gap: "40px", justifyContent: "center" }}>
        <TodoCard
          icon="/todo1.png"
          title="일일 목표 설정"
          desc="아침에 작은 목표들을 설정하세요"
        />
        <TodoCard
          icon="/todo2.png"
          title="진행 상황 추적"
          desc="완료한 활동을 체크하며 성취감을 느끼기"
        />
        <TodoCard
          icon="/todo3.png"
          title="습관 형성"
          desc="꾸준한 실천으로 건강한 습관 만들기"
        />
      </div>

      <div style={indicatorWrapper}>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
        <div style={activeDot}></div>
      </div>
    </div>
  );
};

export default Slide4;
