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

  // 오늘 날짜를 한국 기준(현재 브라우저 타임존) 그대로 YYYY-MM-DD 형태로 생성
  // toISOString()은 UTC 기준이라 날짜가 하루 밀리는 문제가 있음
  // "sv-SE"는 전 세계적으로 YYYY-MM-DD 포맷을 안전하게 생성할 때 사용하는 표준 locale
  // → 타임존은 변경 X -> 포맷만 YYYY-MM-DD로 바꿔줘서 날짜 밀림이 발생 X
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
        setStress(d.stress);
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
          stress: stress,
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
