//Itai Rahamim 207970385
//Amnon Halili 315186346
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotnev = require('dotenv').config();
const PORT = process.env.PORT || 3000;



mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const postRoutes = require('./routes/postRoutes');
app.use('/posts', postRoutes);

const commentRoutes = require('./routes/commentRoutes');
app.use('/comments', commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
