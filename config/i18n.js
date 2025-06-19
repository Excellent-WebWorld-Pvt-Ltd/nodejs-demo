const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

// Custom Language Detector
const customDetector = {
    name: 'customDetector',
    lookup(req, res, options) {
        if (req.originalUrl.startsWith('/api')) {
            return req.headers['accept-language']?.split(',')[0] || 'en';
        } else if (req.originalUrl.startsWith('/admin') || req.originalUrl.startsWith('/vendor')) {
            return req.session.lng || 'en';
        }
        return 'en';
    },
    cacheUserLanguage(req, res, lng, options) {
        if (req.originalUrl.startsWith('/admin') || req.originalUrl.startsWith('/vendor')) {
            req.session.lng = lng;
        }
    }
};

// Setup Language Detector
const languageDetector = new middleware.LanguageDetector();
languageDetector.addDetector(customDetector);

// i18next Initialization
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
            order: ['customDetector'],
            caches: ['session']
        }
    });

module.exports = { i18next, middleware };
