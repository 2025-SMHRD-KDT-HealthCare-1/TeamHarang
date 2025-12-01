import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import StartPage from "./pages/StartPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Join from "./pages/Join";
import MyPage from "./pages/MyPage";

/* 그룹 페이지들 */
import ChatBot from "./pages/ChatBot";

/* Diary */
import DiaryHistory from "./pages/DiaryHistory";
import DiaryText from "./pages/DiaryText";

/* Emotion */
import EmotionStats from "./pages/EmotionStats";

/* Survey */
import SurveyGAD from "./pages/SurveyGAD";
import SurveyPHQ from "./pages/SurveyPHQ";
import SurveyPSS from "./pages/SurveyPSS";
import SurveyResult from "./pages/SurveyResult";
import SurveyStart from "./pages/SurveyStart";
import SurveyRecord from "./pages/SurveyRecord";

/* Relax / Stress */
import RelaxationProgram from "./pages/RelaxationProgram";
import StressManage from "./pages/StressManage";

/* Todo */
import TodoList from "./pages/TodoList";

/* Guide */
import ImprovementGuide from "./pages/ImprovementGuide";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 공통 Layout */}
        <Route element={<Layout />}>

          {/* 기본 */}
          <Route index element={<StartPage />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="join" element={<Join />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="chatbot" element={<ChatBot />} />

          {/* Diary Group */}
          <Route path="diary">
            <Route path="history" element={<DiaryHistory />} />
            <Route path="text" element={<DiaryText />} />
          </Route>

          {/* Emotion Group */}
          <Route path="emotion">
            <Route path="stats" element={<EmotionStats />} />
          </Route>

          {/* Survey Group */}
          <Route path="survey">
            <Route path="start" element={<SurveyStart />} />
            <Route path="gad" element={<SurveyGAD />} />
            <Route path="phq" element={<SurveyPHQ />} />
            <Route path="pss" element={<SurveyPSS />} />
            <Route path="result" element={<SurveyResult />} />
            <Route path="record" element={<SurveyRecord />} />
          </Route>

          {/* Stress / Relax */}
          <Route path="relaxation">
            <Route path="program" element={<RelaxationProgram />} />
          </Route>

          <Route path="stress">
            <Route path="manage" element={<StressManage />} />
          </Route>

          {/* Todo Group */}
          <Route path="todo">
            <Route path="list" element={<TodoList />} />
          </Route>

          {/* Improvement */}
          <Route path="improvement">
            <Route path="guide" element={<ImprovementGuide />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
