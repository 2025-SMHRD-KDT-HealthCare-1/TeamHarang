import React from "react";
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
          <ServiceBox 
            icon="/images/slide2/survey.svg" 
            title="검사하러 가기" 
            desc="나의 상태 알아보기" 
          />

          <ServiceBox 
            icon="/images/slide2/htp.svg" 
            title="HTP 검사" 
            desc="그림으로 보는 나의 마음" 
          />

          <ServiceBox 
            icon="/images/slide2/diary.svg" 
            title="감정 일지" 
            desc="감정 흐름 분석" 
          />

          <ServiceBox 
            icon="/images/slide2/todo.svg" 
            title="TODO 리스트" 
            desc="오늘 할 일 정리하고 실천해보기" 
          />
        </div>
      </div>

    </div>
  );
};

export default Slide2;
