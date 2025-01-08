const express = require('express');
const router = express.Router();
const Post = require('../controllers/postController');

router.post('/', Post.createPost);
router.get('/', Post.getAllPosts);
router.get('/:id',Post.getPostById);
router.put('/:id', Post.updatePost);



module.exports = router;
