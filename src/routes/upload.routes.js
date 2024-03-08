import {Router} from 'express';
import fileUploadMiddleware from '../middlewares/storage.middleware.js';
import {upload} from '../controllers/upload.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();


router.post('/single',authMiddleware, fileUploadMiddleware.single('file'), upload);

export default router;