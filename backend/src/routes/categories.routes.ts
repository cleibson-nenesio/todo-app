import express from 'express';
import { categoriesControllers } from '../controllers/CategoriesController';

const router = express.Router();

router.get('/', categoriesControllers.get);

router.post('/', categoriesControllers.create);

router.put('/:id', categoriesControllers.update);

export default router;
