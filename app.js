const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
    maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.user        = req.session.user || null;
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg   = req.flash('error');
    res.locals.currentYear = new Date().getFullYear();
    next();
});

app.get('/', (req, res) => {
    res.send(' Online Exam Platform is running!');
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500 - Server Error');
});

module.exports = app;