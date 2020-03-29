const express = require('express');
const app = express();

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1 - MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json()); //middleware
app.use((req, res, next) => {
  console.log('hello from the mddleware!');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
