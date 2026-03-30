const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/absu_platform');
        console.log(`✅ ABSU Institutional Database Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ DB Operational Failure: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
