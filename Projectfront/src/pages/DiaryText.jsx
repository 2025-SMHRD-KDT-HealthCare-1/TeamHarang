import React, { useState } from "react";
import axios from "axios";
import styles from "./DiaryText.module.css";

const Diarycontent = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [values, setValues] = useState({
    depression: 0,
    anxiety: 0,
    stress: 0,
    content: "",
  });

  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("accessToken"); 

  // 저장
  const handleSave = () => {
    axios
      .post(
        "http://localhost:3001/diary/AddDiary",
        {
          user_id,
          date: selectedDate,
          content: values.content,
          stress: values.stress,
          anxiety: values.anxiety,
          depression: values.depression,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => alert("일기 저장 완료!"))
      .catch((err) => console.log("저장 오류:", err));
  };

  // 수정
  const handleUpdate = () => {
    axios
      .put(
        "http://localhost:3001/diary/Diary",
        {
          user_id,
          date: selectedDate,
          content: values.content,
          stress: values.stress,
          anxiety: values.anxiety,
          depression: values.depression,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => alert("수정 완료!"))
      .catch((err) => console.log("수정 오류:", err));
  };

  // 삭제
  const handleDelete = () => {
  if (!window.confirm("정말 삭제할까요?")) return;

  axios.post(
    "http://localhost:3001/diary/DeleteDiary",
    {
      user_id,
      date: selectedDate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,  // 🔥 토큰 필수
      },
    }
  )
  .then(() => {
    alert("삭제 완료!");
    setValues({ depression: 0, anxiety: 0, stress: 0, content: "" });
  })
  .catch((err) => console.log("삭제 오류:", err));
};

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>감정 일기</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className={styles.dateInput}
      />

      <div className={styles.sliderRow}>
        <div className={styles.sliderBox}>
          <p>우울 {values.depression}/10</p>
          <input
            type="range"
            min="0"
            max="10"
            value={values.depression}
            onChange={(e) =>
              setValues({ ...values, depression: Number(e.target.value) })
            }
          />
        </div>

        <div className={styles.sliderBox}>
          <p>불안 {values.anxiety}/10</p>
          <input
            type="range"
            min="0"
            max="10"
            value={values.anxiety}
            onChange={(e) =>
              setValues({ ...values, anxiety: Number(e.target.value) })
            }
          />
        </div>

        <div className={styles.sliderBox}>
          <p>스트레스 {values.stress}/10</p>
          <input
            type="range"
            min="0"
            max="10"
            value={values.stress}
            onChange={(e) =>
              setValues({ ...values, stress: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <textarea
        className={styles.textarea}
        rows="12"
        placeholder="오늘 하루는 어땠나요?"
        value={values.content}
        onChange={(e) => setValues({ ...values, content: e.target.value })}
      />

      <div className={styles.btnRow}>
        <button className={styles.button} onClick={handleSave}>
          저장
        </button>
        <button className={styles.button} onClick={handleUpdate}>
          수정
        </button>
        <button
          className={`${styles.button} ${styles.deleteBtn}`}
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default Diarycontent;
