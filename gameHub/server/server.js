const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes');
// console.log(indexRouter)
const PORT = process.env.PORT || 3210;
const app = express();
require('./connection');

// custom logger
app.use((req, res, next) => {
  console.info(`Method: ${req.method} URL: ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.info(`Server is listening on HTTP://localhost:${PORT}`);
});
