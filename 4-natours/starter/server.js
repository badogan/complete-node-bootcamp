const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful'));

app.listen();
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION shutting down');
  server.close(()=>process.exit(1))
});

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION shutting down');
  server.close(()=>process.exit(1))
});