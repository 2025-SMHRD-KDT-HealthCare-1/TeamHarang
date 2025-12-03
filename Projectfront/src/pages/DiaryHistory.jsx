import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DiaryHistory.module.css";

const DiaryHistory = ({ user_id }) => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 검색 상태 추가

  useEffect(() => {
    axios
      .get(`http://localhost:3001/DiaryAll/${user_id}`)
      .then((res) => setList(res.data));
  }, [user_id]);

  // 검색(날짜 + 내용)
  const filteredList = list.filter((item) => {
    const lower = search.toLowerCase();
    return (
      item.date.includes(lower) || 
      item.content.toLowerCase().includes(lower)
    );
  });

  if (list.length === 0)
    return <p className={styles.empty}>작성한 기록이 없습니다.</p>;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>내 감정일기 기록</h3>

      {/* 검색창 추가 */}
      <input
        type="text"
        placeholder="날짜 또는 내용을 검색하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
      />

      {/* 검색결과 없을 때 */}
      {filteredList.length === 0 ? (
        <p className={styles.empty}>검색 결과가 없습니다.</p>
      ) : (
        filteredList.map((item) => (
          <div key={item.date} className={styles.card}>
            <strong className={styles.date}>{item.date}</strong>

            <p className={styles.score}>
              우울 {item.depression} / 불안 {item.anxiety} / 스트레스 {item.strees}
            </p>

            <p className={styles.text}>
              {item.content.length > 40
                ? `${item.content.slice(0, 40)}...`
                : item.content}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default DiaryHistory;
