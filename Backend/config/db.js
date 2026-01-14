const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log("Database are Connected")
    } catch (err) {
        console.error("MongoDB Connection failed", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;