import React, { useState } from "react";

import Slide1 from "../components/start/Slide1";
import Slide2 from "../components/start/Slide2";
import Slide3 from "../components/start/Slide3";
import Slide4 from "../components/start/Slide4";

import LoginModal from "../components/modal/LoginModal";
import JoinModal from "../components/modal/JoinModal";

const StartPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <>
      <Slide1
        onLogin={() => setShowLogin(true)}
        onJoin={() => setShowJoin(true)}
      />

      <Slide2 />
      <Slide3 />
      <Slide4 />

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
    </>
  );
};

export default StartPage;
