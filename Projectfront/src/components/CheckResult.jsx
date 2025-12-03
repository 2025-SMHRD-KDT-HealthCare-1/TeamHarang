import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CheckResult.module.css";

const CheckResult = () => {
  const [results, setResults] = useState([]);

  const token = localStorage.getItem("accessToken");
  const user_id = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3001/survey/recent",
          { user_id: user_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.results) {
          setResults(res.data.results);
        }
      } catch (err) {
        console.error("최근 체크 결과 불러오기 실패", err);
      }
    };

    fetchRecent();
  }, []);

  return (
    <div className={styles["check-result-box"]}>
      <h3 className={styles["check-title"]}>최근 체크 결과</h3>

      {results.length === 0 ? (
        <div className={styles["check-empty"]}>체크 결과가 없습니다</div>
      ) : (
        results.map((item, idx) => (
          <div className={styles["check-item"]} key={idx}>
            <span className={styles["check-type"]}>{item.survey_type}</span>
            <span className={styles["check-score"]}>{item.total_score}점</span>
            <span className={styles["check-date"]}>{item.survey_date}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default CheckResult;
