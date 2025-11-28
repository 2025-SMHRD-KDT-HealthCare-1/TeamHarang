const express = require("express")
const router = express.Router()
// const conn = require("../config/database")  // DB 쓰게 되면 이 형태로 사용

let todo = [
    { id: 1, task: "뭐할까", done: true }
];

// todo 전체 조회 (GET /todo)
router.get('/', (req, res) => {
    res.json(todo)
});

// todo 특정 조회 (GET /todo/:id)
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const item = todo.find(t => t.id === id)

    if (!item) {
        return res.status(404).json({ message: 'todo not found' })
    }

    res.json(item)
});

// todo 추가 (POST /todo)
router.post('/', (req, res) => {
    const { task, done } = req.body

    // 필수 값 체크 (task, done 둘 다 있어야 함)
    if (task === undefined || done === undefined) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    const newId = todo.length === 0 ? 1 : todo[todo.length - 1].id + 1

    const newTodo = {
        id: newId,
        task,
        done
    }

    todo.push(newTodo)

    return res.status(201).json(newTodo)
})

// // todo 일부 수정 (PATCH /todo/:id)
// router.patch('/:id', (req, res) => {
//     const choice = parseInt(req.params.id)
//     const item = todo.find(t => t.id === choice)

//     if (!item) {
//         return res.status(404).json({ message: 'todo not found' })
//     }

//     const { task, done } = req.body
//     if (task !== undefined) item.task = task
//     if (done !== undefined) item.done = done

//     res.json(item)
// });

// 특정 todo 삭제 (DELETE /todo/:id)
router.delete('/:id', (req, res) => {
    const index = todo.findIndex(t => t.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).json({ message: 'todo not found' })

    const deleted = todo.splice(index, 1)
    res.json(deleted[0])
});

module.exports = router