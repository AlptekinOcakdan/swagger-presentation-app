import express from 'express';
import {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();


router.get('/', async (req, res) => {
    const {search, page, limit, sortBy, sortOrder} = req.query;
    const response = await getAllProducts(search, page, parseInt(limit), sortBy, sortOrder);
    res.json(response);
});


router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const response = await getProduct(id);
    res.json(response);
});


router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const {title, description, stock, price, image, categories, creator} = req.body;
    const response = await createProduct(title, description, stock, price, image, categories, creator);
    res.json(response);
});


router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const {id} = req.params;
    const updateData = req.body; // Assuming the body contains the fields to update
    const response = await updateProduct(id, updateData);
    res.json(response);
});


router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const {id} = req.params;
    const response = await deleteProduct(id);
    res.json(response);
});

export default router;
