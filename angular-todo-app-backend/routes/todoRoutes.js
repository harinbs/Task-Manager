const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

router.get('/', authMiddleware, getTodos);
router.post('/', authMiddleware, addTodo);
router.put('/:id', authMiddleware, updateTodo);
router.delete('/:id', authMiddleware, deleteTodo);

module.exports = router;