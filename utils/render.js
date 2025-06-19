require('dotenv').config();
const renderAdminPage = (res, req, view, options = {}) => {
    const defaultOptions = {
        user: options.user || null,
        title: options.title || null,
        appName: process.env.APP_NAME,
        t: req.t,
        lng: req.session.lng || 'en'
    };

    res.render('admin/pages/'+view, { ...defaultOptions, ...options });
};

module.exports = renderAdminPage;