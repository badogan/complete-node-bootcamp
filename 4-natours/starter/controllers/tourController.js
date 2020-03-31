// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError')

exports.getAllTours = catchAsync(async (req, res, next) => {
  //BUILD QUERY
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(item => delete queryObj[item]);
  const query = Tour.find(queryObj);

  //EXECUTE QUERY
  const tours = await query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.findOne({_id:req.params.id});
  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { tour }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(204).json({
    staus: 'success',
    data: null
  });
});
