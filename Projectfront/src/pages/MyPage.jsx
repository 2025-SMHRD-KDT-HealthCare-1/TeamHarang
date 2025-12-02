import React, { useState } from "react";
import styles from "./MyPage.module.css";
import axios from "axios";

const MyPage = () => {
  const [showModal, setShowModal] = useState(false);

  // 회원탈퇴 처리 (임시)
  const handleDelete = async () => {
    try {
      // TODO: 백엔드 API 완성되면 경로 맞춰야 함
      const account_id = localStorage.getItem("account_id");
      const user_pw = prompt("비밀번호를 입력하세요");

      await axios.delete("http://localhost:3001/user/withdraw", {
        data: { account_id, user_pw }
      });
      alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <p className={styles.subtitle}>
          계정 정보와 개인정보를 안전하게 관리하세요
        </p>

        {/* 탈퇴 카드 */}
        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <h3>회원 탈퇴</h3>
            <p>탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
          </div>

          <button
            className={styles.blueBtn}
            onClick={() => setShowModal(true)}
          >
            회원 탈퇴하기
          </button>
        </div>

        {/* 모달 */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <h3>정말 탈퇴하시겠습니까?</h3>
              <p>탈퇴 후에는 모든 데이터가 삭제되며 되돌릴 수 없습니다.</p>

              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  취소
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={handleDelete}
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyPage;
