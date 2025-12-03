// src/pages/DiaryText.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./DiaryText.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function DiaryText() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();  //  토큰 가져오기
  const user_id = user?.user_id;

  const todayStr = new Date().toLocaleDateString("sv-SE")

  const [date, setDate] = useState(todayStr);
  const [depression, setDepression] = useState(0);
  const [anxiety, setAnxiety] = useState(0);
  const [stress, setStress] = useState(0);
  const [content, setContent] = useState("");

  // ============================
  // 특정 날짜 일기 조회
  // ============================
  const loadDiary = async () => {
    if (!user_id || !accessToken) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/diary/GetDiaryDate",
        { user_id, date },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,   //  토큰 포함
          },
        }
      );

      if (res.data.diaries?.length > 0) {
        const d = res.data.diaries[0];
        setContent(d.content);
        setStress(d.strees);
        setAnxiety(d.anxiety);
        setDepression(d.depression);
      } else {
        setContent("");
        setStress(0);
        setAnxiety(0);
        setDepression(0);
      }
    } catch (err) {
      console.log("일기 조회 실패", err);
    }
  };

  useEffect(() => {
    loadDiary();
  }, [date]);

  // ============================
  // 저장하기
  // ============================
  const handleSave = async () => {
    if (!user_id || !accessToken)
      return alert("로그인이 필요합니다.");

    try {
      await axios.post(
        "http://localhost:3001/diary/AddDiary",
        {
          user_id,
          date,
          content,
          strees: stress,
          anxiety,
          depression,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // 토큰 포함
          },
        }
      );

      alert("일기 저장 완료!");
    } catch (err) {
      console.log("저장 실패", err);
      alert("저장 실패!");
    }
  };

  const goHistory = () => navigate("/diary/history");

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>감정 일기</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={styles.datePicker}
      />

      <div className={styles.sliderRow}>
        <div className={styles.sliderBox}>
          <label>우울 {depression}/10</label>
          <input
            type="range"
            min="0"
            max="10"
            value={depression}
            onChange={(e) => setDepression(Number(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderBox}>
          <label>불안 {anxiety}/10</label>
          <input
            type="range"
            min="0"
            max="10"
            value={anxiety}
            onChange={(e) => setAnxiety(Number(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderBox}>
          <label>스트레스 {stress}/10</label>
          <input
            type="range"
            min="0"
            max="10"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      <h3 className={styles.subTitle}>오늘의 일지 작성</h3>

      <textarea
        placeholder="오늘 하루는 어땠나요?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textBox}
      />

      <div className={styles.btnRow}>
        <button className={styles.saveBtn} onClick={handleSave}>
          일기 저장
        </button>

        <button className={styles.historyBtn} onClick={goHistory}>
          기록 보기
        </button>
      </div>
    </div>
  );
}
