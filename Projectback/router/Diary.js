const express = require("express")
const router = express.Router()
const conn = require("../config/database")

let dairy = [
    { did : 1, content : "크리스마스"}
]

// 일기에 내용 추가하기
router.post('/AddDiary', (req,res) => {
    const { uid, date, content, strees, anxiety, depression } = req.body
    if(!uid || !date || !content){
        return res.status(400).json({message : "uid, date, content 필수 입력"})
    }

    const sql = `
        insert into diary (user_id, date, content, strees, anxiety, depression)
        values(?, ?, ?, ?, ?, ?)
    `

    conn.query(sql, [uid, date,content, strees || null, anxiety || null, depression || null, (err,result)=>{
        if(err){
            return res.status(500).json({message : "일기 저장 실패"})
        }

        return res.json({
            message : "일기 저장 성공",
            diary_id : result.insertId
        })
    }])
})

// 특정 날짜 다이어리 조회
router.post('/GetDiaryDate', (req, res)=>{
    const { uid, date } = req.body

    if(!uid || !date){
        return res.status(400).json({message : "uid or date 누락"})
    }

    const sql = `
        select diary_id, user_id, date, content, strees, anxiety, depression
        from diary
        where user_id =? and date =?
        order by diary_id asc
        `

        conn.query(sql, [uid, date], (err, result)=>{
            if(err){
                return res.status(500).json({message : "일기 조회 실패"})
            }

            return res.json({
                message : "특정 날짜 일기 조회 성공",
                date : date,
                diaries : result
            })
        })
})

// 특정 다이어리 삭제
router.post('DeletDiary', (req, res)=>{
    const { uid, did } = req.body

    if(!uid || !did){
        return res.status(400).json({message : "uid or did 누락"})
    }

    const sql = `
        delete from diary
        where diary_id = ? and user_id = ?
    `

    conn.query(sql, [did, uid], (err, result)=>{
        if(err){
            return res.status(500).json({message : "일기 삭제 실패"})
        }

        if(result.affectedRows === 0){
            return res.status(404).json({
                message : "삭제 할 일기가 없음"
            })
        }
        
        return res.json({message : "일기 삭제 성공"})
    })
})

module.exports = router;