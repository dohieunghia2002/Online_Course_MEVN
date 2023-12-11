import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from './config/db.js';

import authRouter from './routes/auth.route.js';
import courseRouter from './routes/course.route.js';
import lessonRouter from './routes/lesson.route.js';
import userRouter from './routes/user.route.js';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_KEY_SECRET,
    secure: true
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));

connectDB();
const port = 3001;

// Routes
app.use('/auth', authRouter);
app.use('/course', courseRouter);
app.use('/lesson', lessonRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
})