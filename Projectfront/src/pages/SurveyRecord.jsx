// ==========================
// SurveyRecord.jsx — 최종본
// ==========================

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SurveyRecord.module.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const SurveyRecord = () => {
  const uid = localStorage.getItem("user_id");

  // 전체 설문 기록 리스트
  const [records, setRecords] = useState([]);

  // 가장 최신 기록
  const latest = records[0] || null;

  useEffect(() => {
    axios
      .get(`http://localhost:3001/survey/result/${uid}`)
      .then((res) => setRecords(res.data))
      .catch((err) => console.error(err));
  }, [uid]);

  return (
    <div className={styles.wrapper}>

      {/* ======================= */}
      {/* 1) 최신 상태 분석 그래프 */}
      {/* ======================= */}
      <div className={styles.section}>
        <h2>현재 상태 분석</h2>

        <div className={styles.chartBox}>
          {latest ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[{ name: latest.survey_type, score: latest.score }]}>
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

        {/* --------- 3개 카드 --------- */}
        <div className={styles.cardRow}>
          <div className={styles.card}>
            <span>우울</span>
            <p>{latest?.phq ?? "-"}</p>
          </div>

          <div className={styles.card}>
            <span>불안</span>
            <p>{latest?.gad ?? "-"}</p>
          </div>

          <div className={styles.card}>
            <span>스트레스</span>
            <p>{latest?.pss ?? "-"}</p>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/* 2) 설문 기록 리스트       */}
      {/* ======================= */}
      <div className={styles.section}>
        <h2>체크 기록</h2>

        {records.length === 0 ? (
          <p>기록이 없습니다.</p>
        ) : (
          <div className={styles.listBox}>
            {records.map((item) => (
              <div key={item.id} className={styles.recordItem}>
                <div className={styles.left}>
                  <div className={styles.date}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>

                  <span className={styles.type}>{item.survey_type}</span>

                  <span className={styles.score}>{item.score}점</span>
                </div>

                <span
                  className={`${styles.level} ${
                    item.level === "매우 높음"
                      ? styles.levelDanger
                      : item.level === "높음"
                      ? styles.levelHigh
                      : styles.levelNormal
                  }`}
                >
                  {item.level}
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
