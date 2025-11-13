import express, { urlencoded } from 'express'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors'
import requestLogger from './middlewares/requestLogger.js';
import cookieParser from "cookie-parser";

import authRouter from './routes/authRoute.js';
import categoryRouter from './routes/categoryRoute.js'
import cloudinaryRouter from './routes/cloudinaryRoute.js'
import bannerRouter from './routes/bannerRoute.js'
import productRouter from './routes/productRoute.js'
import  dashboardAnalyticsRouter from './routes/dashboardAnalyticsRoute.js'

//initiating App
const app = express();
const allowedOrigins = [/\.yourdomain\.com$/, "http://localhost:3000", "http://192.168.1.41:3000"];

// middleware 
app.use(requestLogger), 
app.use(helmet());
app.use(cors({
    origin: allowedOrigins, // frontend origin
    credentials: true,               // allow cookies
  }))
app.use(express.json())
app.use(cookieParser());
app.use(urlencoded({extended:true}));


//routing

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.use('/api/v1/analytics', dashboardAnalyticsRouter)
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/banner', bannerRouter)
app.use('/api/v1/image', cloudinaryRouter);
app.use('/api/v1/product', productRouter)
app.use('/api/v1/category', categoryRouter);



export default app;
