const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const flash = require('connect-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const { i18next, middleware } = require('./i18n'); // your new file

const responseFormatter = require('../middlewares/responseFormatter');
const sequelize = require('./db');

require('dotenv').config();
require('./passport')(passport);

const configureApp = (app) => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use(limiter);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(responseFormatter);

    app.use('/admin', express.static(path.join(__dirname, '../public')));
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    app.use(flash());

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

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(middleware.handle(i18next)); // i18next after session

    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        next();
    });
};

module.exports = configureApp;
