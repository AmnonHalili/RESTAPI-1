
const mongoose = require('mongoose');
const Post = require('../models/postModel');

const createPost = async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updatePost= async (req, res) => {
  const postId=req.params.id;
  if (!mongoose.Types.ObjectId.isValid(postId)){
    return res.status(404).send('invalid post id');
  }
    try {
        const updatePost = await Post.findByIdAndUpdate(postId, req.body, { new: true, runValidators: true });
        if (!updatePost) {
            return res.status(404).send('Post not found');
        }
        res.send(updatePost);}
    catch(err){
        res.status(400).send(err.message);
    }
}

const getPostById = async (req, res) => {
   try{ const post = await Post.findById(req.params.id);
    if (post == null) {
        return res.status(404).json({ message: 'Post not found' });
    }else{
        return res.status(200).send(post);
    }}
    catch(err){
        res.status(404).send(err);
    }
}


module.exports = { createPost, getAllPosts, updatePost ,getPostById};
