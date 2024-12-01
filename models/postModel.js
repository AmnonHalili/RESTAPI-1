const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.post('/', (req, res) => {
  res.send('Creating a post');
});

router.get('/', (req, res) => {
  const senderId = req.query.sender;
  if (senderId) {
    res.send(`Getting posts by sender ${senderId}`);
  } else {
    res.send('Getting all posts');
  }
});

router.get('/:id', (req, res) => {
  const postId = req.params.id;
  res.send(`Getting a post with ID ${postId}`);
});

router.put('/:id', (req, res) => {
  const postId = req.params.id;
  res.send(`Updating a post with ID ${postId}`);
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Post', postSchema);
  

module.exports = router;
