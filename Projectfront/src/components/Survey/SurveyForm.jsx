// ========================
//  SurveyForm.jsx (최종본)
// ========================

import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SurveyForm({ type, questions }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 선택지 텍스트
  const options = {
    PHQ: ["없음", "2~6일", "7~12일", "거의 매일"],
    GAD: ["전혀 없음", "가끔 있음", "자주 있음", "거의 매일"],
    PSS: ["전혀 없음", "거의 없음", "때때로 있음", "자주 있음", "매우 자주 있음"],
  };

  const optionCount = { PHQ: 4, GAD: 4, PSS: 5 };

  // ========================
  //  여기서 user_id 반드시 저장해야 함!!
  // ========================
  const token = localStorage.getItem("accessToken");
  const user_id = Number(localStorage.getItem("user_id")); // ★ 중요 ★

  // 제출
  const onSubmit = async (data) => {

    if (!token || !user_id) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    const body = {
      ...data,
      user_id: user_id, // ★ 서버는 반드시 이 값 필요함
    };

    let url = "";
    if (type === "PHQ") url = "http://localhost:3001/survey/phq9";
    if (type === "GAD") url = "http://localhost:3001/survey/gad7";
    if (type === "PSS") url = "http://localhost:3001/survey/pss10";

    try {
      const response = await axios.post(url, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/survey/result", {
        state: {
          type,
          totalScore: response.data.totalScore,
          emotionalScore: response.data.emotionalScore,
          physicalScore: response.data.physicalScore,
        },
      });
    } catch (err) {
      console.error(err);
      alert("서버 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "10px" }}>
        {type === "PHQ" && "PHQ-9 우울 체크"}
        {type === "GAD" && "GAD-7 불안 체크"}
        {type === "PSS" && "PSS-10 스트레스 체크"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {questions.map((q, index) => (
          <div key={index} style={{
            marginBottom: "24px",
            padding: "12px",
            borderRadius: "10px",
            background: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}>
            <p style={{ marginBottom: "12px", fontWeight: 600 }}>
              {index + 1}. {q}
            </p>

            {[...Array(optionCount[type]).keys()].map((value) => (
              <label key={value} style={{ display: "block", marginBottom: "6px" }}>
                <input
                  type="radio"
                  value={value}
                  {...register(`q${index}`, { required: true })}
                  style={{ marginRight: "8px" }}
                />
                {options[type][value]}
              </label>
            ))}

            {errors[`q${index}`] && (
              <p style={{ color: "red", fontSize: "12px" }}>
                항목을 선택해주세요.
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px 0",
            marginTop: "10px",
            background: "#4e7cff",
            color: "white",
            fontWeight: "600",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          결과 확인하기
        </button>
      </form>
    </div>
  );
}
