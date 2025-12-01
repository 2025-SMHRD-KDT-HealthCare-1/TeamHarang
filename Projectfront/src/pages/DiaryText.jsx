// ========================
//  DiaryText.jsx (State 버전)
// ========================

import React, { useState, useEffect } from "react";
import axios from "axios";
import DiaryHistory from "./DiaryHistory";

const DiaryText = () => {
  // 오늘 날짜 기본값
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // 감정값 + 텍스트
  const [values, setValues] = useState({
    depression: 0,
    anxiety: 0,
    stress: 0,
    text: "",
  });

  // 수정 모드인지 확인
  const [isEditing, setIsEditing] = useState(false);

  // 기록 보기 모드
  const [showHistory, setShowHistory] = useState(false);

  const uid = localStorage.getItem("uid");

  // -------------------------------------------------------
  // 날짜 바뀔 때 DB에서 일기 가져오기
  // -------------------------------------------------------
  useEffect(() => {
    axios
      .get(`http://localhost:3000/diary/${uid}/${selectedDate}`)
      .then((res) => {
        if (res.data) {
          // DB에 기록 있음 → 수정 모드
          setValues({
            depression: res.data.depression,
            anxiety: res.data.anxiety,
            stress: res.data.stress,
            text: res.data.text,
          });
          setIsEditing(true);
        } else {
          // 기록 없음 → 초기값
          setValues({
            depression: 0,
            anxiety: 0,
            stress: 0,
            text: "",
          });
          setIsEditing(false);
        }
      });
  }, [selectedDate, uid]);

  // 저장
  const handleSave = () => {
    axios
      .post("http://localhost:3000/diary", {
        uid,
        date: selectedDate,
        ...values,
      })
      .then(() => {
        alert("일기 저장 완료!");
        setIsEditing(true);
      });
  };

  // 수정
  const handleUpdate = () => {
    axios
      .put("http://localhost:3000/diary", {
        uid,
        date: selectedDate,
        ...values,
      })
      .then(() => {
        alert("수정 완료!");
      });
  };

  // 삭제
  const handleDelete = () => {
    if (!window.confirm("정말 삭제할까요?")) return;

    axios
      .delete(`http://localhost:3000/diary/${uid}/${selectedDate}`)
      .then(() => {
        alert("삭제 완료!");
        setValues({
          depression: 0,
          anxiety: 0,
          stress: 0,
          text: "",
        });
        setIsEditing(false);
      });
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>감정 일기</h2>

      {/* 날짜 선택 */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ marginBottom: "20px", display: "block" }}
      />

      {/* --------------------------- */}
      {/* 감정 슬라이더 가로 정렬     */}
      {/* --------------------------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* 우울 */}
        <div style={{ flex: 1 }}>
          <p style={{ marginBottom: "6px" }}>
            우울 <strong>{values.depression}/10</strong>  {/* 전체 점수 기준 10점 만점  */}
          </p>
          <input
            type="range"
            min="0"
            max="10"
            value={values.depression}
            onChange={(e) =>
              setValues({ ...values, depression: Number(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* 불안 */}
        <div style={{ flex: 1 }}>
          <p style={{ marginBottom: "6px" }}>
            불안 <strong>{values.anxiety}/10</strong> {/* 전체 점수 기준 10점 만점  */}
          </p>
          <input
            type="range"
            min="0"
            max="10"
            value={values.anxiety}
            onChange={(e) =>
              setValues({ ...values, anxiety: Number(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* 스트레스 */}
        <div style={{ flex: 1 }}>
          <p style={{ marginBottom: "6px" }}>
            스트레스 <strong>{values.stress}/10</strong>       {/* 전체 점수 기준 10점 만점  */}
          </p>
          <input
            type="range"
            min="0"
            max="10"
            value={values.stress}
            onChange={(e) =>
              setValues({ ...values, stress: Number(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* --------------------------- */}
      {/* 오늘의 일지 제목 + textarea */}
      {/* --------------------------- */}
      <h3 style={{ marginTop: "30px", marginBottom: "10px" }}>
        오늘의 일지 작성
      </h3>

      <textarea
        rows="12"
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "12px",
          fontSize: "15px",
          lineHeight: "1.5",
          borderRadius: "10px",
          border: "1px solid #cccccc",
          resize: "vertical",
          minHeight: "200px", 
        }}
        placeholder="오늘 하루는 어땠나요? 자유롭게 기록해보세요."
        value={values.text}
        onChange={(e) => setValues({ ...values, text: e.target.value })}
      />

      {/* 버튼 영역 */}
      <div style={{ marginTop: "20px" }}>
        {!isEditing ? (
          <button onClick={handleSave}>일기 저장</button>
        ) : (
          <>
            <button onClick={handleUpdate}>수정하기</button>
            <button onClick={handleDelete}>삭제하기</button>
          </>
        )}

        <button onClick={() => setShowHistory(!showHistory)}>
          기록 보기
        </button>
      </div>

      {/* 기록 리스트 */}
      {showHistory && <DiaryHistory uid={uid} />}
    </div>
  );
};

export default DiaryText;
