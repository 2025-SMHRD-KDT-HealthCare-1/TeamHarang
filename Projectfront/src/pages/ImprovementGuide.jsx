// src/components/ImprovementGuide.jsx
import React from "react";
import styles from "./ImprovementGuide.module.css";

const ImprovementGuide = ({ guides = [] }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.header}>맞춤 개선 가이드</h3>

      {guides.length === 0 ? (
        <p className={styles.empty}>추천 가이드를 불러오는 중입니다...</p>
      ) : (
        <div className={styles.grid}>
          {guides.map((g) => (
            <div key={g.id} className={styles.card}>
              <div
                className={styles.iconCircle}
                style={{ background: g.color || "#ddd" }}
              >
                {g.icon || "⭐"}
              </div>

              <h4 className={styles.title}>{g.title}</h4>
              <p className={styles.desc}>{g.desc}</p>

              <button className={styles.cardBtn}>실행하기</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImprovementGuide;
