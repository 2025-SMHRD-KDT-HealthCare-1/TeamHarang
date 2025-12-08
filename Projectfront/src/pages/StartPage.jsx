import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Slide1 from "../components/start/Slide1";
import Slide2 from "../components/start/Slide2";
import Slide3 from "../components/start/Slide3";
import Slide4 from "../components/start/Slide4";
import Slide5 from "../components/start/Slide5";

import LoginModal from "../components/modal/LoginModal";
import JoinModal from "../components/modal/JoinModal";

import styles from "./StartPage.module.css";

const StartPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();   // 추가됨

  // alert 중복 방지
  const alertShown = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("needLogin") === "true" && !alertShown.current) {
      alertShown.current = true;
      alert("로그인이 필요합니다.");
    }
  }, [location.search]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        
        <Slide1
          onLogin={() => setShowLogin(true)}
          onJoin={() => setShowJoin(true)}
          onGuest={() => navigate("/survey/start")}   //  비회원 → 설문 선택
        />

        <Slide2 />
        <Slide3 />
        <Slide4 />
        <Slide5 />

        {/* 로그인 모달 */}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onOpenJoin={() => {
              setShowLogin(false);
              setShowJoin(true);
            }}
          />
        )}

        {/* 회원가입 모달 */}
        {showJoin && (
          <JoinModal
            onClose={() => setShowJoin(false)}
            onOpenLogin={() => {
              setShowJoin(false);
              setShowLogin(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StartPage;
