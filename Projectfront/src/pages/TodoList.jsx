import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import styles from "./TodoList.module.css";

const TodoList = () => {
  // refs & useState 동일
  const yesterdayPercent = useRef(0);
  const yesterdayDone = useRef(0);
  const yesterdayTotal = useRef(0);

  const weekPercent = useRef(0);
  const weekDone = useRef(0);
  const weekTotal = useRef(0);

  const monthPercent = useRef(0);
  const monthDone = useRef(0);
  const monthTotal = useRef(0);

  const [, setRefresh] = useState(0);
  const userId = "testUser01";

  useEffect(() => {
    axios
      .get("/api/progress/all", { params: { userId } })
      .then((res) => {
        const data = res.data;

        yesterdayPercent.current = data.yesterdayPercent;
        yesterdayDone.current = data.yesterdayDone;
        yesterdayTotal.current = data.yesterdayTotal;

        weekPercent.current = data.weekPercent;
        weekDone.current = data.weekDone;
        weekTotal.current = data.weekTotal;

        monthPercent.current = data.monthPercent;
        monthDone.current = data.monthDone;
        monthTotal.current = data.monthTotal;

        setRefresh((prev) => prev + 1);
      });
  }, []);

  return (
    <div className={styles["progress-wrapper"]}>

      {/* 어제 */}
      <div className={`${styles.card} ${styles["yesterday-card"]}`}>
        <h2 className={styles["card-title"]}>어제 달성도</h2>
        <p className={styles["card-sub"]}>어제 하루 동안의 실천 현황</p>

        <div className={styles["percent-text"]}>{yesterdayPercent.current}%</div>

        <div className={styles["detail-count"]}>
          {yesterdayDone.current} / {yesterdayTotal.current} 완료
        </div>

        <div className={styles["progress-bar"]}>
          <div
            className={styles["progress-fill"]}
            style={{ width: `${yesterdayPercent.current}%` }}
          ></div>
        </div>

        <div className={styles["yesterday-grid"]}>
          <div className={styles["y-item"]}>✔ 글씨 수정</div>
          <div className={styles["y-item"]}>✔ 글씨 수정</div>
          <div className={styles["y-item"]}>✔ 글씨 수정</div>
          <div className={styles["y-item"]}>✔ 글씨 수정</div>
          <div className={styles["y-item"]}>✔ 글씨 수정</div>
          <div className={styles["y-item"]}>✔ 글씨 수정</div>
          <div className={styles["y-item"]}>✔ 글씨 수정</div>
          <div className={styles["y-item"]}>✔ 글씨 수정</div>
        </div>
      </div>

      {/* 이번 주 + 이번 달 */}
      <div className={styles["row-container"]}>

        {/* 이번 주 */}
        <div className={`${styles.card} ${styles["week-card"]}`}>
          <h2 className={styles["card-title"]}>이번 주 달성도</h2>

          <div className={styles["percent-text"]}>{weekPercent.current}%</div>

          <div className={styles["detail-count"]}>
            {weekDone.current} / {weekTotal.current} 완료
          </div>

          <div className={styles["progress-bar"]}>
            <div
              className={styles["progress-fill"]}
              style={{ width: `${weekPercent.current}%` }}
            ></div>
          </div>

          <div className={styles["week-box-row"]}>
            <div className={styles["week-box"]}>글씨 수정</div>
            <div className={styles["week-box"]}>글씨 수정</div>
            <div className={styles["week-box"]}>글씨 수정</div>
            <div className={styles["week-box"]}>글씨 수정</div>
            <div className={styles["week-box"]}>글씨 수정</div>
            <div className={styles["week-box"]}>글씨 수정</div>
            <div className={styles["week-box"]}>글씨 수정</div>
          </div>

          <p className={styles["week-desc"]}>글씨 수정</p>
        </div>

        {/* 이번 달 */}
        <div className={`${styles.card} ${styles["month-card"]}`}>
          <h2 className={styles["card-title"]}>이번 달 달성도</h2>

          <div className={styles["percent-text"]}>{monthPercent.current}%</div>

          <div className={styles["detail-count"]}>
            {monthDone.current} / {monthTotal.current} 완료
          </div>

          <div className={styles["progress-bar"]}>
            <div
              className={styles["progress-fill"]}
              style={{ width: `${monthPercent.current}%` }}
            ></div>
          </div>

          <div className={styles["month-progress-list"]}>
            {/* 예시 데이터 */}
            <div className={styles["week-progress-box"]}>
              <div className={styles["week-progress-title"]}>글씨 수정</div>
              <div className={`${styles["progress-bar"]} ${styles["small-bar"]}`}>
                <div className={styles["progress-fill"]} style={{ width: "50%" }}></div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TodoList;
