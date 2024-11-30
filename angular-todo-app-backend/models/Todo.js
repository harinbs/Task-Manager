const fs = require('fs');
const path = require('path');
const todosFilePath = path.join(__dirname, '../data/todos.json');

class Todo {
  constructor(title, description, status, user) {
    this.title = title;
    this.description = description;
    this.status = status;
    this.user = user;
  }

  static findByUser(userId) {
    const todos = JSON.parse(fs.readFileSync(todosFilePath, 'utf-8'));
    return todos.filter(todo => todo.user === userId);
  }

  static findById(id) {
    const todos = JSON.parse(fs.readFileSync(todosFilePath, 'utf-8'));
    return todos.find(todo => todo.id === id);
  }

  static save(todo) {
    const todos = JSON.parse(fs.readFileSync(todosFilePath, 'utf-8'));
    todos.push(todo);
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
  }

  static update(id, updatedTodo) {
    let todos = JSON.parse(fs.readFileSync(todosFilePath, 'utf-8'));
    todos = todos.map(todo => (todo.id === id ? updatedTodo : todo));
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
  }

  static delete(id) {
    let todos = JSON.parse(fs.readFileSync(todosFilePath, 'utf-8'));
    todos = todos.filter(todo => todo.id !== id);
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
  }
}

module.exports = Todo;