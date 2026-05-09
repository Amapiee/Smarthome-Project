require('dotenv').config();

const express = require('express');
const connectDB = require('./config/server'); 
const mqttClient = require('./services/mqttServices');


const app = express();
app.use(express.json());

// Kết nối Database
async function startServer() {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
     console.log(`Server run on port ${PORT}`));
}
startServer();
