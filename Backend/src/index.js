const express = require('express');
const connectDB = require('./config/server'); 
require('dotenv').config();

const app = express();

// Kết nối Database
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại cổng ${PORT}`));