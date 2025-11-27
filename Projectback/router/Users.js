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

// 로그인 요청
router.post("/login", (req, res) => {
    const { id, pw } = req.body;
    if (!id || !pw) {
        return res.status(400).json({ result: "fail", message: "ID와 PW를 입력하세요" });
    }
    const sql = `SELECT * FROM members WHERE id = ?`;
    conn.query(sql, [id], async (err, rows) => {
        if (err) return res.status(500).json({ message: "DB ERROR" });

        if (rows.length === 0) {// 만약 아이디에 해당하는 계정이 없다면 
            return res.status(200).json({ result: "fail", message: "ID Fail" });
        }
        const match = await bcrypt.compare(pw, rows[0].pw);// 해시되 암호 비교
        if (!match) {
            return res.status(200).json({ result: "fail", message: "PW Fail" });
        }
        // 토큰 발급 필요 수정 필요



        const userNick = rows[0].nick;
        res.json({
            result: "success",
            user: {
                nick: userNick
            }
        });
    });
});

// 회원가입 요청
router.post("/join", async (req, res) => {
    const { id, pw, nick, mail, birth, gen } = req.body;

    if (!id || !pw || !nick || !mail || !birth || !gen) {
        return res.status(400).json({ result: "fail", message: "모든 필드를 입력하세요" });
    }

    // 아이디 중복 확인
    const checkSql = `SELECT id FROM members WHERE id = ?`;
    conn.query(checkSql, [id], (err, rows) => {
        if (err) return res.status(500).json({ result: "fail", message: "DB ERROR" });

        if (rows.length > 0) {
            return res.status(200).json({ result: "fail", message: "이미 존재하는 ID입니다" });
        }

        // 이메일 중복 확인
        const checkMailSql = `SELECT mail FROM members WHERE mail = ?`;
        conn.query(checkMailSql, [mail], async (err, mailRows) => {
            if (err) return res.status(500).json({ result: "fail", message: "DB ERROR" });

            if (mailRows.length > 0) {
                return res.status(200).json({ result: "fail", message: "이미 등록된 이메일입니다" });
            }

            // 비밀번호 해싱
            const hashedPW = await bcrypt.hash(pw, 10);

            const sql = `INSERT INTO members (id, pw, nick, mail, birth, gender,roles) VALUES (?, ?, ?, ?, ?, ? , ?)`;
            conn.query(sql, [id, hashedPW, nick, mail, birth, gen,"USER"], (err, result) => {
                if (err) return res.status(500).json({ result: "fail", message: "회원가입 실패" });

                return res.status(201).json({ result: "success", message: "회원가입 성공" });
            });
        });
    });
});


//비회원(준회원) 진행 요청
router.post("/semijoin",(req, res) => {
    const {nick} = req.body;

    if (!nick) {
        return res.status(400).send("이름을 입력하세요");
    }

        const sql = `INSERT INTO members (nick,roles) VALUES (?,?)`;
        conn.query(sql, [nick,"GUEST"], (err, result) => {
            if (err) return res.status(500).send("준회원 기능 실패");

            return res.status(201).send("준회원 기능 성공");
        });
    });

// 준회원 → 정회원 전환 요청
router.patch("/upgrade", async (req, res) => {
    const { uid, id, pw, mail, birth, gender } = req.body;

    if (!uid || !id || !pw || !mail || !birth || !gender) {
        return res.status(400).json({
            result: "fail",
            message: "필수 정보를 모두 입력하세요 (uid, id, pw, mail, birth, gender)"
        });
    }

    try {
        // ID & 이메일 중복 확인
        const checkSql = `
            SELECT id, mail FROM members 
            WHERE id = ? OR mail = ?
        `;
        const [exists] = await conn.promise().query(checkSql, [id, mail]);

        if (exists.length > 0) {
            if (exists[0].id === id) {
                return res.status(409).json({ result: "fail", message: "이미 존재하는 ID입니다" });
            }
            if (exists[0].mail === mail) {
                return res.status(409).json({ result: "fail", message: "이미 등록된 이메일입니다" });
            }
        }

        // 비밀번호 암호화
        const hashedPW = await bcrypt.hash(pw, 10);

        const updateSql = `
            UPDATE members
            SET id = ?, pw = ?, mail = ?, birth = ?, gender = ?, roles = "USER"
            WHERE uid = ?
        `;

        const [result] = await conn.promise().query(updateSql, [
            id, hashedPW, mail, birth, gender, uid
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ result: "fail", message: "존재하지 않는 UID입니다" });
        }

        return res.status(200).json({ result: "success", message: "정회원 전환 완료" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ result: "fail", message: "서버 오류 발생" });
    }
});

// 회원 탈퇴 요청
router.delete("/withdraw", async (req, res) => {
    const { id, pw } = req.body;

    if (!id || !pw) {
        return res.status(400).json({ result: "fail", message: "ID와 PW를 입력하세요" });
    }

    try {
        // DB에서 회원 조회
        const sql = `SELECT * FROM members WHERE id = ?`;
        const [rows] = await conn.promise().query(sql, [id]);

        if (rows.length === 0) {
            return res.status(200).json({ result: "fail", message: "ID Fail" });
        }

        const match = await bcrypt.compare(pw, rows[0].pw);
        if (!match) {
            return res.status(200).json({ result: "fail", message: "PW Fail" });
        }

        // 회원 삭제
        const deleteSql = `DELETE FROM members WHERE id = ?`;
        await conn.promise().query(deleteSql, [id]);

        return res.status(200).json({ result: "success", message: "회원 탈퇴 완료" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ result: "fail", message: "서버 오류 발생" });
    }
});

module.exports = router;
