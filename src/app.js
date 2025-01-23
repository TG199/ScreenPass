const express = require('express');
const cors = require('cors')
const session = require('express-session');
const connectDB = require('./config/db');
const routes = require('./routes/index')
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET, // Not implemented yet
        resave: false,
        saveUninitialized: true,
    })
);

app.use('/', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.Status(500).json({
        msg: 'Something broke!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));