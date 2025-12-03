// src/pages/DiaryHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DiaryHistory.module.css";
import { useAuthStore } from "../store/useAuthStore";

export default function DiaryHistory() {
  const { user, accessToken } = useAuthStore();   // ★ 토큰 포함
  const user_id = user?.user_id;

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState("");

  const [dates, setDates] = useState([]);
  const [detail, setDetail] = useState(null);

  const makeDateString = (y, m, d) =>
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  // ============================================
  //  MonthDiary : 연/월 → 작성 날짜 조회
  // ============================================
  const loadMonth = async () => {
    if (!user_id || !accessToken) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/diary/MonthDiary",
        {
          uid: user_id,
          year,
          month,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,   // ★ 토큰 포함
          },
        }
      );

      const dates = res.data?.dates || [];

      // 날짜 문자열(d)을 Date로 변환할 때 UTC 기준으로 파싱되어 하루 밀리는 현상 방지
      // toLocaleDateString("sv-SE")는 타임존은 그대로 두고
      // 포맷만 YYYY-MM-DD로 바꿔주므로 날짜 오류가 발생 X
      setDates(dates.map((d) => new Date(d).toLocaleDateString("sv-SE")));  // 변경
      setDay("");
      setDetail(null);
    } catch (err) {
      console.log("월별 일기 조회 실패", err);
    }
  };

  useEffect(() => {
    loadMonth();
  }, [year, month]);

  // ============================================
  //  일(day) 선택 → 특정 날짜 상세 조회
  // ============================================
  const loadDetail = async () => {
    if (!day || !user_id || !accessToken) return;

    const dateStr = makeDateString(year, month, day);

    try {
      const res = await axios.post(
        "http://localhost:3001/diary/GetDiaryDate",
        {
          user_id,
          date: dateStr,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,   // ★ 토큰 포함
          },
        }
      );

      if (res.data.diaries?.length > 0) setDetail(res.data.diaries[0]);
      else setDetail(null);
    } catch (err) {
      console.log("상세 조회 실패", err);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [day]);

  const dayList = dates.map((d) => Number(d.split("-")[2]));

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>감정 일기 기록</h1>

      {/* 연/월/일 선택 */}
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

      {/* 상세보기 */}
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
