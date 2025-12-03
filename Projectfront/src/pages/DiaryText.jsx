// src/pages/DiaryText.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./DiaryText.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function DiaryText() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken } = useAuthStore();
  const user_id = user?.user_id;

  // 수정 모드인지 확인 (URL: /diary/text?date=2024-12-03)
  const query = new URLSearchParams(location.search);
  const editDate = query.get("date");

  const todayStr = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(editDate || todayStr);
  const [depression, setDepression] = useState(0);
  const [anxiety, setAnxiety] = useState(0);
  const [stress, setStress] = useState(0);
  const [content, setContent] = useState("");

  const isEditMode = Boolean(editDate);

  // ============================
  // 특정 날짜 조회 (수정 모드일 때 자동 실행)
  // ============================
  const loadDiary = async () => {
    if (!user_id || !accessToken) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/diary/GetDiaryDate",
        { user_id, date },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
        if (isEditMode) alert("기록이 존재하지 않습니다.");
      }
    } catch (err) {
      console.log("일기 조회 실패", err);
    }
  };

  useEffect(() => {
    if (isEditMode) loadDiary();
  }, [date]);

  // ============================
  // 저장 / 수정 처리
  // ============================
  const handleSave = async () => {
    if (!user_id || !accessToken)
      return alert("로그인이 필요합니다.");

    const diaryData = {
      user_id,
      date,
      content,
      strees: stress,
      anxiety,
      depression,
    };

    try {
      if (isEditMode) {
        // ---------- 수정 ----------
        await axios.put(
          "http://localhost:3001/diary/Diary",
          diaryData,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        alert("일기 수정 완료!");
      } else {
        // ---------- 신규 작성 ----------
        await axios.post(
          "http://localhost:3001/diary/AddDiary",
          diaryData,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        alert("일기 저장 완료!");
      }

      navigate("/diary/history");
    } catch (err) {
      console.log("저장 실패", err);
      alert("저장 실패!");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        {isEditMode ? "일기 수정" : "감정 일기 작성"}
      </h1>

      <input
        type="date"
        value={date}
        disabled={isEditMode} // 수정 모드에서는 날짜 변경 불가
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

      <h3 className={styles.subTitle}>오늘의 일지</h3>

      <textarea
        placeholder="오늘 하루는 어땠나요?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textBox}
      />

      <div className={styles.btnRow}>
        <button className={styles.saveBtn} onClick={handleSave}>
          {isEditMode ? "수정 완료" : "일기 저장"}
        </button>

        <button
          className={styles.historyBtn}
          onClick={() => navigate("/diary/history")}
        >
          기록 보기
        </button>
      </div>
    </div>
  );
}
