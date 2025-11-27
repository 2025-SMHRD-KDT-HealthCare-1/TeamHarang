// 개요 :  DB 연결을 위한 정보 

const mysql = require("mysql2");

// MySQL 연결 설정
const conn = mysql.createConnection({
    host : "",
    user : "",
    password : "",
    port : "",
    database : ""
});

// 연결 확인 
conn.connect((err) => {
    if (err) {
        console.error("MySQL FAIL! CODE:", err);
        return;
    }
    console.log("SQL CONNECT");
});
module.exports = conn; //출력