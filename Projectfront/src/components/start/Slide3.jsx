import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import SurveyCard from "./SurveyCard";
import styles from "./Slide3.module.css";

const Slide3 = () => {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <img src="/images/slide3/stress.svg" className={styles.icon} />

        <h1 className={styles.title}>설문 검사</h1>
        <p className={styles.subtitle}>정신 건강 상태를 객관적으로 평가하세요</p>

        <div className={styles.cardRow}>
          <SurveyCard
            num="1"
            color="#2f7bff"
            title="스트레스 측정"
            items={["총 20문항", "5분 소요", "즉시 결과"]}
          />
          <SurveyCard
            num="2"
            color="#8a39ff"
            title="우울감 평가"
            items={["표준화 검사", "전문가 기반 해석"]}
          />
          <SurveyCard
            num="3"
            color="#ff3b82"
            title="불안 수준 확인"
            items={["대처 전략 추천", "정기적 추적"]}
          />
        </div>
      </div>

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
