const express = require("express");
const cors = require("cors");

const userRouter = require("./router/Users");
const homeRouter = require("./router/Home");
// const APIRouter = require("./router/API");
const SurveyRouter = require("./router/Survey");
const TodoRouter = require("./router/Todo");

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/home", homeRouter);// 홈화면 
app.use("/user", userRouter);// 회원관련 
// app.use("/api", APIRouter); //API 관련 
app.use("/survey", SurveyRouter);// 설문관련
app.use("/todo", TodoRouter); // todo관련

app.get("/", (req, res) => {
  res.send("SERVER IS WORKING !");
});

app.listen(3001, () => console.log("서버 실행: http://localhost:3001"));