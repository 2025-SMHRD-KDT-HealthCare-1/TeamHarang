// src/pages/SurveyResult.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SurveyResult.module.css";

// 맞춤 개선 가이드를 렌더링하는 UI 컴포넌트
import ImprovementGuide from "../pages/ImprovementGuide";

const SurveyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  /**
   * 프론트에서 설문 제출 후 SurveyForm.jsx에서 navigate할 때 전달된 값들
   */
  const { type, totalScore, emotionalScore, physicalScore } =
    location.state || {};

  const [guides, setGuides] = useState([]);

  // -------------------------------------------------------------
  // 1. 잘못된 접근 방지 (직접 URL로 접근하는 경우)
  // -------------------------------------------------------------
  if (!type) {
    return (
      <div className={styles.notAllowedBox}>
        잘못된 접근입니다.
        <button
          className={styles.backBtn}
          onClick={() => navigate("/home")}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 추천 리스트 (정적 배열, 매 렌더링마다 동일)
  // -------------------------------------------------------------
  const PHQ_LIST = [
    "하루 루틴(기상·식사·취침) 시간 정하기",
    "아침 햇빛 아래 20분 걷기",
    "오늘 목표 1개 작성하기",
    "15~30분 산책하기",
    "건강한 한 끼 식사하기",
    "수면·기상 시간 기록하기",
    "작은 책임 있는 일 1개 수행하기",
    "부정적 생각 적고 반박 근거 작성하기",
    "새로운 활동 1개 시도하기",
    "가족/친구와 대화 1회 하기",
  ];

  const GAD_LIST = [
    "신뢰하는 사람에게 5분 대화하기",
    "걱정 시간 10분 정해두고 걱정하기",
    "걱정거리 노트에 적어 보관하기",
    "10분 스트레칭 또는 운동하기",
    "건강한 식사 챙겨 먹기",
    "7시간 수면 목표 잡기",
    "복식 호흡 10회 연습하기",
    "지금 할 수 있는 행동 1가지 실행하기",
  ];

  const PSS_LIST = [
    "오늘 스트레스를 일으킨 상황 기록하기",
    "목표 1~2개만 정하고 하루 단순화하기",
    "부정적 생각 1개 적고 사실 여부 점검하기",
    "작은 행동 하나 먼저 실행하기",
    "5분 명상 또는 호흡하기",
    "식사·수면 시간 규칙적으로 기록하기",
    "스스로 비난하지 않는 연습하기",
    "자극적인 활동 피하기",
    "믿을 수 있는 사람/반려동물과 시간 보내기",
  ];

  // -------------------------------------------------------------
  // 2. 점수 기반 추천 리스트 생성
  // -------------------------------------------------------------
  useEffect(() => {
    let list = [];

    if (type === "PHQ") list = PHQ_LIST;
    if (type === "GAD") list = GAD_LIST;
    if (type === "PSS") list = PSS_LIST;

    const random3 = [...list].sort(() => 0.5 - Math.random()).slice(0, 3);

    setGuides(random3);
  }, [type]);

  
  const addToTodo = (content) => {
    const uid = Number(localStorage.getItem("user_id"));
    if (!uid || !token) return;

    axios
      .post(
        "http://localhost:3001/todo/AddTodo",
        { uid, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => alert("투두리스트에 추가되었습니다!"))
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.container}>
      {/* ----------------- 헤더 ----------------- */}
      <div className={styles.headerBox}>
        <h2 style={{ margin: 0 }}>체크 완료!</h2>
        <p style={{ opacity: 0.8 }}>
          {type === "GAD" && "불안 검사 결과"}
          {type === "PHQ" && "우울 검사 결과"}
          {type === "PSS" && "스트레스 검사 결과"}
        </p>
      </div>

      {/* ----------------- 점수 카드 ----------------- */}
      <div className={styles.card}>
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>{totalScore}</h1>
        <p style={{ opacity: 0.75 }}>정서 점수: {emotionalScore}</p>
        <p style={{ opacity: 0.75 }}>신체 점수: {physicalScore}</p>
      </div>

      {/* ----------------- 추천 가이드 ----------------- */}
      <div className={styles.categoryContainer}>
        <h2 style={{ margin: 0 }}>개선방안</h2>
        <p style={{ opacity: 0.8, marginBottom: "20px" }}>
          투드리스트에 원하는 가이드를 넣어보세요
        </p>

        {guides.map((item, idx) => (
          <div key={idx} className={styles.guideItem}>
            <span>{item}</span>
            <button className={styles.addBtn} onClick={() => addToTodo(item)}>
              + 추가하기
            </button>
          </div>
        ))}
      </div>

      {/* ----------------- 이동 버튼 ----------------- */}
      <div className={styles.btnWrap}>
        <button className={styles.subBtn} onClick={() => navigate("/survey/start")}>
          다른 검사 하기
        </button>

        <button className={styles.subBtn} onClick={() => navigate("/survey/record")}>
          기록 보기
        </button>

        <button className={styles.mainBtn} onClick={() => navigate("/home")}>
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default SurveyResult;
