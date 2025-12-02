import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import ServiceBox from "./ServiceBox";
import styles from "./Slide2.module.css";

const Slide2 = () => {
  return (
    <div className={styles.slideWrapper}>

      {/* 오버레이 */}
      <div className={styles.overlay}></div>

      {/* 콘텐츠 */}
      <div className={styles.content}>
        <h1 className={styles.title}>MindCare 주요 서비스</h1>

        <p className={styles.subtitle}>
          과학적인 치료와 관리 시스템을 당신에게 제공합니다
        </p>

        <div className={styles.serviceRow}>
          <ServiceBox
            icon="/icon1.png"
            title="검사 하러 가기"
            desc="스트레스 수준을 측정하고 과학적으로 관리합니다."
          />
          <ServiceBox
            icon="/icon2.png"
            title="심리테라피 추천"
            desc="증상 분석 후 적합한 치료를 추천합니다."
          />
          <ServiceBox
            icon="/icon3.png"
            title="일지 작성"
            desc="감정/신체 데이터 패턴 분석 제공합니다."
          />
          <ServiceBox
            icon="/icon4.png"
            title="커뮤니티"
            desc="비슷한 고민을 가진 사람들과 안전한 소통 공간."
          />
        </div>
      </div>

      {/* 인디케이터 */}
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
