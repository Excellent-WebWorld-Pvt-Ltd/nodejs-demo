require('dotenv').config();
const renderVendorPage = (res, view, options = {}) => {
    const defaultOptions = {
        user: options.user || null,
        title: options.title || null,
        appName: process.env.APP_NAME
    };

    res.render('vendor/pages/'+view, { ...defaultOptions, ...options });
};

module.exports = renderVendorPage;