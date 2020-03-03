const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// up two levels and to User.js
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
// router.get('/', (req, res) => res.send('User route'));
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valide email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // see if user exists
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }
      //Get users gravatar
      const avatar = gravatar.url(email, {
        size: '200',
        rating: 'pg',
        default: 'mm'
      });

      user = new User({ name, email, avatar, password });

      // password goes through 10 rounds
      // the high the number the slower it will get but more secured
      const salt = await bcrypt.genSalt(10);

      // creates a hash
      //Encrypt password
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      res.send('User registered');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }

    res.send('User route');
  }
);

module.exports = router;
