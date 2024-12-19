const express = require('express');
const router = require('./src/routes/api');
const app = express();

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require("path");

// MongoDB Atlas connection string
let URI = "mongodb+srv://aaabir2a:2024@cluster0.cgctw.mongodb.net/Ecommerce?retryWrites=true&w=majority";

// Mongoose connection options
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
};

// Connect to MongoDB Atlas
mongoose.connect(URI, options)
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.error("Database Connection Error:", err);
    });

app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

app.set('etag', false);
app.use("/api/v1", router);

// Add React Front End Routing
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

module.exports = app;
