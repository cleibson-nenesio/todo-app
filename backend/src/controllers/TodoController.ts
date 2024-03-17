import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Todo } from '../models/Todo';
import { Category } from '../models/Category';
import { TodoCategory } from '../models/TodoCategory';

type CreateTask = {
	title: string;
	status: 'pending' | 'done';
	categories: string[];
};

type GetTaskQuery = {
	category: string;
};

class TodoController {
	async get(req: Request, res: Response) {
		try {
			const { category } = req.query as GetTaskQuery;

			let reqCategory = 'All Tasks';

			if (category) {
				reqCategory = category;
			}

			const selectedCategoryId = await Category.findOne({
				name: reqCategory,
			});

			if (!selectedCategoryId) {
				throw { error: "Category doens't exist" };
			}

			const allRelatedCategoryId = await TodoCategory.find({
				category: selectedCategoryId._id,
			});

			const todosIds = allRelatedCategoryId.map(
				(todoCategory) => todoCategory.todo
			);

			const todos = await Todo.find({ _id: { $in: todosIds } });

			res.status(200).send(todos);
		} catch (err) {
			res.status(400).send(err);
		}
	}

	async create(req: Request, res: Response) {
		const { title, status, categories } = req.body as CreateTask;

		let reqCategories: string[] = [];

		if (categories) {
			reqCategories = categories;
		}

		const todo = await new Todo({
			title,
			status,
		}).save();

		const principalTask = await Category.findOne({ name: 'All Tasks' });

		if (principalTask) {
			await TodoCategory.create({
				todo: todo._id,
				category: principalTask._id,
			});
		}

		const relateCategoriesToTask = reqCategories.map((categoryId) => {
			return TodoCategory.create({
				todo: todo._id,
				category: categoryId,
			});
		});

		Promise.all(relateCategoriesToTask);

		res.status(201).send({ result: 'To-do criado com sucesso!' });
	}
}

export const todoController = new TodoController();
