const { Schema, model } = require('mongoose');
const PLM = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new Schema({
  googleId: String,
  username: String,
  password: String,
  secret: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(PLM);
userSchema.plugin(findOrCreate);

module.exports = model('User', userSchema);
