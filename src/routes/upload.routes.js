import {Router} from 'express';
import fileUploadMiddleware from '../middlewares/storage.middleware.js';
import {upload} from '../controllers/upload.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

/**
 * @swagger
 * /upload/single:
 *   post:
 *     summary: Upload
 *     description: Upload
 *     tags:
 *       - Upload
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       description: Upload data
 *       required: true
 *       content:
 *        multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Upload successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post('/single',authMiddleware, fileUploadMiddleware.single('file'), upload);

export default router;