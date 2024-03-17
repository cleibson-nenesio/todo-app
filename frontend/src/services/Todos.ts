import { API } from './api';
interface CreateTask {
	title: string;
	status: string;
	categories: string[];
}

class TodoServices {
	private endpoint = '/todo';

	async getAll(query?: string) {
		return await API.get(`${this.endpoint}/${query ?? ''}`);
	}

	async create(body: CreateTask) {
		return await API.post(this.endpoint, body);
	}

	async update(id: string, body: Partial<CreateTask>) {
		return await API.put(`${this.endpoint}/${id}`, body);
	}

	async delete(id: string) {
		return await API.delete(`${this.endpoint}/${id}`);
	}
}

export const todoServices = new TodoServices();
