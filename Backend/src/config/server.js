const dns = require('node:dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB is connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;