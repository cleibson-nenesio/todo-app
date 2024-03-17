import express from 'express';
import { todoController } from '../controllers/TodoController';

const router = express.Router();

router.get('/', todoController.get);

router.post('/', todoController.create);

router.put('/:id', todoController.update);

router.delete('/:id', todoController.delete);

export default router;
