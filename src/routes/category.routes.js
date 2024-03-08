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


router.get('/', async (req, res) => {
    const {search, page, limit, sortBy, sortOrder} = req.query;
    const response = await getAllCategories(search, page, limit, sortBy, sortOrder);
    res.json(response);
});


router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const response = await getCategory(id);
    res.json(response);
});


router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const {title, description, parent, image, creator} = req.body;
    const response = await createCategory(title, description, parent, image, creator);
    res.json(response);
});


router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const {id} = req.params;
    const {title, description, parent, image} = req.body;
    const response = await updateCategory(id, title, description, parent, image);
    res.json(response);
});


router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const {id} = req.params;
    const response = await deleteCategory(id);
    res.json(response);
});

export default router;
