const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./usersModel');
const restrict = require('../restrict');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/users', restrict(), async (req, res, next) => {
  try {
    console.log('get users request', req.headers);
    res.json(await Users.find());
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, department } = req.body;
    const user = await Users.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: 'Username is already taken',
      });
    }

    const newUser = await Users.add({
      username,
      // hash the password with a time complexity of "14"
      password: await bcrypt.hash(password, 14),
      department,
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: 'You shall not pass!',
      });
    }

    // hash the password again and see if it matches what we have in the database
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: 'You shall not pass!',
      });
    }
    const payload = {
      userId: user.id,
      username: user.username,
      // userRole: "admin", // this value would usually come from the database
    };
    // generate a new session for this user,
    // and sends back a session ID

    const token = generateToken(user);
    res.cookie('token', jwt.sign(payload, process.env.JWT_SECRET));
    res.json({
      message: `Welcome ${user.username}!`,
      token,
    });
  } catch (err) {
    next(err);
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
    department: user.department,
    // ...otherData
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, process.env.JWT_SECRET, options); // this method is synchronous
}

// router.get('/logout', async (req, res, next) => {
//   try {
//     req.cookie.token
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
