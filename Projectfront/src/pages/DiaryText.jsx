import React, { useState, useEffect } from "react";
import axios from "axios";
import DiaryHistory from "./DiaryHistory";
import styles from "./DiaryText.module.css";

const DiaryText = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [values, setValues] = useState({
    depression: 0,
    anxiety: 0,
    stress: 0,
    text: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const uid = localStorage.getItem("user_id");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/diary/${uid}/${selectedDate}`)
      .then((res) => {
        if (res.data) {
          setValues({
            depression: res.data.depression,
            anxiety: res.data.anxiety,
            stress: res.data.stress,
            text: res.data.text,
          });
          setIsEditing(true);
        } else {
          setValues({ depression: 0, anxiety: 0, stress: 0, text: "" });
          setIsEditing(false);
        }
      });
  }, [selectedDate, uid]);

  const handleSave = () => {
    axios
      .post("http://localhost:3001/diary", {
        uid,
        date: selectedDate,
        ...values,
      })
      .then(() => {
        alert("일기 저장 완료!");
        setIsEditing(true);
      });
  };

  const handleUpdate = () => {
    axios
      .put("http://localhost:3001/diary", {
        uid,
        date: selectedDate,
        ...values,
      })
      .then(() => alert("수정 완료!"));
  };

  const handleDelete = () => {
    if (!window.confirm("정말 삭제할까요?")) return;

    axios
      .delete(`http://localhost:3001/diary/${uid}/${selectedDate}`)
      .then(() => {
        alert("삭제 완료!");
        setValues({ depression: 0, anxiety: 0, stress: 0, text: "" });
        setIsEditing(false);
      });
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

      {/* 슬라이더 3개 */}
      <div className={styles.sliderRow}>
        <div className={styles.sliderBox}>
          <p className={styles.sliderLabel}>
            우울 <strong>{values.depression}/10</strong>
          </p>
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
          <p className={styles.sliderLabel}>
            불안 <strong>{values.anxiety}/10</strong>
          </p>
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
          <p className={styles.sliderLabel}>
            스트레스 <strong>{values.stress}/10</strong>
          </p>
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

      <h3 style={{ marginTop: "30px", marginBottom: "10px" }}>
        오늘의 일지 작성
      </h3>

      <textarea
        className={styles.textarea}
        rows="12"
        placeholder="오늘 하루는 어땠나요?"
        value={values.text}
        onChange={(e) => setValues({ ...values, text: e.target.value })}
      />

      <div className={styles.btnRow}>
        {!isEditing ? (
          <button className={styles.button} onClick={handleSave}>
            일기 저장
          </button>
        ) : (
          <>
            <button className={styles.button} onClick={handleUpdate}>
              수정하기
            </button>
            <button
              className={`${styles.button} ${styles.deleteBtn}`}
              onClick={handleDelete}
            >
              삭제하기
            </button>
          </>
        )}

        <button
          className={`${styles.button} ${styles.historyBtn}`}
          onClick={() => setShowHistory(!showHistory)}
        >
          기록 보기
        </button>
      </div>

      {showHistory && <DiaryHistory uid={uid} />}
    </div>
  );
};

export default DiaryText;
