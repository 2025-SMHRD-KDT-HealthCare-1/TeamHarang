import React from "react";
import "../styles/MyPage.css";

const MyPage = () => {
  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">

        <h1 className="mypage-title">마이페이지</h1>
        <p className="mypage-subtitle">계정 정보와 개인정보를 안전하게 관리하세요</p>

        {/* 회원 탈퇴 카드 */}
        <div className="mypage-card">
          <div className="card-info">
            <h3>회원 탈퇴</h3>
            <p>탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
          </div>

          <button className="blue-btn">회원 탈퇴하기</button>
        </div>

      </div>
    </div>
  );
};

export default MyPage;
