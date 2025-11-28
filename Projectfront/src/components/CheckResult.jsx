// src/components/CheckResult.jsx
import React from "react";
import "../styles/CheckResult.css";

const CheckResult = () => {
  // 지금은 UI만 — 백엔드 연동되면 실제 데이터 들어갈 자리

  return (
    <div className="check-result-box">
      <h3 className="check-title">최근 체크 결과</h3>

      {/* 결과가 없을 때 */}
      <div className="check-empty">체크 결과가 없습니다</div>

      {/*
        나중에 데이터가 있을 경우 이런 형태
        <div className="check-item">
          <span className="check-type">PHQ-9 우울</span>
          <span className="check-score">12점 (중간 수준)</span>
          <span className="check-date">2025-11-27</span>
        </div>
      */}
    </div>
  );
};

export default CheckResult;
