// ==========================
//  DiaryHistory.jsx
// 전체 일기 목록 조회용 리스트
// useState 버전
// ==========================

import React, { useEffect, useState } from "react";
import axios from "axios";

const DiaryHistory = ({ uid }) => {
  // 전체 일기 데이터
  const [list, setList] = useState([]);

  // 첫 로딩 시 전체 일기 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:3000/diary/list/${uid}`)
      .then((res) => setList(res.data));
  }, [uid]);

  if (list.length === 0)
    return <p style={{ marginTop: "20px" }}>작성한 기록이 없습니다.</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>내 감정일기 기록</h3>

      {list.map((item) => (
        <div
          key={item.date}
          style={{
            padding: "12px",
            background: "#f4f4f4",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <strong>{item.date}</strong>
          <p>
            추후 {item.depression} / 수정 {item.anxiety} / 예정{" "}
            {item.stress}
          </p>
          <p>{item.text.slice(0, 40)}...</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryHistory;
