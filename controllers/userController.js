const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(User.createStrategy());
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => done(err, user))
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/secrets',
      userProfilelURL: 'https://www.googleapis.com/oaut2/v3/userinfo',
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, (err, user) => cb(err, user));
    }
  )
);

exports.getHomePage = async (req, res) => {
  res.render('home');
};

exports.getLoginPage = async (req, res) => {
  res.render('login');
};

exports.getRegisterPage = async (req, res) => {
  res.render('register');
};

exports.createUser = async (req, res, next) => {
  const authenticateUser = passport.authenticate('local');
  try {
    await User.register({ username: req.body.username }, req.body.password);
    authenticateUser(req, res, next);
  } catch (err) {
    console.log(err);
    res.redirect('/register');
  }
};

exports.loginUser = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  const authenticateUser = passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/secrets',
  });
  req.login(user, (err) => {
    if (err) return console.log(err);
    authenticateUser(req, res);
  });
};

exports.requestGoogleProfile = (req, res) => {
  const authenticateUser = passport.authenticate('google', {
    scope: ['profile'],
  });
  //redirect to authenticate on Google servers, requesting their profile once logged in
  authenticateUser(req, res);
};

exports.useGoogleAuth = (req, res) => {
  const authenticateUser = passport.authenticate('google', {
    successRedirect: '/secrets',
    failureRedirect: '/login',
  });
  //authenticate them locally, verify callback called in strategy config
  authenticateUser(req, res);
};

exports.getSecretsPage = async (req, res) => {
  try {
    const usersWithSecrets = await User.find({ secret: { $ne: null } });
    res.render('secrets', { usersWithSecrets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWriteSecretPage = (req, res) => {
  if (req.isAuthenticated()) return res.render('writeSecret');
  else return res.redirect('/login');
};

exports.addSecretField = async (req, res) => {
  const { secret } = req.body;
  req.user.secret = secret;

  try {
    await req.user.save();
    res.redirect('/secrets');
  } catch (err) {
    console.log(err);
    res.redirect('/writeSecret');
  }
};

exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect('/');
};
