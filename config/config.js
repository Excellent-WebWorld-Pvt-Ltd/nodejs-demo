const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const flash = require('connect-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const responseFormatter = require('../middlewares/responseFormatter');
const sequelize = require('./db');

// Load environment variables
require('dotenv').config();
require('./passport')(passport);

const configureApp = (app) => {
    // Rate limiting middleware
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use(limiter);

    // Express core middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(responseFormatter);

    // Static files
    app.use('/admin', express.static(path.join(__dirname, '../public')));
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    // Flash messages
    app.use(flash());

    // Session (MUST be before passport.session())
    const sessionStore = new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000
    });

    app.use(session({
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    }));

    sessionStore.sync();

    // Passport (AFTER session is set)
    app.use(passport.initialize());
    app.use(passport.session());

    // Flash variables in res.locals
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        next();
    });
};

module.exports = configureApp;
