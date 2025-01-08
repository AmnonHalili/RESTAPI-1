import express,{Request,Response,NextFunction} from 'express';
const router = express.Router();
import comment_ from '../controllers/comment_controllers';
import { authMiddleware } from '../controllers/user_controller';

/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments API
*/

/**
* @swagger
* components:
*   schemas:
*     Comment:
*       type: object
*       required:
*         - comment
*         - owner
*         - postId
*       properties:
*         comment:
*           type: string
*           description: The comment content
*         owner:
*           type: string
*           description: The ID of the user who owns the comment
*         postId:
*           type: string
*           description: The ID of the post the comment belongs to
*       example:
*         comment: 'This is a comment'
*         owner: '60d0fe4f5311236168a109ca'
*         postId: '60d0fe4f5311236168a109cb'
*/

/**
* @swagger
* /comments:
*   post:
*     summary: Add a new comment
*     description: Add a new comment to the database
*     tags: [Comments]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Comment'
*     responses:
*       201:
*         description: Comment added successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Comment'
*       400:
*         description: Bad request
*       500:
*         description: Internal server error
*/
router.post('/', authMiddleware, (req: Request, res: Response) => {
    comment_.AddANew(req, res);
});

/**
* @swagger
* /comments:
*   get:
*     summary: Get all comments
*     description: Retrieve all comments from the database
*     tags: [Comments]
*     responses:
*       200:
*         description: A list of comments
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Comment'
*       500:
*         description: Internal server error
*/
router.get('/', (req: Request, res: Response) => {
    comment_.getAll(req, res);
});

/**
* @swagger
* /comments/{id}:
*   get:
*     summary: Get a comment by ID
*     description: Retrieve a single comment by its ID
*     tags: [Comments]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The comment ID
*     responses:
*       200:
*         description: A single comment
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Comment'
*       404:
*         description: Comment not found
*       500:
*         description: Internal server error
*/
router.get('/:id', (req: Request, res: Response) => {
    comment_.getById(req, res);
});

/**
* @swagger
* /comments/{id}:
*   put:
*     summary: Update a comment
*     description: Update a comment by its ID
*     tags: [Comments]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The comment ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Comment'
*     responses:
*       200:
*         description: Comment updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Comment'
*       400:
*         description: Bad request
*       404:
*         description: Comment not found
*       500:
*         description: Internal server error
*/
router.put('/:id', (req: Request, res: Response) => {
    comment_.updateA(req, res);
});

/**
* @swagger
* /comments/{id}:
*   delete:
*     summary: Delete a comment
*     description: Delete a comment by its ID
*     tags: [Comments]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The comment ID
*     responses:
*       200:
*         description: Comment deleted successfully
*       404:
*         description: Comment not found
*       500:
*         description: Internal server error
*/
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    comment_.deleteById(req, res);
});

export default router;