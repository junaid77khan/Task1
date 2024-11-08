import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app = express()

const corsConfig = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"]
}; 

app.use(cors(corsConfig));

app.use(express.json({limit: "50000kb"}))

app.use(express.urlencoded({extended: true, limit: "50000kb"}))

app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.route.js'

app.use("/api/v1/users", userRouter)

export {app}