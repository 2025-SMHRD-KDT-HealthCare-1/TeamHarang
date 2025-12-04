require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { verifyAccessToken } = require("./router/Token");

const userRouter = require("./router/Users");
const homeRouter = require("./router/Home");
const SurveyRouter = require("./router/Survey");
const TodoRouter = require("./router/Todo");
const DiaryRouter = require("./router/Diary");
const APIRouter = require("./router/API"); // chat 관련

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

app.use("/home", verifyAccessToken, homeRouter);
app.use("/user", userRouter);
app.use("/survey", verifyAccessToken, SurveyRouter);
app.use("/todo", verifyAccessToken, TodoRouter);
app.use("/diary", verifyAccessToken, DiaryRouter);

// 챗관련 토큰 검사
app.use("/chatbot",APIRouter);

app.get("/", (req, res) => {
  res.send("SERVER IS WORKING !");
});

app.listen(3001, () => console.log("서버 실행: http://localhost:3001"));
