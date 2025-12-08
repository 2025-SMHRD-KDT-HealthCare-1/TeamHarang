import React from "react";
import styles from "./ServiceBox.module.css";

const ServiceBox = ({ icon, title, desc }) => (
  <div className={styles.box}>
    <img src={icon} className={styles.icon} />
    <h3 className={styles.title}>{title}</h3>
    <p className={styles.desc}>{desc}</p>
  </div>
);

export default ServiceBox;
