/* 
    유저 라우터- Users.js
    1. 주요 기능 
    - 로그인 요청
    - 회원가입 요청 
    - 준회원 요청
    - 준회원 회원전환
    - 회원 탈퇴 기능
    2. 작업 필요 내용 
    - 키 발급 및 관리
    - 키 검증
    3. 작업 진행 내용
    - 로그인 요청 
    - 준회원 요청
    4.작업 완료 내용
    - 준회원 ->회원가입 요청
    - 회원가입 요청 
*/

const express = require('express');
const router = express.Router();
const conn = require('../config/database');
const bcrypt = require("bcrypt");
const { generateToken } = require("./Token");

// 로그인 요청
router.post("/login", (req, res) => {
    const { account_id, user_pw } = req.body;

    if (!account_id || !user_pw) {
        return res.status(400).json({ result: "fail", message: "ID와 PW를 입력하세요" });
    }

    const sql = `SELECT * FROM users WHERE account_id = ?`;
    conn.query(sql, [account_id], async (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ result: "fail", message: "DB ERROR" });
        }

        if (rows.length === 0) {
            return res.json({ result: "fail", message: "account_id Fail" });
        }

        const user = rows[0];

        const match = await bcrypt.compare(user_pw, user.user_pw);
        if (!match) return res.json({ result: "fail", message: "PW Fail" });

        
        const token = generateToken(user);

        
        res.json({
            result: "success",
            token: token,
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                roles: user.roles
            }
        });
    });
});

module.exports = router;

// 회원가입 요청
router.post("/join", async (req, res) => {
    const { account_id, user_pw, user_name, user_email, birth, gender } = req.body;

    if (!account_id || !user_pw || !user_name || !user_email || !birth || !gender) {
        return res.status(400).json({ result: "fail", message: "모든 필드를 입력하세요" });
    }

    // ID 중복 확인
    const checkSql = `SELECT account_id FROM users WHERE account_id = ?`;
    conn.query(checkSql, [account_id], (err, rows) => {
        if (err) return res.status(500).json({ result: "fail", message: "DB ERROR" });

        if (rows.length > 0) {
            return res.json({ result: "fail", message: "이미 존재하는 ID입니다" });
        }

        // 이메일 중복 확인
        const checkMailSql = `SELECT user_email FROM users WHERE user_email = ?`;
        conn.query(checkMailSql, [user_email], async (err, mailRows) => {
            if (err) return res.status(500).json({ result: "fail", message: "DB ERROR" });

            if (mailRows.length > 0) {
                return res.json({ result: "fail", message: "이미 등록된 이메일입니다" });
            }

            const hashedPW = await bcrypt.hash(user_pw, 10);

            const sql = `
                INSERT INTO users 
                (account_id, user_pw, user_name, user_email, birth, gender, roles)
                VALUES (?, ?, ?, ?, ?, ?, 'USER')
            `;

            conn.query(sql, [account_id, hashedPW, user_name, user_email, birth, gender], (err) => {
                if (err) {
                    return res.status(500).json({ 
                        result: "fail", 
                        message: "회원가입 실패",
                        error: err
                    });
                }

                return res.json({ result: "success", message: "회원가입 성공" });
            });
        });
    });
});

// 준회원 가입(이름만)
router.post("/semijoin", (req, res) => {
    const { user_name } = req.body;

    if (!user_name)
        return res.status(400).send("이름을 입력하세요");

    const sql = `INSERT INTO users (user_name, roles) VALUES (?, 'GUEST')`;
    conn.query(sql, [user_name], (err) => {
        if (err) return res.status(500).send("준회원 기능 실패");

        return res.status(201).send("준회원 기능 성공");
    });
});

// 준회원 → 정회원 전환
router.patch("/upgrade", async (req, res) => {
    const { uid, account_id, user_pw, user_email, birth, gender } = req.body;

    if (!uid || !account_id || !user_pw || !user_email || !birth || !gender) {
        return res.status(400).json({
            result: "fail",
            message: "필수 정보를 모두 입력하세요"
        });
    }

    try {
        // ID & 이메일 중복 확인
        const checkSql = `
            SELECT account_id, user_email 
            FROM users
            WHERE account_id = ? OR user_email = ?
        `;
        const [exists] = await conn.promise().query(checkSql, [account_id, user_email]);

        if (exists.length > 0) {
            if (exists[0].account_id === account_id) {
                return res.json({ result: "fail", message: "이미 존재하는 ID입니다" });
            }
            if (exists[0].user_email === user_email) {
                return res.json({ result: "fail", message: "이미 등록된 이메일입니다" });
            }
        }

        const hashedPW = await bcrypt.hash(user_pw, 10);

        const updateSql = `
            UPDATE users
            SET account_id = ?, user_pw = ?, user_email = ?, birth = ?, gender = ?, roles = 'USER'
            WHERE user_id = ?
        `;

        const [result] = await conn.promise().query(updateSql, [
            account_id,
            hashedPW,
            user_email,
            birth,
            gender,
            uid
        ]);

        if (result.affectedRows === 0)
            return res.json({ result: "fail", message: "존재하지 않는 UID입니다" });

        return res.json({ result: "success", message: "정회원 전환 완료" });

    } catch (err) {
        return res.status(500).json({ result: "fail", message: "서버 오류 발생" });
    }
});

// 회원 탈퇴
router.delete("/withdraw", async (req, res) => {
    const { account_id, user_pw } = req.body;

    if (!account_id || !user_pw) {
        return res.status(400).json({ result: "fail", message: "ID와 PW를 입력하세요" });
    }

    try {
        const sql = `SELECT * FROM users WHERE account_id = ?`;
        const [rows] = await conn.promise().query(sql, [account_id]);

        if (rows.length === 0)
            return res.json({ result: "fail", message: "account_id Fail" });

        const match = await bcrypt.compare(user_pw, rows[0].user_pw);
        if (!match)
            return res.json({ result: "fail", message: "PW Fail" });

        const deleteSql = `DELETE FROM users WHERE account_id = ?`;
        await conn.promise().query(deleteSql, [account_id]);

        return res.json({ result: "success", message: "회원 탈퇴 완료" });

    } catch (err) {
        return res.status(500).json({ result: "fail", message: "서버 오류 발생" });
    }
});

module.exports = router;
