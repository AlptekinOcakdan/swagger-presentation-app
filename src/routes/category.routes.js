import express from 'express';
import {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get a list of categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: Successfully retrieved list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
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
 *                 success:
 *                   type: boolean
 */
router.get('/', async (req, res) => {
    const {search, page, limit, sortBy, sortOrder} = req.query;
    const response = await getAllCategories(search, page, limit, sortBy, sortOrder);
    res.json(response);
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Successfully retrieved a category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const response = await getCategory(id);
    res.json(response);
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category created successfully
 *       400:
 *         description: Error creating category
 */
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const {title, description, parent, image, creator} = req.body;
    const response = await createCategory(title, description, parent, image, creator);
    res.json(response);
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const {id} = req.params;
    const {title, description, parent, image} = req.body;
    const response = await updateCategory(id, title, description, parent, image);
    res.json(response);
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const {id} = req.params;
    const response = await deleteCategory(id);
    res.json(response);
});

export default router;
