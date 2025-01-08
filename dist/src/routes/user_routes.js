"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const router = express_1.default.Router();
/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/
/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/
/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*/
/**
* @swagger
* /users/register:
*   post:
*     summary: Register a new user
*     tags: [Auth]
*     description: Register a new user with email and password
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: Registration success, return the new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       400:
*         description: Bad request, invalid input
*       500:
*         description: Internal server error
*/
router.post('/register', user_controller_1.default.register);
/**
* @swagger
* /users/login:
*   post:
*     summary: User login
*     tags: [Auth]
*     description: Authenticates a user and returns access and refresh tokens.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: Successful login
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 accessToken:
*                   type: string
*                   description: JWT access token
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                 refreshToken:
*                   type: string
*                   description: JWT refresh token
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                 _id:
*                   type: string
*                   example: 60d0fe4f5311236168a109ca
*       400:
*         description: Incorrect email or password / Error generating tokens
*         content:
*           application/json:
*             schema:
*               type: string
*               example: incorrect email or password
*/
router.post('/login', user_controller_1.default.login);
/**
* @swagger
* /users/logout:
*   post:
*     summary: User logout
*     tags: [Auth]
*     description: Logs out a user by invalidating the refresh token.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               refreshToken:
*                 type: string
*                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*     responses:
*       200:
*         description: Successful logout
*         content:
*           application/json:
*             schema:
*               type: string
*               example: logged out
*       400:
*         description: Error during logout
*         content:
*           application/json:
*             schema:
*               type: string
*               example: error
*/
router.post('/logout', user_controller_1.default.logout);
/**
* @swagger
* /users/refresh:
*   post:
*     summary: Refresh tokens
*     tags: [Auth]
*     description: Refreshes the access and refresh tokens.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               refreshToken:
*                 type: string
*                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*     responses:
*       200:
*         description: Tokens refreshed successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 accessToken:
*                   type: string
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                 refreshToken:
*                   type: string
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                 _id:
*                   type: string
*                   example: 60d0fe4f5311236168a109ca
*       400:
*         description: Error during token refresh
*         content:
*           application/json:
*             schema:
*               type: string
*               example: error
*/
router.post('/refresh', user_controller_1.default.refresh);
/**
* @swagger
* /users/{id}:
*   get:
*     summary: Get user by ID
*     tags: [Auth]
*     description: Retrieve a user by their ID.
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user ID
*     responses:
*       200:
*         description: User found
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       404:
*         description: User not found
*       400:
*         description: Bad request
*/
router.get('/:id', user_controller_1.default.getUserById);
/**
* @swagger
* /users:
*   get:
*     summary: Get all users
*     tags: [Auth]
*     description: Retrieve a list of all users.
*     responses:
*       200:
*         description: A list of users
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/User'
*       400:
*         description: Bad request
*/
router.get('/', user_controller_1.default.getAllUsers);
/**
* @swagger
* /users/{id}:
*   put:
*     summary: Update user by ID
*     tags: [Auth]
*     description: Update a user's information by their ID.
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: User updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       404:
*         description: User not found
*       400:
*         description: Bad request
*/
router.put('/:id', user_controller_1.default.updateUser);
/**
* @swagger
* /users/{id}:
*   delete:
*     summary: Delete user by ID
*     tags: [Auth]
*     description: Delete a user by their ID.
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user ID
*     responses:
*       200:
*         description: User deleted successfully
*       404:
*         description: User not found
*       400:
*         description: Bad request
*/
router.delete('/:id', user_controller_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=user_routes.js.map