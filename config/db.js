const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/absu_platform', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ ABSU Database Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ DB Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
