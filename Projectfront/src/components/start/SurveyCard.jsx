import React from "react";
import styles from "./SurveyCard.module.css";

const SurveyCard = ({ num, color, title, items }) => (
  <div className={styles.card}>
    
    {/* 숫자 박스 — color만 inline 유지 */}
    <div
      className={styles.numBox}
      style={{ background: color }}
    >
      {num}
    </div>

    {/* 제목 — 글자색만 inline */}
    <h3 className={styles.title} style={{ color }}>
      {title}
    </h3>

    <ul className={styles.list}>
      {items.map((it, idx) => (
        <li key={idx} className={styles.listItem}>
          {it}
        </li>
      ))}
    </ul>
  </div>
);

export default SurveyCard;
