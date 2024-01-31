const mongoose = require('mongoose');
const db = 'gameHub';

mongoose.set('strictQuery', true);
mongoose.Promise = global.Promise;

mongoose.connect(
  `mongodb+srv://admin:FishPark5@cluster0.yc8oupt.mongodb.net/gameHub`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on('connected', () => {
  console.info(`Connected to ${db} database `);
});

mongoose.connection.on('error', (error) => {
  console.info(`Database connection error ${error}`);
  process.exit(1);
});

mongoose.connection.on('disconnected', () => {
  console.info('Database disconnected');
});
