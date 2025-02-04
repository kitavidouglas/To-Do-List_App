import { connect } from 'mongoose';
require('dotenv').config();


const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/authDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
