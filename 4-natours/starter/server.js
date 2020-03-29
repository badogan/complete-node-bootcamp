const app = require('./app');

app.listen();
const port = 4000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
