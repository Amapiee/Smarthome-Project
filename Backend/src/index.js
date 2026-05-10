require('dotenv').config();

const express = require('express');
const connectDB = require('./config/server'); 
const mqttClient = require('./services/mqttServices');
const sensorRoutes = require('./routes/sensorRoutes');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', sensorRoutes)

// Kết nối Database
async function startServer() {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
     console.log(`Server run on port ${PORT}`));
}
startServer();
