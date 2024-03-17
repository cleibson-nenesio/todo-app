import { Request, Response } from 'express';
import { Category } from '../models/Category';

type OrderBy = 'asc' | 'desc';

type Category = {
	name: string;
	order: number;
};

class CategoriesControllers {
	async get(req: Request, res: Response) {
		try {
			const query = req.query;

			let orderBy: OrderBy = 'asc';

			if (query.order_by) {
				if (query.order_by != 'asc' && query.order_by != 'desc') {
					throw { error: "order_by query should be 'asc' or 'desc'" };
				}

				orderBy = query.order_by as OrderBy;
			}

			const allCategories = await Category.find({}).sort({
				order: orderBy,
			});

			res.status(200).send(allCategories);
		} catch (err) {
			console.error(err);

			res.status(400).send(err);
		}
	}

	async create(req: Request, res: Response) {
		try {
			const { name } = req.body;

			if (!name) throw { name: 'Category name is required!' };

			const allCategories = await Category.find({});

			await Category.create({
				name,
				order: allCategories.length + 1,
			});

			res.status(201).send('Category created sucessfully');
		} catch (err) {
			res.status(400).send(err);
		}
	}

	async update(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const body = req.body as Category;

			const allCategories = await Category.find({});

			if (body.order > allCategories.length)
				throw {
					error: "Order can't be greater than categories length",
				};

			const category = await Category.findByIdAndUpdate(id, body);

			if (body.order) {
				for (let j = 1; j < allCategories.length; j++) {
					if (j < body.order || category?._id == allCategories[j]._id)
						continue;

					Category.findByIdAndUpdate(allCategories[j]._id, {
						order: j + 1,
					});
				}
			}

			res.status(200).send('Task updated successfully');
		} catch (err) {
			console.log(err);

			res.status(400).send(err);
		}
	}
}

export const categoriesControllers = new CategoriesControllers();
