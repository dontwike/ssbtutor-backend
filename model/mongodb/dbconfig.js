const mongoose = require('mongoose');

// Connection Function
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Initial connection error:', error);
        setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
    }

    // Connection Events
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected! Retrying...');
        connectToDatabase();
    });
};

// Export the connection function
module.exports = connectToDatabase;
