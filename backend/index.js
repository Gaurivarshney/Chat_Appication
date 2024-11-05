import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoute from './routes/userRoute.js'
import messageRoute from './routes/messageRoute.js'
import postRoute from './routes/postRoute.js'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import { app,server } from './socket/socket.js'
import path from 'path';
dotenv.config({});

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


app.get("/",(req,res)=>{
    return res.status(200).json({
        message: "comming from backend",
        success: true
    })
})

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))


const corsOptions={
    origin: 'process.env.URL',
    credentials:true,
}

app.use(cors(corsOptions))
//end points
app.use('/api/v1/user',userRoute)
app.use('/api/v1/post',postRoute)
app.use('/api/v1/message',messageRoute)

app.use(express.static(path.join(__dirname, "/frnontend/dist")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "frnontend", "dist", "index.html"));
})

server.listen(PORT,()=>{
    connectDB()
    console.log(`server running at port ${PORT}`);
    
})
