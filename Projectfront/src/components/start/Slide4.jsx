import React from "react";
import { indicatorWrapper, activeDot, inactiveDot } from "./indicatorStyle";
import TodoCard from "./TodoCard";
import styles from "./Slide4.module.css";

const Slide4 = () => {
  return (
    <div className={styles.slideWrapper}>
      
      {/* 아이콘 원형 */}
      <div className={styles.iconCircle}>
        <img src="/todo-icon.png" className={styles.icon} />
      </div>

      {/* 제목 */}
      <h1 className={styles.title}>TODO 리스트</h1>

      {/* 설명 */}
      <p className={styles.subtitle}>
        매일의 작은 성취를 기록하고 습관을 만들어가세요
      </p>

      {/* 카드 영역 */}
      <div className={styles.cardRow}>
        <TodoCard
          icon="/todo1.png"
          title="일일 목표 설정"
          desc="아침에 작은 목표들을 설정하세요"
        />
        <TodoCard
          icon="/todo2.png"
          title="진행 상황 추적"
          desc="완료한 활동을 체크하며 성취감을 느끼기"
        />
        <TodoCard
          icon="/todo3.png"
          title="습관 형성"
          desc="꾸준한 실천으로 건강한 습관 만들기"
        />
      </div>

      {/* 인디케이터 */}
      <div style={indicatorWrapper}>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
        <div style={inactiveDot}></div>
        <div style={activeDot}></div>
      </div>
    </div>
  );
};

export default Slide4;
