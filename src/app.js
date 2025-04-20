import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import fs from "fs"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
// for doing crud operations on cookies of the client browser
app.use(cookieParser())

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

//routes
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/auth", authRouter)

export {app}