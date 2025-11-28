// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import TodayTodo from "../components/TodayTodo";
import "../styles/Home.css";   // <-- CSS 불러오기

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* ====== 1행 : 스트레스 체크 / 마음 일기 ====== */}
      <div className="row">
        
        {/* 스트레스 체크 */}
        <div className="box box-blue">
          <h2 className="title-blue">스트레스 체크</h2>
          <p className="desc">검증된 설문을 통해 우울, 불안, 스트레스 수준을 측정해보세요.</p>

          <ul className="list">
            <li>각 7~10개 문항, 5분 소요</li>
            <li>즉시 결과 확인 가능</li>
            <li>맞춤형 개선방안 제공</li>
          </ul>

          <button className="btn btn-blue" onClick={() => navigate("/survey/start")}>
            체크 시작하기
          </button>
        </div>

        {/* 마음 일기 */}
        <div className="box box-green">
          <h2 className="title-green">마음 일기</h2>
          <p className="desc">매일의 감정과 생각을 기록하며 마음 패턴을 발견해보세요.</p>

          <ul className="list">
            <li>감정 표현과 자기 이해 향상</li>
            <li>스트레스 해소 및 마음 정리</li>
            <li>개인 기록 안전하게 보관</li>
          </ul>

          <button className="btn btn-green" onClick={() => navigate("/diary/text")}>
            마음 일기 쓰러 가기
          </button>
        </div>

      </div>

      {/* ====== 2행 : 체크 결과 / 오늘의 할 일 ====== */}
      <div className="row">

        {/* 체크 결과 */}
        <div className="box box-purple">
          <h2 className="title-purple">체크 결과 분석</h2>
          <p className="desc">전체 체크 이력을 확인할 수 있어요.</p>

          <div className="result-empty">체크 결과가 없습니다</div>

          <button className="btn btn-purple" onClick={() => navigate("/survey/result")}>
            체크 결과 확인하기
          </button>
        </div>

        {/* 오늘의 할 일 */}
        <div className="box box-orange">
          <h2 className="title-orange">오늘의 할 일</h2>
          <p className="desc">목표를 체크하며 성취감을 느껴보세요.</p>

          <div className="todo-wrapper">
            <TodayTodo userId="testUser01" />
          </div>

          <button className="btn btn-orange" onClick={() => navigate("/todo/list")}>
            전체 할 일 목록 보러가기
          </button>
        </div>

      </div>

      {/* ====== 오른쪽 아래 AI 상담사 버튼 ====== */}
      <button className="ai-button" onClick={() => navigate("/chatbot")}>
        🤖
      </button>

    </div>
  );
};

export default Home;
