const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log("MONGO_URI =", process.env.MONGODB_URI);

const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });