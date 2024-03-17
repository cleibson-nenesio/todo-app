import axios from 'axios';

const BASE_URL = 'http://localhost:3303';

export const API = axios.create({
	baseURL: BASE_URL,
});
