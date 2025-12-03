// src/pages/DiaryHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DiaryHistory.module.css";
import { useAuthStore } from "../store/useAuthStore";

export default function DiaryHistory() {
  const { user } = useAuthStore();
  const user_id = user?.user_id;

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(""); // 드롭다운 선택한 '일'

  const [dates, setDates] = useState([]); // 해당 월의 작성 날짜 목록
  const [detail, setDetail] = useState(null); // 선택 날짜 상세 내용

  // 날짜 YYYY-MM-DD로 변환
  const makeDateString = (y, m, d) =>
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  // ============================================
  //  MonthDiary : 연/월 선택 시 → 해당 월 날짜 리스트
  // ============================================
  const loadMonth = async () => {
    if (!user_id) return;

    try {
      const res = await axios.post("http://localhost:3001/diary/MonthDiary", {
        uid: user_id,
        year,
        month,
      });

      const dates = res.data?.dates || [];

      setDates(dates.map((d) => d.split("T")[0])); // YYYY-MM-DD 형태로 저장
      setDay(""); // 월 바꾸면 일 초기화
      setDetail(null);
    } catch (err) {
      console.log("월별 일기 조회 실패", err);
    }
  };

  useEffect(() => {
    loadMonth();
  }, [year, month]);

  // ============================================
  //  선택된 일(day) → 상세 조회
  // ============================================
  const loadDetail = async () => {
    if (!day || !user_id) return;

    const dateStr = makeDateString(year, month, day);

    try {
      const res = await axios.post("http://localhost:3001/diary/GetDiaryDate", {
        user_id,
        date: dateStr,
      });

      if (res.data.diaries?.length > 0) setDetail(res.data.diaries[0]);
      else setDetail(null);
    } catch (err) {
      console.log("상세 조회 실패", err);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [day]);

  // ============================================
  //  해당 월에서 작성된 날짜만 "일 드롭다운"으로 표시
  // ============================================
  const dayList = dates.map((d) => Number(d.split("-")[2])); // ['2024-12-03'] → 3

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>감정 일기 기록</h1>

      {/* ---------------- 연/월/일 드롭다운 ---------------- */}
      <div className={styles.selectRow}>
        {/* 연 */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className={styles.selectBox}
        >
          {Array.from({ length: 5 }, (_, i) => today.getFullYear() - i).map(
            (y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            )
          )}
        </select>

        {/* 월 */}
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className={styles.selectBox}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>

        {/* 일 */}
        <select
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className={styles.selectBox}
        >
          <option value="">일 선택</option>
          {dayList.map((d) => (
            <option key={d} value={d}>
              {d}일
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- 상세 보기 ---------------- */}
      {day && (
        <div className={styles.detailBox}>
          <h2 className={styles.detailTitle}>
            {year}년 {month}월 {day}일
          </h2>

          {detail ? (
            <>
              <div className={styles.scoreRow}>
                <p>우울: {detail.depression}</p>
                <p>불안: {detail.anxiety}</p>
                <p>스트레스: {detail.strees}</p>
              </div>

              <p className={styles.content}>{detail.content}</p>

              <div className={styles.btnRow}>
                <button className={styles.editBtn}>수정</button>
                <button className={styles.deleteBtn}>삭제</button>
              </div>
            </>
          ) : (
            <p className={styles.emptyDetail}>이 날짜의 기록이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
