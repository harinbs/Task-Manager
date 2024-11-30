const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const todosFilePath = path.join(__dirname, '../data/todos.json');

// Helper function to read todos from the file
const readTodosFromFile = () => {
  const data = fs.readFileSync(todosFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write todos to the file
const writeTodosToFile = (todos) => {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

exports.getTodos = (req, res) => {
  try {
    const todos = readTodosFromFile();
    const { status } = req.query;
    const userTodos = todos.filter(todo => todo.user === req.user.name);
    const filteredTodos = status ? userTodos.filter(todo => todo.status === status) : userTodos;
    res.json({ data: filteredTodos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addTodo = (req, res) => {
  const { title, description, status } = req.body;

  try {
    const todos = readTodosFromFile();
    const newTodo = {
      id: uuidv4(),
      title,
      description,
      status,
      user: req.user.name, // Associate todo with the authenticated user
    };
    todos.push(newTodo);
    writeTodosToFile(todos);
    res.json(newTodo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTodo = (req, res) => {
  const { title, description, status } = req.body;

  try {
    const todos = readTodosFromFile();
    const todoIndex = todos.findIndex((todo) => todo.id === req.params.id);

    if (todoIndex === -1) {
      return res.status(404).json({ msg: 'Todo not found' });
    }

    const todo = todos[todoIndex];

    if (todo.user !== req.user.name) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const updatedTodo = { ...todo, title, description, status };
    todos[todoIndex] = updatedTodo;
    writeTodosToFile(todos);
    res.json(updatedTodo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteTodo = (req, res) => {
  try {
    const todos = readTodosFromFile();
    const todoIndex = todos.findIndex((todo) => todo.id === req.params.id);

    if (todoIndex === -1) {
      return res.status(404).json({ msg: 'Todo not found' });
    }

    const todo = todos[todoIndex];

    if (todo.user !== req.user.name) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    todos.splice(todoIndex, 1);
    writeTodosToFile(todos);
    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};