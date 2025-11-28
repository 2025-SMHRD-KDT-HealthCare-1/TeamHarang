// 개요 :  DB 연결을 위한 정보 
const express = require('express')
const mysql = require("mysql2");

// MySQL 연결 설정
const conn = mysql.createConnection({
    host : "project-db-campus.smhrd.com",
    user : "campus_25KDT_HC1_p2_3",
    password : "smhrd3",
    port : "3307",
    database : "campus_25KDT_HC1_p2_3"
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