import express from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();


router.get('/',authMiddleware, async (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    const response = await getAllUsers(search, parseInt(page), parseInt(limit));
    res.json(response);
});


router.get('/:id',authMiddleware, async (req, res) => {
    const { id } = req.params;
    const response = await getUser(id);
    res.json(response);
});


router.post('/',authMiddleware,adminMiddleware,  async (req, res) => {
    const userData = req.body; // Contains firstName, lastName, username, email, etc.
    const response = await createUser(userData);
    res.json(response);
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Contains data to be updated
    const response = await updateUser(id, updateData);
    res.json(response);
});


router.delete('/:id',authMiddleware,adminMiddleware,  async (req, res) => {
    const { id } = req.params;
    const response = await deleteUser(id);
    res.json(response);
});

export default router;
