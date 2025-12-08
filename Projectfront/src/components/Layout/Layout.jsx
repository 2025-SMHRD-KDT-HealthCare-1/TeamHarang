import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();

  // 헤더 숨길 페이지들
  const hideHeaderPages = ["/login", "/join", "/"];
  const hideHeader = hideHeaderPages.includes(location.pathname);

  //  StartPage 여부 확인
  const isStartPage = location.pathname === "/";

  // 로그인 유저 정보
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.user_name || "";

  //  StartPage에서는 body / root / main 모두 full-screen 클래스 적용
  useEffect(() => {
    const rootEl = document.getElementById("root");

    if (isStartPage) {
      document.body.classList.add("full-screen");
      rootEl?.classList.add("full-screen");
    } else {
      document.body.classList.remove("full-screen");
      rootEl?.classList.remove("full-screen");
    }
  }, [isStartPage]);

  return (
    <>
      {!hideHeader && <Header username={username} />}

      {/* 내부 페이지 영역 */}
      <main
        id="page-root"
        className={isStartPage ? "full-screen" : "default-screen"}
        style={{ paddingTop: hideHeader ? "0" : "60px" }}
      >
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
