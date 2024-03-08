import { Router } from 'express';
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       description: User's login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: The user's email or username.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *               isRememberMe:
 *                 type: boolean
 *                 description: Flag to keep the user logged in across sessions.
 *                 default: false
 *     responses:
 *       200:
 *         description: Login successful, returns user data and access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token for the authenticated session.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 success:
 *                   type: boolean
 *                   default: true
 *       401:
 *         description: Invalid credentials provided.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.post('/login', async (req, res) => {
    const { identifier, password, isRememberMe } = req.body;
    const result = await login(identifier, password, isRememberMe);

    if (result.success) {
        res.status(200).json(result);
    } else {
        let statusCode = 500;
        switch (result.errorCode) {
            case 'USER_NOT_FOUND':
                statusCode = 404;
                break;
            case 'INVALID_PASSWORD':
                statusCode = 401;
                break;
            // Add more cases as necessary
        }
        res.status(statusCode).json({ message: result.message || "An error occurred", success: false });
    }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       description: User's registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error (e.g., user already exists, passwords do not match).
 *       500:
 *         description: Server error.
 */
router.post('/register', async (req, res) => {
    const userDetails = req.body;
    const result = await register(userDetails);

    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(400).json({ message: result.message, success: false });
    }
});

export default router;
