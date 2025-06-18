const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');

// Load environment variables
dotenv.config();

const sequelize = require('./config/db');
const configureApp = require('./config/appConfig');

// Import Routes
const adminRoutes = require('./routes/adminRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Apply express configuration
configureApp(app);

// Routes management
app.use('/admin', adminRoutes);
app.use('/vendor', vendorRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
    res.status(404).render('404');
});

app.get('/', (req, res) => {
    res.redirect('/admin/login');
});

// Sync database and start server
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => 
        console.log('Server started on http://localhost:' + process.env.PORT)
    );
});

module.exports = app;
