// src/components/ImprovementGuide.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import styles from "./ImprovementGuide.module.css";

const ImprovementGuide = () => {
  const [guides, setGuides] = useState([]);
  const { user, accessToken } = useAuthStore();
  const user_id = user?.user_id;

  // -------------------------
  // 개선 가이드 요청
  // -------------------------
  const fetchGuides = async () => {
    if (!user_id || !accessToken) return;

    try {
      const res = await axios.post(
        "http://localhost:3001/guide/recommend",
        { user_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setGuides(res.data.guides || []);
    } catch (err) {
      console.error("개선 가이드 로드 오류:", err);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>맞춤 개선 가이드</h3>

      {/* guides 배열이 있을 때만 UI 렌더 */}
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
    </div>
  );
};

export default ImprovementGuide;
