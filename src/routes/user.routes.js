import express from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 */


/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users with optional search and pagination
 *     tags: [Users]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Keyword to search users by firstName or lastName
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request
 */
router.get('/',authMiddleware, async (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    const response = await getAllUsers(search, parseInt(page), parseInt(limit));
    res.json(response);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access - No token provided or token is invalid.
 *       404:
 *         description: User not found
 */
router.get('/:id',authMiddleware, async (req, res) => {
    const { id } = req.params;
    const response = await getUser(id);
    res.json(response);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Error creating user
 */
router.post('/',authMiddleware,adminMiddleware,  async (req, res) => {
    const userData = req.body; // Contains firstName, lastName, username, email, etc.
    const response = await createUser(userData);
    res.json(response);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Error updating user
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Contains data to be updated
    const response = await updateUser(id, updateData);
    res.json(response);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id',authMiddleware,adminMiddleware,  async (req, res) => {
    const { id } = req.params;
    const response = await deleteUser(id);
    res.json(response);
});

export default router;
