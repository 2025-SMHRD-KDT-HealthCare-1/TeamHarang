// src/main.jsx
import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import StartPage from "./pages/StartPage.jsx";
import Home from "./pages/Home.jsx";
import ChatBot from "./pages/ChatBot.jsx";
import DiaryHistory from "./pages/DiaryHistory.jsx";
import DiaryText from "./pages/DiaryText.jsx";
import EmotionStats from "./pages/EmotionStats.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import MyPage from "./pages/MyPage.jsx";
import RelaxationProgram from "./pages/RelaxationProgram.jsx";
import StressManage from "./pages/StressManage.jsx";
import SurveyGAD from "./pages/SurveyGAD.jsx";
import SurveyPHQ from "./pages/SurveyPHQ.jsx";
import SurveyPSS from "./pages/SurveyPSS.jsx";
import SurveyResult from "./pages/SurveyResult.jsx";
import SurveyStart from "./pages/SurveyStart.jsx";
import SymptomCategory from "./pages/SymptomCategory.jsx";
import TodoList from "./pages/TodoList.jsx";
import ImprovementGuide from "./pages/ImprovementGuide.jsx";
import SurveyRecord from "./pages/SurveyRecord.jsx";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>

        {/* 시작 페이지 */}
        <Route index element={<StartPage />} />

        {/* 로그인 후 홈 */}
        <Route path="/home" element={<Home />} />

        {/* 기능 페이지 */}
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/diary/history" element={<DiaryHistory />} />
        <Route path="/diary/text" element={<DiaryText />} />
        <Route path="/emotion/stats" element={<EmotionStats />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/relaxation/program" element={<RelaxationProgram />} />
        <Route path="/stress/manage" element={<StressManage />} />
        <Route path="/survey/gad" element={<SurveyGAD />} />
        <Route path="/survey/phq" element={<SurveyPHQ />} />
        <Route path="/survey/pss" element={<SurveyPSS />} />
        <Route path="/survey/result" element={<SurveyResult />} />
        <Route path="/survey/start" element={<SurveyStart />} />
        <Route path="/symptom/category" element={<SymptomCategory />} />
        <Route path="/todo/list" element={<TodoList />} />
        <Route path="/improvement/guide" element={<ImprovementGuide />} />
        <Route path="/survey/record" element={<SurveyRecord />} />

       

    </Routes>
  </BrowserRouter>
);
