const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const usersFilePath = path.join(__dirname, '../data/users.json');

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async findByEmail(email) {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    return users.find(user => user.email === email);
  }

  static async findByName(name) {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    return users.find(user => user.name === name);
  }

  static async save(user) {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    user.password = await this.hashPassword(user.password); // Hash the password before saving
    users.push(user);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async addDefaultUser() {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    if (users.length === 0) {
      const defaultUser = new User('defaultuser', 'test@example.com', 'password');
      await this.save(defaultUser);
    }
  }
}

module.exports = User;