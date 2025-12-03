import React from "react";
import styles from "./SurveyCard.module.css";

const SurveyCard = ({ num, color, title, items }) => (
  <div className={styles.card}>
    <div className={styles.numBox} style={{ background: color }}>
      {num}
    </div>

    <h3 className={styles.title} style={{ color }}>{title}</h3>

    <ul className={styles.list}>
      {items.map((t, i) => (
        <li key={i} className={styles.listItem}>{t}</li>
      ))}
    </ul>
  </div>
);

export default SurveyCard;
