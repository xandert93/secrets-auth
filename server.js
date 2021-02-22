process.env.NODE_ENV !== 'production' &&
  require('dotenv').config({ path: './config/config.env' });

const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: 1 }));
app.use(express.static(`${__dirname}/public`));

const session = require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
app.use(session);

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const { connectDB, connection, set } = require('./config/db');
connectDB();
set('useCreateIndex', true);
connection.on('error', (err) => {
  console.log(err.message);
});

const usersRouter = require('./routes/users');
app.use(usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(
    `Listening on port ${PORT} and awaiting HTTP requests from client.`
  )
);
