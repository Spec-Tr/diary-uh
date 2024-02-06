const express = require('express');
const db = require('./config/connection');
const routes = require('./controllers');


const PORT = process.env.PORT || 3000;
const app = express();

app.post('/test', (req, res) => {
    console.log("Test route hit");
    res.json({ message: "Test route successful" });
  });
  

app.get('/ping', (req, res) => {
    res.send('pong');
});  

app.get('/test', (req, res) => {
    res.send('Server is running and can handle requests.');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack to the console
    res.status(500).send('Something broke!'); // Send a generic error message
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
  
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});