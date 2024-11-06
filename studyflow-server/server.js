require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API running...' });
});

// routes here
// app.use('/api/auth', require('./routes/auth.routes'));

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message ,
        error:process.env.NODE_ENV === development ? err.message : {}
    });
});

// starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use('/api/auth', require('./routes/auth.routes'));