import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ username }) => {
  const navigate = useNavigate();

  return (
    <div style={headerWrap}>
      {/* 왼쪽 로고 */}
      <div style={logo} onClick={() => navigate("/home")}>
        MindCare
      </div>

      {/* 오른쪽 메뉴 */}
      <div style={menuRight}>

        {/* 사용자 이름 (마이페이지 이동) */}
        <span
          style={userBadge}
          onClick={() => navigate("/mypage")}
        >
          {username}
        </span>

        {/* 로그아웃 */}
        <button style={logoutBtn} onClick={() => navigate("/")}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

/* ---------------- 스타일 ---------------- */

const headerWrap = {
  width: "100%",
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 10px",
  borderBottom: "1px solid #e5e5e5",
  background: "white",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 100,
};

const logo = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#4b5bff",
  cursor: "pointer",
};

const menuRight = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginRight: "100px",
};

/*  라운드 태그형 */
const userBadge = {
  padding: "6px 14px",
  background: "#eef1ff",
  color: "#4b5bff",
  fontWeight: 600,
  fontSize: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "0.2s",
};

/* hover 효과 추가 */
userBadge[":hover"] = {
  background: "#dfe3ff",
};

const logoutBtn = {
  padding: "8px 18px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

export default Header;
