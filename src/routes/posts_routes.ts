import express,{Request,Response,NextFunction} from 'express';
const router = express.Router();
import post_ from '../controllers/post_controller';
import {authMiddleware} from '../controllers/user_controller';

/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/


/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - title
*         - owner
*       properties:
*         id:
*          type: string
*          description: The auto-generated id of the post
*         title:
*           type: string
*           description: The post title
*         content:
*           type: string
*           description: The post content
*         owner:
*           type: string
*           description: The ID of the user who owns the post
*       example:
*         title: 'My First Post'
*         content: 'This is the content of my first post.'
*         owner: '60d0fe4f5311236168a109ca'
*         id: '60d0fe4f5311236168a109ca'
*/

/**
* @swagger
* /posts:
*   post:
*     summary: Add a new post
*     tags: [Posts]
*     description: Add a new post to the database
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*              title:
*               type: string
*              content:
*               type: string
*             required:
*               - title
*               - content
*     responses:
*       201:
*         description: Post added successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       400:
*         description: Bad request
*       500:
*         description: Internal server error
*/
router.post('/', authMiddleware, post_.AddANew.bind(post_));

/**
* @swagger
* /posts:
*   get:
*     summary: Get all posts
*     tags: [Posts]
*     description: Retrieve all posts from the database
*     responses:
*       200:
*         description: A list of posts
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*       500:
*         description: Internal server error
*/
router.get('/', (req: Request, res: Response) => {
    post_.getAll(req, res);
});

/**
* @swagger
* /posts/{id}:
*   get:
*     summary: Get a post by ID
*     tags: [Posts]
*     description: Retrieve a single post by its ID
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post ID
*     responses:
*       200:
*         description: A single post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       404:
*         description: Post not found
*       500:
*         description: Internal server error
*/
router.get('/:id', (req: Request, res: Response) => {
    post_.getById(req, res);
});

/**
* @swagger
* /posts/{id}:
*   put:
*     summary: Update a post
*     tags: [Posts]
*     description: Update a post by its ID
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       200:
*         description: Post updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*       400:
*         description: Bad request
*       404:
*         description: Post not found
*       500:
*         description: Internal server error
*/
router.put('/:id', (req: Request, res: Response) => {
    post_.updateA(req, res);
});

/**
* @swagger
* /posts/{id}:
*   delete:
*     summary: Delete a post
*     tags: [Posts]
*     description: Delete a post by its ID
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post ID
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Post deleted successfully
*       404:
*         description: Post not found
*       400:
*         description: Invalid ID format
*       500:
*         description: Internal server error
*/
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    post_.deleteById(req, res);
});

export default router;