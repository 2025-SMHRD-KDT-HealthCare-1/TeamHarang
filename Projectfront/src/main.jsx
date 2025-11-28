// src/main.jsx 역할 -> 리액트 앱을 브라우저 화면(root)에 연결하고 App 컴포넌트를 실행시키는 시작 파일이다.
import { createRoot } from "react-dom/client";

import React from "react";
// JSX를 사용하려면 React 필요
// JSX -> JavaScript로 변환할 때 React가 필요하기 때문에 import

import "./index.css";
// 프로젝트 전체에 적용되는 기본 CSS

import App from "./App";
// 우리가 만든 전체 앱의 루트 컴포넌트
// 리액트 모든 화면이 APP 아래에 존재

createRoot(document.getElementById("root")).render(
  // document.getElementById("root") -> public/index.html 파일 안에 있는 <div id="root"></div>를 가져옴
  // react가 이 div 안에 랜더링
  // createRoot(...).render(...) -> 여기(root)에 리액트 앱(APP)를 랜더링하라
  <React.StrictMode>
  {/* 개발 모드에서만 동작
    - 실수나 이상한 코드가 있는지 두 번 렌더링 해서 감지함
    - 버그 찾기용 안전 장치
    - 실제 배포(build)는 영향 없음 */}

    <App />
    {/* 
      - 앱의 시작점
      - 라우팅, 화면 전환, 모든 페이지는 App 아래에서 작동 */}
  </React.StrictMode>
);
