const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const flash = require('connect-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

const responseFormatter = require('../middlewares/responseFormatter');
const sequelize = require('./db');

require('dotenv').config();
require('./passport')(passport);

const configureApp = (app) => {

    // Custom language detector (per route logic)
    const customDetector = {
        name: 'customDetector',
        lookup(req, res, options) {
            // For API routes: detect via header
            if (req.originalUrl.startsWith('/api')) {
                return req.headers['accept-language']?.split(',')[0] || 'en';
            } 
            // For Admin routes: detect via session or cookie
            else if (req.originalUrl.startsWith('/admin') || req.originalUrl.startsWith('/vendor')) {
                return req.session.lng || 'en';
            }
            // Fallback
            return 'en';
        },
        cacheUserLanguage(req, res, lng, options) {
            // Cache language in session only for admin
            if (req.originalUrl.startsWith('/admin') || req.originalUrl.startsWith('/vendor')) {
                req.session.lng = lng;
            }
        }
    };

    // Set up LanguageDetector with custom detector
    const languageDetector = new middleware.LanguageDetector();
    languageDetector.addDetector(customDetector);

    // i18next Configuration
    i18next
        .use(Backend)
        .use(languageDetector)
        .init({
            fallbackLng: 'en',
            preload: ['en', 'fr'],
            backend: {
                loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json')
            },
            detection: {
                order: ['customDetector'], // Only use custom detector
                caches: ['session']
            }
        });

    // Rate limiting middleware
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use(limiter);

    // Core Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(responseFormatter);

    // Static files & views
    app.use('/admin', express.static(path.join(__dirname, '../public')));
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    // Flash messages
    app.use(flash());

    // Session configuration
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

    // Passport authentication
    app.use(passport.initialize());
    app.use(passport.session());

    // i18next Middleware (AFTER session setup)
    app.use(middleware.handle(i18next));

    // Flash messages in views
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        next();
    });

};

module.exports = configureApp;
