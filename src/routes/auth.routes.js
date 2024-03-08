import { Router } from 'express';
import { login, register } from "../controllers/auth.controller.js";

const router = Router();


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
