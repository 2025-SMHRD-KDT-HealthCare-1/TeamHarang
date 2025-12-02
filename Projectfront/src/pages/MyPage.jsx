import React, { useState } from "react";
import "../styles/MyPage.css";
import axios from "axios";

const MyPage = () => {
  const [showModal, setShowModal] = useState(false);

  // ------------------------------
  //   탈퇴 요청 (백엔드로 요청만 보냄)
  // ------------------------------
  const handleDelete = async () => {
    try {
      // TODO: 백엔드 API 완성되면 경로 맞춰야 함
    const account_id = localStorage.getItem("account_id");
    const user_pw = prompt("비밀번호를 입력하세요");

      const res = await axios.delete("http://localhost:3001/user/withdraw", {
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
    <div className="mypage-wrapper">
      <div className="mypage-container">

        <h1 className="mypage-title">마이페이지</h1>
        <p className="mypage-subtitle">
          계정 정보와 개인정보를 안전하게 관리하세요
        </p>

        {/* 회원 탈퇴 카드 */}
        <div className="mypage-card">
          <div className="card-info">
            <h3>회원 탈퇴</h3>
            <p>탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
          </div>

          <button 
            className="blue-btn"
            onClick={() => setShowModal(true)}
          >
            회원 탈퇴하기
          </button>
        </div>

        {/* ------------------ 탈퇴 확인 모달 ------------------ */}
        {showModal && (
          <div className="mypage-modal-overlay">
            <div className="mypage-modal-box">

              <h3>정말 탈퇴하시겠습니까?</h3>
              <p style={{ marginTop: "6px", opacity: 0.8 }}>
                탈퇴 후에는 모든 데이터가 삭제되며 되돌릴 수 없습니다.
              </p>

              <div className="mypage-modal-buttons">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowModal(false)}
                >
                  취소
                </button>

                <button 
                  className="delete-btn" 
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
