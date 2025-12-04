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

  /**
   * 프론트에서 설문 제출 후 SurveyForm.jsx에서 navigate할 때 전달된 값들
   *
   * type: 설문지 종류 (PHQ, GAD, PSS)
   * totalScore: 전체 총점
   * emotionalScore: E(정서적 반응) 문항 점수 총합
   * physicalScore: P(신체적 반응) 문항 점수 총합
   *
   *   NOTE: 이 값들을 기반으로 "정서(E) 카테고리" / "신체(P) 카테고리"를 결정하는 것은
   *         백엔드에서 /guide/recommend API 내부 로직에서 처리해야 함.
   *         (프론트는 점수만 넘김)
   */
  const { type, totalScore, emotionalScore, physicalScore } =
    location.state || {};

  const [guides, setGuides] = useState([]);

  // 로그인 토큰 
  const token = localStorage.getItem("accessToken");

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
  // 2. 백엔드에 맞춤 개선 가이드 요청
  //
  // 현재 프론트는 "점수만" 백엔드에 넘기며,
  // 정서/신체 반응 카테고리 판별 및 추천 로직은 백엔드가 수행해야 함.
  //
  //      GET /guide/recommend
  //
  //      요청 파라미터:
  //      - type            (PHQ / GAD / PSS)
  //      - totalScore      (총점)
  //      - emotionalScore  (정서 점수)
  //      - physicalScore   (신체 점수)
  //
  //      백엔드에서 해야 하는 일:
  //      1) emotionalScore 기반 정서(E) 반응 카테고리 결정
  //         예: 걱정 증가 / 슬픔·무기력 / 짜증·과민 / 자기비난
  //
  //      2) physicalScore 기반 신체(P) 반응 카테고리 결정
  //         예: 근육 긴장 / 두근거림 / 피로 / 수면문제 / 집중문제 / 두통
  //
  //      3) 정서/신체 카테고리에 매핑된 추천 개선 가이드 리스트 반환
  //
  //      백엔드 응답 예시:
  //      [
  //        {
  //          "id": 1,
  //          "title": "복식호흡",
  //          "desc": "천천히 깊게 호흡하여...",
  //          "icon": "🌿",
  //          "color": "#8ae3c7"
  //        },
  //        ...
  //      ]
  //
  //      프론트는 guides 배열만 받아서 UI 렌더링.
  // -------------------------------------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:3001/guide/recommend", {
        params: {
          type,
          totalScore,
          emotionalScore,
          physicalScore,
        },
        headers: {
          Authorization: `Bearer ${token}`, // 토큰 
        },
      })
      .then((res) => {
        setGuides(res.data); // 백엔드에서 추천한 가이드 리스트
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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

      {/* ----------------- 정서/신체 미니 카드 ----------------- */}
      <div className={styles.improveRow}>
        <div className={styles.improveCard}>
          <div className={styles.improveHeader}>
            <div className={styles.iconCircle} style={{ background: "#b28bff" }}>
              💜
            </div>
            <div>
              <h3 style={{ margin: 0 }}>정서적 반응 개선</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>감정 정리 · 인지 전환 도움</p>
            </div>
          </div>
        </div>

        <div className={styles.improveCard}>
          <div className={styles.improveHeader}>
            <div className={styles.iconCircle} style={{ background: "#8ae3c7" }}>
              💚
            </div>
            <div>
              <h3 style={{ margin: 0 }}>신체적 반응 개선</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>호흡 · 이완 · 명상 중심</p>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- 맞춤 개선 가이드 ----------------- */}
      <div className={styles.categoryContainer}>
        <h2 style={{ margin: 0 }}>개선방안</h2>
        <p style={{ opacity: 0.8, marginBottom: "20px" }}>
          아래 추천 가이드를 확인해보세요.
        </p>

        {/* 백엔드에서 준 guides 데이터를 렌더링 */}
        <ImprovementGuide guides={guides} />
      </div>

      {/* ----------------- 이동 버튼 ----------------- */}
      <div className={styles.btnWrap}>
        <button
          className={styles.subBtn}
          onClick={() => navigate("/survey/start")}
        >
          다른 검사 하기
        </button>

        <button
          className={styles.subBtn}
          onClick={() => navigate("/survey/record")}
        >
          기록 보기
        </button>

        <button
          className={styles.mainBtn}
          onClick={() => navigate("/home")}
        >
          홈으로 이동
        </button>
      </div>

    </div>
  );
};

export default SurveyResult;
