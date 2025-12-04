// src/pages/DiaryHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DiaryHistory.module.css";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function DiaryHistory() {
  const { user, accessToken } = useAuthStore();
  const user_id = user?.user_id;

  const navigate = useNavigate();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState("");

  const [dates, setDates] = useState([]);
  const [detail, setDetail] = useState(null);

  const makeDateString = (y, m, d) =>
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  // ===========================
  //   월별 날짜 조회
  // ===========================
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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const dates = res.data?.dates || [];
      setDates(dates.map((d) => new Date(d).toLocaleDateString("sv-SE")));
      setDay("");
      setDetail(null);
    } catch (err) {
      console.log("월별 일기 조회 실패", err);
    }
  };

  useEffect(() => {
    loadMonth();
  }, [year, month]);

  // ===========================
  //   특정 날짜 상세 조회
  // ===========================
  const loadDetail = async () => {
    if (!day || !user_id || !accessToken) return;

    const dateStr = makeDateString(year, month, day);

    try {
      const res = await axios.post(
        "http://localhost:3001/diary/GetDiaryDate",
        { user_id, date: dateStr },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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

  // 날짜 중복 제거
  const dayList = [...new Set(dates.map((d) => Number(d.split("-")[2])))];

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
                {/* 수정 버튼 */}
                <button
                  className={styles.editBtn}
                  onClick={() =>
                    navigate(
                      `/diary/text?date=${makeDateString(year, month, day)}`
                    )
                  }
                >
                  수정
                </button>

                {/* 삭제 버튼 */}
                <button
                  className={styles.deleteBtn}
                  onClick={async () => {
                    if (!window.confirm("정말 삭제할까요?")) return;

                    try {
                      await axios.post(
                        "http://localhost:3001/diary/DeleteDiary",
                        {
                          user_id,
                          date: makeDateString(year, month, day),
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${accessToken}`,
                          },
                        }
                      );

                      alert("삭제 완료!");
                      loadMonth(); // 삭제 후 목록 갱신
                      setDetail(null);
                      setDay("");
                    } catch (err) {
                      console.log("삭제 실패", err);
                    }
                  }}
                >
                  삭제
                </button>
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
