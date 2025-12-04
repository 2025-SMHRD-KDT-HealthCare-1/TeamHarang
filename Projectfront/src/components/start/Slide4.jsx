import React from "react";
import TodoCard from "./TodoCard";
import styles from "./Slide4.module.css";

const Slide4 = () => {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.iconCircle}>
          <img src="/images/slide4/todo.svg" className={styles.icon} />
        </div>

        <h1 className={styles.title}>TODO 리스트</h1>
        <p className={styles.subtitle}>
          하루의 작은 성취가 큰 변화를 만듭니다
        </p>

        <div className={styles.cardRow}>
          <TodoCard 
            icon="/images/slide4/goal.png" 
            title="목표 설정" 
            desc="하루 목표 세우기" 
          />
          <TodoCard 
            icon="/images/slide4/check.svg" 
            title="진행 체크" 
            desc="완료 기록하기" 
          />
          <TodoCard 
            icon="/images/slide4/schedule.svg" 
            title="습관 만들기" 
            desc="꾸준한 실천" 
          />
        </div>
      </div>
      
    </div>
  );
};

export default Slide4;
