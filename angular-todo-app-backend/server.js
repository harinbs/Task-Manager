const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// Init Middleware
app.use(bodyParser.json());
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

// Add default user
User.addDefaultUser().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});