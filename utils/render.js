require('dotenv').config();
const renderAdminPage = (res, view, options = {}) => {
    const defaultOptions = {
        user: options.user || null,
        title: options.title || null,
        appName: process.env.APP_NAME
    };

    res.render('admin/pages/'+view, { ...defaultOptions, ...options });
};

module.exports = renderAdminPage;