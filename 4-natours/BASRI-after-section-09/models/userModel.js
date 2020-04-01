const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'enter email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'email not valid']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'please enter password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm  password'],
    validate: {
      //this only works on create() and save()
      validator: function(passwordToBeConfirmed) {
        return passwordToBeConfirmed === this.password;
      },
      message: 'passwords r not same!'
    }
  },
  passwordChangedAt: {
    type: Date
  }
});

userSchema.pre('save', async function(next) {
  //do this only if modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  // if (this.changedPasswordAfter) {
  //   console.log(this.passwordChangedAt, JWTTimestamp);
  // }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
