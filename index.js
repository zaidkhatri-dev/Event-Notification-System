const express = require('express');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const userRouter = require('./routes/userRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const checkToken = require('./middlewares/authentication');

const PORT = 3000;

mongoose.connect(process.env.MONGO_CONNECTION)
.then(()=>{
    console.log('Success: MongoDB connected')
})

const app = express();

app.set('view engine','ejs')
app.set('views','./views')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.use('/',userRouter)
app.use('/dashboard',checkToken(),dashboardRouter)

app.listen(PORT,()=>{
    console.log("Server Started")
})