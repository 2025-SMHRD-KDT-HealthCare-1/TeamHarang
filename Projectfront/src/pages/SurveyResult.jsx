// src/pages/SurveyResult.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SurveyResult.module.css";
import { useAuthStore } from "../store/useAuthStore";

const SurveyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, accessToken } = useAuthStore();
  const isLoggedIn = user && accessToken;

  const { type, totalScore, emotionalScore, physicalScore } =
    location.state || {};

  const [guides, setGuides] = useState([]);

  // 잘못된 접근 방지
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
  // 정적 추천 리스트 (URL 포함)
  // -------------------------------------------------------------
  const GUIDE_LIST = {
    PHQ: [
      { text: "하루 루틴(기상·식사·취침) 시간 정하기", url: null },
      { text: "아침 햇빛 아래 20분 걷기", url: null },
      { text: "오늘 목표 1개 작성하기", url: null },
      { text: "15~30분 산책하기", url: null },
      { text: "건강한 한 끼 식사하기", url: null },
      { text: "수면·기상 시간 기록하기", url: null },
      { text: "작은 책임 있는 일 1개 수행하기", url: null },
      { text: "부정적 생각 적고 반박 근거 작성하기", url: null },
      { text: "새로운 활동 1개 시도하기", url: null },
      { text: "가족/친구와 대화 1회 하기", url: null },
    ],

    GAD: [
      { text: "신뢰하는 사람에게 5분 대화하기", url: null },
      { text: "걱정 시간 10분 정해두고 걱정하기", url: null },
      { text: "걱정거리 노트에 적어 보관하기", url: null },
      { text: "10분 스트레칭 또는 운동하기", url: "https://youtu.be/j6ICKnpn054?si=w9jRHNZuMs-enjWq" },
      { text: "건강한 식사 챙겨 먹기", url: null },
      { text: "7시간 수면 목표 잡기(수면에 도움되는 가이드 영상)", url: "https://youtube.com/shorts/vo8YR_eKRqQ?si=-z0FKDDuyqAPdwlM" },
      { text: "복식 호흡 10회 연습하기(호흡법 영상있음)", url: "https://youtu.be/WRQif7AjNyE?si=NDAWdMWfzq5zSmpf" },
      { text: "지금 할 수 있는 행동 1가지 실행하기", url: null },
    ],

    PSS: [
      { text: "오늘 스트레스를 일으킨 상황 기록하기", url: null },
      { text: "목표 1~2개만 정하고 하루 단순화하기", url: null },
      { text: "부정적 생각 1개 적고 사실 여부 점검하기", url: null },
      { text: "작은 행동 하나 먼저 실행하기", url: null },

      {
        text: "5분 명상 또는 호흡하기()",
        url: "https://youtu.be/WRQif7AjNyE?si=NDAWdMWfzq5zSmpf",
      },

      { text: "식사·수면 시간 규칙적으로 기록하기", url: null },
      { text: "스스로 비난하지 않는 연습하기", url: null },
      { text: "자극적인 활동 피하기", url: null },
      { text: "믿을 수 있는 사람/반려동물과 시간 보내기", url: null },
    ],
  };

  // -------------------------------------------------------------
  // 추천 리스트 추출
  // -------------------------------------------------------------
  useEffect(() => {
    const list = GUIDE_LIST[type] || [];
    const random3 = [...list].sort(() => 0.5 - Math.random()).slice(0, 3);
    setGuides(random3);
  }, [type]);

  // -------------------------------------------------------------
  // 투두리스트 추가
  // -------------------------------------------------------------
  const addToTodo = async (content) => {
    const uid = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("accessToken");

    if (!uid || !token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/todo/AddTodo",
        { uid, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("투두리스트에 추가되었습니다!");
    } catch (err) {
      console.error(err);
      alert("추가 중 오류가 발생했습니다.");
    }
  };

  const goProtected = (path) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    navigate(path);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.headerBox}>
        <h2>체크 완료!</h2>
        <p>
          {type === "GAD" && "불안 검사 결과"}
          {type === "PHQ" && "우울 검사 결과"}
          {type === "PSS" && "스트레스 검사 결과"}
        </p>
      </div>

      {/* 점수 카드 */}
      <div className={styles.card}>
        <h1 style={{ fontSize: "42px" }}>{totalScore}</h1>
        <p>정서 점수: {emotionalScore}</p>
        <p>신체 점수: {physicalScore}</p>
      </div>

      {/* 개선방안 리스트 */}
      {isLoggedIn && (
        <div className={styles.categoryContainer}>
          <h2>개선방안</h2>
          <p>투드리스트에 원하는 가이드를 넣어보세요</p>

          {guides.map((item, idx) => (
            <div key={idx} className={styles.guideItem}>
              <span>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bff", textDecoration: "underline" }}
                  >
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}
              </span>

              <button
                className={styles.addBtn}
                onClick={() => addToTodo(item.text)}
              >
                + 추가하기
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 버튼 */}
      <div className={styles.btnWrap}>
        <button
          className={styles.subBtn}
          onClick={() => navigate("/survey/start")}
        >
          다른 검사 하기
        </button>

        <button
          className={styles.subBtn}
          onClick={() => goProtected("/survey/record")}
        >
          기록 보기
        </button>

        <button
          className={styles.mainBtn}
          onClick={() => goProtected("/home")}
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default SurveyResult;
