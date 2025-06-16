const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const responseFormatter = require('../../middlewares/responseFormatter');
const handleFileUpload = require('../../utils/uploadFile');
const { validateRequiredFields } = require('../../utils/validator');
const { sendEmail } = require('../../utils/emailService');
const { sendPush } = require('../../utils/sendPush');
const TokenBlacklist = require('../../models/TokenBlacklist');
require('dotenv').config();

class ApiController {

  static async register(req, res) {
    try {
      const body = req.body || {};
      const { name, email, password, image, token } = body;
      const fieldMap = { name: 'Name', email: 'Email', password: 'Password'};

      const error = await validateRequiredFields(body, fieldMap);
      if(error != true)
      {
        return res.error(error);
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.error('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        status:1,
        image,
        token
      });

      sendEmail({
        to: email,
        subject: 'Welcome to Our Platform!',
        text: `Hi ${name}, welcome to our platform! Your registration was successful.`,
        html: `<p>Hi <strong>${name}</strong>,</p><p>Welcome to our platform! Your registration was successful.</p>`
      });


      const jwtToken = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      );

      return res.success({ token: jwtToken, user: newUser }, 'User registered successfully');
    } catch (error) {
      console.error('Register error:', error);
      return res.error('Internal server error');
    }
  }

  static async imageUpload(req, res) {
    try {
      let image = '';

      if (req.file) 
      {
        image = req.file.path.replace(process.env.REPLACE_FILE_PATH, "admin");
        return res.success(image, 'Image uploaded successfully');
      }
      else
      {
        return res.error('Image uploading failed');
      }
    } catch (error) {
      return res.error('Internal server error');
    }
  }

  static async login(req, res) {
    try {
      const body = req.body || {};
      const { email, password, token } = req.body || {};
      const fieldMap = { email: 'Email', password: 'Password'};
      const error = await validateRequiredFields(body, fieldMap);
      if(error != true)
      {
        return res.error(error);
      }

      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.error('Invalid credentials');
      }

      const jwtToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      );

      if(token && token !== 'undefined' && token !== 'null') { 
        const push_title = 'Welcome Back!'; 
        const push_body = 'Thank you for logging in!';
        const data = { key1: 'value1', key2: 'value2' };
        sendPush(token, push_title, push_body, data);
        
        user.token = token;
        await user.save();
      }

      return res.success({jwtToken, user} , 'Logged in successfully');
    } catch (error) {
      return res.error('Internal server error');
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name','email', 'role']
      });

      if (!user) {
        return res.error('User not found');
      }

      //return res.success({user:user}, 'Profile fetched successfully');
      return res.success(user, 'Profile fetched successfully');
    } catch (error) {
      return res.error('Internal server error');
    }
  }

  static async logout(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) return res.error('Token required');

      const decoded = jwt.decode(token);
      if (!decoded) return res.error('Invalid token');

      await TokenBlacklist.create({
        token: token,
        expiresAt: new Date(decoded.exp * 1000) // 'exp' is in seconds
      });

      return res.success({}, 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      return res.error('Internal server error');
    }
  }

}

module.exports = ApiController;
