import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/PrivateRoute";

/* Public Pages */
import StartPage from "./pages/StartPage";

/* Survey */
import SurveyGAD from "./pages/SurveyGAD";
import SurveyPHQ from "./pages/SurveyPHQ";
import SurveyPSS from "./pages/SurveyPSS";
import SurveyResult from "./pages/SurveyResult";
import SurveyStart from "./pages/SurveyStart";

/* Private Pages */
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import ChatBot from "./pages/ChatBot";

/* Diary */
import DiaryHistory from "./pages/DiaryHistory";
import DiaryText from "./pages/DiaryText";

/* Survey Record */
import SurveyRecord from "./pages/SurveyRecord";

/* Todo */
import TodoList from "./pages/TodoList";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 공개 페이지 */}
        <Route element={<Layout />}>
          <Route index element={<StartPage />} />

          <Route path="survey">
            <Route path="start" element={<SurveyStart />} />
            <Route path="gad" element={<SurveyGAD />} />
            <Route path="phq" element={<SurveyPHQ />} />
            <Route path="pss" element={<SurveyPSS />} />
            <Route path="result" element={<SurveyResult />} />
          </Route>
        </Route>

        {/* 보호 페이지 */}
        <Route
          element={
            <PrivateRoute>
              <Outlet />   {/* 🔥 문제 해결 핵심: Layout 대신 Outlet */}
            </PrivateRoute>
          }
        >
          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="chatbot" element={<ChatBot />} />

            <Route path="diary">
              <Route path="history" element={<DiaryHistory />} />
              <Route path="text" element={<DiaryText />} />
            </Route>

            <Route path="survey">
              <Route path="record" element={<SurveyRecord />} />
            </Route>

            <Route path="todo">
              <Route path="list" element={<TodoList />} />
            </Route>
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
