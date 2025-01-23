import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DBCon from './utils/db.js';
import AuthRoutes from './routes/Auth.js';
import AdminRoutes from './routes/AdminRoutes.js';

dotenv.config();
const PORT=process.env.PORT || 3000;
const app = express();

//mongo db
DBCon();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);


app.get('/', (req, res) => {
  res.send('world!');
})

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});
