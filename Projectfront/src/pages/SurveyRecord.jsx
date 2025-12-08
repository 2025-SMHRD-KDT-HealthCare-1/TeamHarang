// ==========================
// SurveyRecord.jsx — 최종 완성본
// ==========================

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SurveyRecord.module.css";
import { useAuthStore } from "../store/useAuthStore";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const SurveyRecord = () => {
  const { accessToken } = useAuthStore();
  const uid = localStorage.getItem("user_id");

  const [records, setRecords] = useState([]);

  // 🔹 DB에 저장된 survey_type 그대로 사용 (PHQ9 / GAD7 / PSS10)
  const [selectedType, setSelectedType] = useState("GAD7");

  // ------------------------------
  // 🔹 survey_type 정확히 일치 필터링
  // ------------------------------
  const filtered = records.filter((r) => r.survey_type === selectedType);

  // 🔹 최신 1개
  const latest = filtered[0] || null;

  useEffect(() => {
    if (!uid || !accessToken) return;

    axios
      .get(`http://localhost:3001/survey/result/${uid}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log(" 전체 설문 기록:", res.data);
        setRecords(res.data);
      })
      .catch((err) => console.error(err));
  }, [uid, accessToken]);

  return (
    <div className={styles.wrapper}>

      {/* ======================= */}
      {/*  알약형 탭 (PHQ9/GAD7/PSS10) */}
      {/* ======================= */}
      <div className={styles.tabContainer}>
        {["PHQ9", "GAD7", "PSS10"].map((type) => (
          <button
            key={type}
            className={`${styles.tab} ${
              selectedType === type ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ======================= */}
      {/* 1) 최신 상태 분석 */}
      {/* ======================= */}
      <div className={styles.section}>
        <h2>현재 상태 분석</h2>

        <div className={styles.chartBox}>
          {latest ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={[{ name: latest.survey_type, score: latest.total_score }]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#9b75ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>데이터 없음</p>
          )}
        </div>

        {/* --------- 분석 카드 3개 --------- */}
        <div className={styles.cardRow}>
          <div className={styles.card}>
            <span>정서(Emotional)</span>
            <p>{latest?.emotional_point ?? "-"}</p>
          </div>

          <div className={styles.card}>
            <span>신체(Physical)</span>
            <p>{latest?.physical_point ?? "-"}</p>
          </div>

          <div className={styles.card}>
            <span>총점</span>
            <p>{latest?.total_score ?? "-"}</p>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/* 2) 설문 기록 리스트 */}
      {/* ======================= */}
      <div className={styles.section}>
        <h2>체크 기록</h2>

        {filtered.length === 0 ? (
          <p>기록이 없습니다.</p>
        ) : (
          <div className={styles.listBox}>
            {filtered.map((item) => (
              <div key={item.result_id} className={styles.recordItem}>

                {/* ----------------------- */}
                {/* 기본 정보 (날짜 / 타입 / 점수) */}
                {/* ----------------------- */}
                <div className={styles.left}>
                  <div className={styles.date}>
                    {new Date(item.survey_date).toLocaleDateString()}
                  </div>

                  <span className={styles.type}>{item.survey_type}</span>
                  <span className={styles.score}>{item.total_score}점</span>
                </div>

                {/* ------------------------------------------------- */}
                {/*  정서·신체 점수 표시  */}
                {/* ------------------------------------------------- */}
                <div className={styles.subInfo}>
                  정서 {item.emotional_point}점 · 신체 {item.physical_point}점
                </div>

                {/* ----------------------- */}
                {/* 위험도 표시 */}
                {/* ----------------------- */}
                <span className={styles.level}>
                  {item.emotional_point + item.physical_point >= 20
                    ? "높음"
                    : "보통"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SurveyRecord;
