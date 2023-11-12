const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userroutes');
const adminRoutes = require('./routes/adminroutes');
const blogRoutes = require('./routes/blogroutes');

const app = express();
const PORT = 3010;
const JWT_SECRET = 'JwtSecretKey001';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Use routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);

// Database connection
mongoose.connect('mongodb://localhost:27017/blogapp')
  .then(() => console.log('Connected w MongoDB'))
  .catch(err => console.error('Couldnt connect MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});