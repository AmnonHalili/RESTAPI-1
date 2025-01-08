const Posts = require("../models/postModel");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
    console.log(req.body);
    try {
        const post = await Posts.create(req.body);
        res.status(201).send(post);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
};

const getAllPosts = async (req, res) => {
    const filter = req.query;
    console.log(filter);
    try {
        if (filter.owner) {
            const posts = await Posts.find({ owner: filter.owner });
            return res.send(posts);
        }
        else {
            const posts = await Posts.find()
            return res.send(posts);
        }
    }
    catch (err) { return res.status(400).send(err.message); }
};

const getPostById = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Posts.findById(postId);
        if (post === null) {
            return res.status(404).send("post not found");
        } else {
            return res.status(200).send(post);
        }
    } catch (err) {
        console.log(err)
        res.status(404).send(err);
    }
};

const updatePost = async (req, res) => {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).send("Invalid post ID format");
    }

    try {
        const updatedPost = await Posts.findByIdAndUpdate(postId, req.body, { new: true, runValidators: true });

        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }

        res.send(updatedPost);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

module.exports = { createPost, getAllPosts, updatePost, getPostById };
