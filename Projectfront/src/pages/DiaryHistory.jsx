// ==========================
//  DiaryHistory.jsx (CSS 모듈 버전)
// ==========================

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DiaryHistory.module.css";

const DiaryHistory = ({ uid }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/diary/list/${uid}`)
      .then((res) => setList(res.data));
  }, [uid]);

  if (list.length === 0)
    return <p className={styles.empty}>작성한 기록이 없습니다.</p>;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>내 감정일기 기록</h3>

      {list.map((item) => (
        <div key={item.date} className={styles.card}>
          <strong className={styles.date}>{item.date}</strong>
          <p className={styles.score}>
            우울 {item.depression} / 불안 {item.anxiety} / 스트레스 {item.stress}
          </p>

          <p className={styles.text}>
            {item.text.length > 40
              ? `${item.text.slice(0, 40)}...`
              : item.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DiaryHistory;
