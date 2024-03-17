import express from 'express';
import { categoriesControllers } from '../controllers/CategoriesController';

const router = express.Router();

router.get('/', categoriesControllers.get);

router.post('/', categoriesControllers.create);

export default router;
