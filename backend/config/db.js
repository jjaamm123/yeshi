const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("MONGODB CONNECTION FAILED!");
        console.error("The exact error is:", error.message);
        // We throw the error so server.js can catch it, instead of using process.exit here
        throw error; 
    }
};

module.exports = { connectDB };