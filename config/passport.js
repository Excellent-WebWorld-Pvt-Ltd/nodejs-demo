const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Sequelize model

module.exports = function(passport) {
   passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true // Important: allows req to be passed to the callback
  }, 
  async (req, email, password, done) => {
    try {
      const role = req.body.role;
      const user = await User.findOne({ where: { email, role: role } });

      if (!user) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
