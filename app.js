require('dotenv').config();
const express =require('express');
const cors = require('cors');
const morgan = require('morgan');


const userRoutes = require('./src/routes/users.routes'); 
const authUser = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/post.routes');

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.use('/users', userRoutes);
app.use('/auth', authUser);
app.use('/posts', postRoutes)

module.exports = app;