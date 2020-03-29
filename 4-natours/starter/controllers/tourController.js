const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours
    }
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const targetId = req.params.id * 1;
  const targetTour = tours.find(tour => tour.id === targetId);
  if (!targetTour) {
    return res.status(404).json({ status: 'fail', message: 'not found (with 2nd method)' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tours: targetTour
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id * 1 + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  res.status(200).json({
    staus: 'success',
    data: {
      tour: '<Updated tour here...></Updated>'
    }
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  res.status(204).json({
    staus: 'success',
    data: null
  });
};

