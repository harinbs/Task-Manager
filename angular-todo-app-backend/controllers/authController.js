const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    user = await User.findByName(name);
    if (user) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    const newUser = new User(name, email, password);
    await User.save(newUser);

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login request received:', req.body); // Add logging

    let user = await User.findByEmail(email);
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};