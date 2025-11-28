import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "../styles/TodoList.css";

const TodoList = () => {
  // ---------- REFS ----------
  // 어제 달성도
  const yesterdayPercent = useRef(0);
  const yesterdayDone = useRef(0);
  const yesterdayTotal = useRef(0);

  // 이번 주 달성도
  const weekPercent = useRef(0);
  const weekDone = useRef(0);
  const weekTotal = useRef(0);

  // 이번 달 달성도
  const monthPercent = useRef(0);
  const monthDone = useRef(0);
  const monthTotal = useRef(0);

  // 리렌더용
  const [refresh, setRefresh] = useState(0);

  // 로그인된 유저 ID (우선 하드코딩, 나중에 AuthContext 쓰면 됨)
  const userId = "testUser01";

  // ---------- 데이터 가져오기 ----------
  useEffect(() => {
    axios
      .get("/api/progress/all", {
        params: { userId: userId }, // 백엔드에 userId 전달
      })
      .then((res) => {
        const data = res.data;

        // 어제 데이터
        yesterdayPercent.current = data.yesterdayPercent;
        yesterdayDone.current = data.yesterdayDone;
        yesterdayTotal.current = data.yesterdayTotal;

        // 이번 주 데이터
        weekPercent.current = data.weekPercent;
        weekDone.current = data.weekDone;
        weekTotal.current = data.weekTotal;

        // 이번 달 데이터
        monthPercent.current = data.monthPercent;
        monthDone.current = data.monthDone;
        monthTotal.current = data.monthTotal;

        // 화면 업데이트
        setRefresh((prev) => prev + 1);
      });
  }, []);

  return (
    <div className="progress-wrapper">

      {/* ------------------ 어제 달성도 ------------------ */}
      <div className="card yesterday-card">
        <h2 className="card-title">어제 달성도</h2>
        <p className="card-sub">어제 하루 동안의 실천 현황</p>

        <div className="percent-text">{yesterdayPercent.current}%</div>

        <div className="detail-count">
          {yesterdayDone.current} / {yesterdayTotal.current} 완료
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${yesterdayPercent.current}%` }}
          ></div>
        </div>

        <div className="yesterday-grid">
          <div className="y-item">✔ 글씨 수정</div>
          <div className="y-item">✔ 글씨 수정</div>
          <div className="y-item">✔ 글씨 수정</div>
          <div className="y-item">✔ 글씨 수정</div>
          <div className="y-item">✔ 글씨 수정</div>
          <div className="y-item">✔ 글씨 수정</div>
          <div className="y-item">✔ 글씨 수정</div>
          <div className="y-item">✔ 글씨 수정</div>
        </div>
      </div>

      {/* ------------------ 이번 주 + 이번 달 ------------------ */}
      <div className="row-container">

        {/* ---------------- 이번 주 ---------------- */}
        <div className="card week-card">
          <h2 className="card-title">이번 주 달성도</h2>

          <div className="percent-text">{weekPercent.current}%</div>

          <div className="detail-count">
            {weekDone.current} / {weekTotal.current} 완료
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${weekPercent.current}%` }}
            ></div>
          </div>

          <div className="week-box-row">
            <div className="week-box">글씨 수정</div>
            <div className="week-box">글씨 수정</div>
            <div className="week-box">글씨 수정</div>
            <div className="week-box">글씨 수정</div>
            <div className="week-box">글씨 수정</div>
            <div className="week-box">글씨 수정</div>
            <div className="week-box">글씨 수정</div>
          </div>

          <p className="week-desc">글씨 수정</p>
        </div>

        {/* ---------------- 이번 달 ---------------- */}
        <div className="card month-card">
          <h2 className="card-title">이번 달 달성도</h2>

          <div className="percent-text">{monthPercent.current}%</div>

          <div className="detail-count">
            {monthDone.current} / {monthTotal.current} 완료
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${monthPercent.current}%` }}
            ></div>
          </div>

          <div className="month-progress-list">
            <div className="week-progress-box">
              <div className="week-progress-title">글씨 수정</div>
              <div className="progress-bar small-bar">
                <div className="progress-fill" style={{ width: "50%" }}></div>
              </div>
            </div>

            <div className="week-progress-box">
              <div className="week-progress-title">글씨 수정</div>
              <div className="progress-bar small-bar">
                <div className="progress-fill" style={{ width: "60%" }}></div>
              </div>
            </div>

            <div className="week-progress-box">
              <div className="week-progress-title">글씨 수정</div>
              <div className="progress-bar small-bar">
                <div className="progress-fill" style={{ width: "40%" }}></div>
              </div>
            </div>

            <div className="week-progress-box">
              <div className="week-progress-title">글씨 수정</div>
              <div className="progress-bar small-bar">
                <div className="progress-fill" style={{ width: "55%" }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TodoList;
