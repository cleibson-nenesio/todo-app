import express from 'express';
import { todoController } from '../controllers/TodoController';

const todoRouter = express.Router();

todoRouter.get('/', todoController.get);

todoRouter.post('/', todoController.create);

export default todoRouter;
