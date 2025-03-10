import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDb from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectionRouter from './routes/connectionRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import userUpdateRoutes from './routes/userUpdateRoutes.js';
import messageRouter from './routes/messageRoutes.js';

const app = express();
const port  = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(express.json({ limit: '10mb' }));  // Set body size limit to 10mb
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("hello world! working fine");
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/connections', connectionRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/update', userUpdateRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/messages', messageRouter);

connectDb();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
