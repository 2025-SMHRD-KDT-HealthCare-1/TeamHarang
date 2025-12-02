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
// 월 일기 작성여부 조회
router.post('/MonthDiary', (req, res)=>{
    const { uid, year, month } = req.body

    if(!uid || !year || !month){
        return res.status(400).json({message : "uid or 날짜 누락"})
    }

    const monthStr = month.toString().padStart(2, '0') // 한자리 월 일때 두자리로 맞춤
    
    // yyyy-mm으로 검색
    const yearMonth = `${year}-${monthStr}`

    const sql = `
        select distinct date
        from diary
        where user_id = ? 
            and date_format(date, %Y-%m) = ?
        order by date ASC`

        conn.query(sql, [uid, yearMonth], (err, result)=>{
            if(err){
                return res.status(500).json({message : "월별 일기 조회 실패"})
            }

            // 날짜만 배열로 추출
            const dates = result.map(row => row.date)

            return res.json({
                message : "월별 작성 일기 날짜 조회 성공",
                year,
                month,
                dates
            })
        })
    })

// 특정 날짜 다이어리 조회
router.post('/GetDiaryDate', (req, res)=>{
    const { uid, date } = req.body

    if(!uid){
        return res.status(400).json({message : "uid 누락"})
    }

    // date가 없으면 오늘 날짜로 자동설정
    let targetDate = date
    if(!targetDate){
        const today = new Date()
        targetDate = today.toISOString().split('T')[0] //yyyy-mm-dd
    }

    const sql = `
        select diary_id, user_id, date, content, strees, anxiety, depression
        from diary
        where user_id =? and date =?
        order by diary_id asc
        `

        conn.query(sql, [uid, targetDate], (err, result)=>{
            if(err){
                return res.status(500).json({message : "일기 조회 실패"})
            }

            // 일기가 없는 경우
            if(result.length === 0){
                return res.json({
                message : "특정 날짜 일기 조회 성공",
                date : targetDate,
                info : "작성안함"
            })
        }

        // 일기가 있을 경우
        return res.json({
            message : "특정 날짜 일기 조회 성공",
            date : targetDate,
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