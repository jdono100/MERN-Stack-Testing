const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');

const PORT = process.env.PORT || 3001;

const app = express();

mongoose.connect('mongodb+srv://jared-donovan:Password1@cluster0.ix5mk.mongodb.net/mernapptesting?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log('Mongoose connected')
})


// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  // React app location
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(expressSession({
  secret: process.env.SECRET || 'Secreet',
  resave: true,
  saveUninitialized: true
}));

app.use(cookieParser(process.env.SECRET || 'Secreet'));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


// Routes

app.get('/getUser', (req, res) => {
  // Once authenticated, User is stored in req.user
  // The req sent from client now has the User object inside w/ session data
  // This can be used & called at any time
  res.send(req.user);
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) res.send('No user exists');
    else {
      req.logIn(user, err => {
        if (err) throw err;
        res.send('Successfully authenticated!');
        console.log(req.user);
      })
    }
  })(req, res, next);
});

app.post('/register', (req, res) => {
  User.findOne({
    username: req.body.username
  }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send('User already exists');
    if (!doc) {
      const hashedPw = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPw,
      });
      await newUser.save();
      res.send('User registered');
    }
  })
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
