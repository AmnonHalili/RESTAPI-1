require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongoURL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost/mongoDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

app.use('/posts', require('./routes/postRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
