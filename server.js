require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const pool = require('./db/conn');
const userRoutes = require('./src/routes/users.routes'); 
const authUser = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/post.routes');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/users', userRoutes);
app.use('/auth', authUser);
app.use('/posts', postRoutes)

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})