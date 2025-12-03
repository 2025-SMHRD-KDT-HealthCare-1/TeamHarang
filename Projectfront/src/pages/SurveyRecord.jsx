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
  const [records, setRecords] = useState([]);

  const latest = records[0] || null;

  useEffect(() => {
    if (!uid) return;

    axios
      .get(`http://localhost:3001/survey/result/${uid}`)
      .then((res) => {
        console.log("🔥 설문 조회 결과:", res.data);
        setRecords(res.data);
      })
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
              <BarChart data={[{ name: latest.survey_type, score: latest.total_score }]}>
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

        {records.length === 0 ? (
          <p>기록이 없습니다.</p>
        ) : (
          <div className={styles.listBox}>
            {records.map((item) => (
              <div key={item.result_id} className={styles.recordItem}>
                <div className={styles.left}>

                  <div className={styles.date}>
                    {new Date(item.survey_date).toLocaleDateString()}
                  </div>

                  <span className={styles.type}>{item.survey_type}</span>

                  <span className={styles.score}>{item.total_score}점</span>
                </div>

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
