import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();

  //  헤더를 숨길 페이지들
  const hideHeaderPages = ["/login", "/join", "/"];

  // 현재 페이지가 숨김 대상인지 판별
  // location.pathname -> 현재 주소
  // includes() -> 배열에 그 페이지가 있는지 검사
  const hideHeader = hideHeaderPages.includes(location.pathname); 

  //  로그인 유저 정보 불러오기
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.user_name || "";   // 사용자 이름

  return (
    <>
      {!hideHeader && <Header username={username} />}

      {/* 페이지 내용 */}
      <main style={{ paddingTop: hideHeader ? "0" : "60px" }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
