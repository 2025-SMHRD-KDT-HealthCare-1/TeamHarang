import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import SurveyCard from "./SurveyCard";
import styles from "./Slide3.module.css";

const Slide3 = () => {
  return (
    <div className={styles.slideWrapper}>
      
      {/* 오버레이 */}
      <div className={styles.overlay} />

      {/* 콘텐츠 */}
      <div className={styles.content}>
        <img src="/survey-icon.png" className={styles.icon} />

        <h1 className={styles.title}>설문 검사</h1>

        <p className={styles.subtitle}>
          검증된 설문으로 정신 건강 상태를 평가합니다
        </p>

        <div className={styles.cardRow}>
          <SurveyCard
            num="1"
            color="#2f7bff"
            title="스트레스 측정"
            items={["총 20문항", "5분 소요", "즉시 결과 제공"]}
          />
          <SurveyCard
            num="2"
            color="#8a39ff"
            title="우울감 평가"
            items={["표준화 검사", "익명 보장", "전문가 추천 제공"]}
          />
          <SurveyCard
            num="3"
            color="#ff3b82"
            title="불안 수준 확인"
            items={["다각도 분석", "대처 전략 제공", "정기적 추적"]}
          />
          <SurveyCard
            num="4"
            color="#ff8a00"
            title="종합 리포트"
            items={["차트 분석", "개선 방안 제공", "진행 상황 추적"]}
          />
        </div>
      </div>

      {/* 인디케이터 */}
      <div style={indicatorWrapper}>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
        <div style={activeDot}></div>
        <div style={inactiveDot}></div>
      </div>
    </div>
  );
};

export default Slide3;
