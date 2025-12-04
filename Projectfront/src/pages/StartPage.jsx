import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

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

  //  alert가 여러 번 뜨는 것을 막기 위한 ref
  const alertShown = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("needLogin") === "true" && !alertShown.current) {
      alertShown.current = true;   // 다음부터 실행 X
      alert("로그인이 필요합니다.");
    }
  }, [location.search]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <Slide1
          onLogin={() => setShowLogin(true)}
          onJoin={() => setShowJoin(true)}
        />

        <Slide2 />
        <Slide3 />
        <Slide4 />
        <Slide5 />

        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onOpenJoin={() => {
              setShowLogin(false);
              setShowJoin(true);
            }}
          />
        )}

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
