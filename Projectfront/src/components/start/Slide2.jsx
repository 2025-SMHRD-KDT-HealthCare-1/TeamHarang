import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import ServiceBox from "./ServiceBox";
import styles from "./Slide2.module.css";

const Slide2 = () => {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <h1 className={styles.title}>MindCare 주요 서비스</h1>
        <p className={styles.subtitle}>
          과학적인 치료와 관리 시스템을 제공합니다
        </p>

        <div className={styles.serviceRow}>
          <ServiceBox icon="/images/slide2/survey.svg" title="검사하러 가기" desc="정신건강 수준 평가" />
          <ServiceBox icon="/icon2.png" title="" desc="" />
          <ServiceBox icon="/images/slide2/diary.svg" title="감정 일지" desc="감정 흐름 분석" />
          <ServiceBox icon="/icon4.png" title="TODO 리스트" desc="오늘 할 일 정리하고 실천해보기" />
        </div>
      </div>

      <div style={indicatorWrapper}>
        <div style={inactiveDot}></div>
        <div style={activeDot}></div>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
      </div>
    </div>
  );
};

export default Slide2;
