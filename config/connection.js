const { connect, connection } = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/socialDB';

connect(connectionString)
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = connection;
