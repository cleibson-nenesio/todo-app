import { API } from './api';

type CreateCategory = {
	name: string;
};

class CategoriesServices {
	private endpoint = '/categories';

	async getAll(query?: string) {
		return await API.get(`${this.endpoint}/${query ?? ''}`);
	}

	async create(body: CreateCategory) {
		return await API.post(`${this.endpoint}`, body);
	}

	async update(
		id: string,
		body: Partial<CreateCategory & { order: number }>
	) {
		return await API.put(`${this.endpoint}/${id}`, body);
	}
}

export const categoriesServices = new CategoriesServices();
