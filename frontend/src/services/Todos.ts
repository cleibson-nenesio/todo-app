import { AxiosResponse } from 'axios';
import { API } from './api';

interface ITodo {
	getAll(query?: string): Promise<AxiosResponse<any, any>>;
	create(body: CreateTask): Promise<AxiosResponse<any, any>>;
}

interface CreateTask {
	title: string;
	status: string;
	categories: string[];
}

class TodoServices implements ITodo {
	private endpoint = '/todo';

	async getAll(query?: string) {
		return await API.get(`${this.endpoint}/${query ?? ''}`);
	}

	async create(body: CreateTask) {
		return await API.post(this.endpoint, body);
	}
}

export const todoServices = new TodoServices();
