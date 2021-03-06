const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1.check if email and password exist
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  //2.checl if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }
  //3.if all fine send jwt to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token
  });
});

const protect = catchAsync(async (req, res, next) => {
  //1. getting token and checking if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('you are not logged in. please login', 401));
  }
  //2. verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //3. verification that user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('the user belonging to this token no longer exists', 401)
    );
  }
  //4.chevl if user changed password after the token was issued

  // GRANT ACCESS!
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

module.exports = { signup, login, protect, restrictTo };
