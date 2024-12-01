const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');

router.post('/', async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      sender: req.body.sender,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const senderId = req.query.sender;
    let posts;
    if (senderId) {
      posts = await Post.find({ sender: senderId });
    } else {
      posts = await Post.find();
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', getPost, (req, res) => {
  res.json(res.post);
});

router.put('/:id', getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title;
  }
  if (req.body.content != null) {
    res.post.content = req.body.content;
  }
  if (req.body.sender != null) {
    res.post.sender = req.body.sender;
  }
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.post = post;
  next();
}

module.exports = router;
