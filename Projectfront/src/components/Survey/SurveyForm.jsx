// src/Survey/SurveyForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SurveyForm.module.css";

export default function SurveyForm({ type, questions }) {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const options = {
    PHQ: ["없음", "2~6일", "7~12일", "거의 매일"],
    GAD: ["전혀 없음", "가끔 있음", "자주 있음", "거의 매일"],
    PSS: ["전혀 없음", "거의 없음", "때때로 있음", "자주 있음", "매우 자주 있음"],
  };

  const optionCount = { PHQ: 4, GAD: 4, PSS: 5 };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("accessToken");
    const uid = localStorage.getItem("user_id");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    let url = "";
    if (type === "PHQ") url = "http://localhost:3001/survey/phq9";
    if (type === "GAD") url = "http://localhost:3001/survey/gad7";
    if (type === "PSS") url = "http://localhost:3001/survey/pss10";

    try {
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { totalScore, emotionalScore, physicalScore, level } = response.data;

      navigate("/survey/result", {
        state: {
          type,
          totalScore,
          emotionalScore,
          physicalScore,
        },
      });

    } catch (err) {
      console.error(err);
      alert("서버 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        {type === "PHQ" && "PHQ-9 우울 체크"}
        {type === "GAD" && "GAD-7 불안 체크"}
        {type === "PSS" && "PSS-10 스트레스 체크"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {questions.map((q, index) => (
          <div key={index} className={styles.questionBox}>

            <p className={styles.questionText}>
              {index + 1}. {q}
            </p>

            {[...Array(optionCount[type]).keys()].map((value) => (
              <label key={value} className={styles.label}>
                <input
                  type="radio"
                  value={value}
                  {...register(`q${index}`, { required: true })}
                  className={styles.radio}
                />
                {options[type][value]}
              </label>
            ))}

            {errors[`q${index}`] && (
              <p className={styles.error}>항목을 선택해주세요.</p>
            )}
          </div>
        ))}

        <button type="submit" className={styles.submitBtn}>
          결과 확인하기
        </button>
      </form>
    </div>
  );
}
