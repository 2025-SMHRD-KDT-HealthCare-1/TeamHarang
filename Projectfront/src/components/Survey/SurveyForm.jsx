import React from "react";
import { useForm } from "react-hook-form";      // ★ 입력값/유효성/상태관리 자동화 라이브러리
import { useNavigate } from "react-router-dom"; // ★ 페이지 이동용 훅

export default function SurveyForm({ type, questions }) {
  const navigate = useNavigate();

  /* ---------------------------------------------------------
      🧩 useForm()
      react-hook-form이 제공하는 핵심 기능들:
      - register : input을 폼에 등록해서 값 관리
      - handleSubmit : 제출 시 검증 + 값 수집
      - errors : required 같은 조건 위반 시 담김
  ----------------------------------------------------------*/
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ---------------------------------------------------------
      🧩 라벨(문구) 배열
      숫자 대신 화면에 보여줄 텍스트
      index = value(점수)
      0 → "전혀 그렇지 않다"
      1 → "그렇지 않다"
      ...
  ----------------------------------------------------------*/
  const labels = [
    "전혀 그렇지 않다", // 0
    "그렇지 않다",       // 1
    "보통이다",          // 2
    "그렇다",            // 3
    "매우 그렇다"        // 4 (PSS에서만 사용)
  ];

  /* ---------------------------------------------------------
      🧩 onSubmit()
      - react-hook-form이 모든 질문(q0~q9) 값을 data에 모아줌
      - data 예시:
        { q0: "3", q1: "1", q2: "0", ... }
      - Object.values()로 점수만 꺼냄 → 숫자로 변환
      - navigate로 결과 페이지로 이동하면서 값 전달
  ----------------------------------------------------------*/
  const onSubmit = (data) => {
    const answers = Object.values(data).map((v) => Number(v));

    navigate("/survey/result", {
      state: { type, answers },
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      
      {/* 설문 제목 */}
      <h1 style={{ marginBottom: "10px" }}>
        {type === "PHQ" && "PHQ-9 우울 체크"}
        {type === "GAD" && "GAD-7 불안 체크"}
        {type === "PSS" && "PSS-10 스트레스 체크"}
      </h1>

      {/* -----------------------------------------------------
          폼 시작
          handleSubmit(onSubmit)
          → react-hook-form이 submit 이벤트를 가로채서
            - 필수 체크
            - 값 모으기
            - onSubmit 호출
        ------------------------------------------------------*/}
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* 질문 목록 반복 출력 */}
        {questions.map((q, index) => (
          <div
            key={index}
            style={{
              marginBottom: "24px",
              padding: "12px",
              borderRadius: "10px",
              background: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            {/* 질문 문장 */}
            <p style={{ marginBottom: "12px", fontWeight: 600 }}>
              {index + 1}. {q}
            </p>

            {/* ---------------------------------------------------
               선택지 생성
               - PHQ/GAD: 0~3
               - PSS:     0~4
               value = 실제 점수
               labels[value] = 화면에 표시되는 문구
            ----------------------------------------------------*/}
            {[0, 1, 2, 3, type === "PSS" ? 4 : null]
              .filter((v) => v !== null) // PSS 아닐 때 null 제거
              .map((value) => (
                <label
                  key={value}
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    value={value} // ★ 실제 저장되는 점수
                    {...register(`q${index}`, { required: true })} 
                    //   ↑ q${index} = "q0", "q1" 같은 고유 키
                    //   required: true → 선택 안 하면 errors에 들어감
                    style={{ marginRight: "8px" }}
                  />

                  {/* 점수 대신 라벨 문구 표시 */}
                  {labels[value]}
                </label>
              ))}

            {/* 선택 안 했을 때 빨간 에러 메시지 */}
            {errors[`q${index}`] && (
              <p style={{ color: "red", fontSize: "12px" }}>
                항목을 선택해주세요.
              </p>
            )}
          </div>
        ))}

        {/* 제출 버튼 */}
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
