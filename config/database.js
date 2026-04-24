const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anass';

const connectDB = async () => {
    try {
    console.log('Attempting to connect to MongoDB...');
      console.log('Using database:', mongoURI.split('/').pop().split('?')[0]); // Extract DB name without exposing full URI

    if (mongoose.connection.readyState === 1) {
        console.log('Already connected to MongoDB');
        return mongoose.connection;
    }

    const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 10000, 
        socketTimeoutMS: 45000,
        maxPoolSize: 10, 
        minPoolSize: 2,
        connectTimeoutMS: 10000,
        retryWrites: true,
        retryReads: true
    });
    
    console.log(`MongoDB connected successfully to database: ${mongoose.connection.db.databaseName}`);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));
    
    const stats = await mongoose.connection.db.stats();
    console.log(`Database contains ${stats.collections} collections and ${stats.objects} total documents`);
    
    return conn;
    } catch (error) {
    console.error('MongoDB connection error:');
    console.error('  Message:', error.message);
    console.error('  Error code:', error.code);
    console.error('  Name:', error.name);
    
    if (error.name === 'MongoServerSelectionError') {
        console.error('  Connection refused. Check that MongoDB server is running.');
        console.error('  Check that the URI is correct and the server is accessible.');
    } else if (error.name === 'MongoError' && error.code === 18) {
        console.error('  Authentication failed. Check username and password in the URI.');
    } else if (error.name === 'MongoError' && error.code === 13) {
        console.error('  Authorization failed. Check user permissions for this database.');
    }
    
    if (process.env.NODE_ENV === 'production') {
        console.log('Will retry connection in 5 seconds...');
        setTimeout(() => connectDB(), 5000);
    } else {
        if (process.env.EXIT_ON_DB_FAIL === 'true') {
        process.exit(1);
        } else {
        throw error; 
        }
    }
    }
};

mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    
    if (process.env.NODE_ENV === 'production') {
    console.log('Attempting to reconnect...');
    setTimeout(() => connectDB(), 5000);
    }
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

const validateModels = () => {
    const modelNames = mongoose.modelNames();
    console.log('Registered Mongoose models:', modelNames.join(', '));
    
    if (modelNames.includes('Exam')) {
    console.log('✅ Exam model is properly registered');
    } else {
    console.error('❌ Exam model is NOT registered! Check model definition');
    }
};

module.exports = connectDB;
module.exports.validateModels = validateModels;