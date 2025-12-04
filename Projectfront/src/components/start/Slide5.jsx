import styles from "./Slide5.module.css";

export default function Slide5() {
  return (
    <div className={styles.slideWrapper}>

      {/* 상단 아이콘 */}
      <div className={styles.iconCircle}>
        <img src="/images/slide5/diary.svg" alt="diary" className={styles.icon} />
      </div>

      {/* 제목 */}
      <h1 className={styles.title}>감정 일지</h1>

      {/* 부제목 */}
      <p className={styles.subtitle}>하루의 감정을 기록하며 나를 이해하는 시간</p>

      {/* 카드 3개 */}
      <div className={styles.cardRow}>

        {/* 카드 1 */}
        <div className={styles.card}>
          <img src="/images/slide5/emotion.svg" className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>감정 선택</h3>
          <p className={styles.cardText}>오늘 느낀 감정을 직관적으로 표현</p>
        </div>

        {/* 카드 2 */}
        <div className={styles.card}>
          <img src="/images/slide5/write.svg" className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>자유 기록</h3>
          <p className={styles.cardText}>생각과 느낌을 자유롭게 작성</p>
        </div>

        {/* 카드 3 */}
        <div className={styles.card}>
          <img src="/images/slide5/chart.svg" className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>감정 패턴</h3>
          <p className={styles.cardText}>마음 변화 흐름을 시각적으로 확인</p>
        </div>

      </div>
    </div>
  );
}
