import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./Header.module.css";

const Header = ({ username }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();     // 토큰/유저정보 삭제 함수

  return (
    <div className={styles.headerWrap}>
      {/* 로고 */}
      <div className={styles.logo} onClick={() => navigate("/home")}>
        MindCare
      </div>

      {/* 오른쪽 메뉴 */}
      <div className={styles.menuRight}>
        <span
          className={styles.userBadge}
          onClick={() => navigate("/mypage")}
        >
          {username}
        </span>

        <button
          className={styles.logoutBtn}
          onClick={() => {
            logout();         // zustand + localStorage 토큰 삭제됨
            navigate("/");
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Header;
