import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import StartPage from "./pages/StartPage";
import Home from "./pages/Home";
import ChatBot from "./pages/ChatBot";
import DiaryHistory from "./pages/DiaryHistory";
import DiaryText from "./pages/DiaryText";
import EmotionStats from "./pages/EmotionStats";
import Join from "./pages/Join";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import RelaxationProgram from "./pages/RelaxationProgram";
import StressManage from "./pages/StressManage";
import SurveyGAD from "./pages/SurveyGAD";
import SurveyPHQ from "./pages/SurveyPHQ";
import SurveyPSS from "./pages/SurveyPSS";
import SurveyResult from "./pages/SurveyResult";
import SurveyStart from "./pages/SurveyStart";
import TodoList from "./pages/TodoList";
import ImprovementGuide from "./pages/ImprovementGuide";
import SurveyRecord from "./pages/SurveyRecord";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 모든 페이지는 Layout 아래 들어감 */}
        <Route element={<Layout />}>

          {/* 시작 페이지 */}
          <Route index element={<StartPage />} />

          {/* 로그인 후 홈 */}
          <Route path="/home" element={<Home />} />

          {/* 기능 페이지들 */}
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

          <Route path="/todo/list" element={<TodoList />} />
          <Route path="/improvement/guide" element={<ImprovementGuide />} />
          <Route path="/survey/record" element={<SurveyRecord />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
