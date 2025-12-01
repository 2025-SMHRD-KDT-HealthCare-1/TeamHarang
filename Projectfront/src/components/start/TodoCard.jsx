import React from "react";
import styles from "./TodoCard.module.css";

const TodoCard = ({ icon, title, desc }) => (
  <div className={styles.card}>
    <img src={icon} className={styles.icon} />
    <h3 className={styles.title}>{title}</h3>
    <p className={styles.desc}>{desc}</p>
  </div>
);

export default TodoCard;
