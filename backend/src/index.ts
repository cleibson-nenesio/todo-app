import express, { json } from 'express';
import dotenv from 'dotenv';
import todoRouter from './routes/todo.routes';
import categoryRouter from './routes/categories.routes';
import mongoose from 'mongoose';

dotenv.config();

export const connection = mongoose.connect(
	`mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.jsytsng.mongodb.net/todos`
);

const app = express();

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.use(express.json());

app.use('/todo', todoRouter);
app.use('/categories', categoryRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`[server]: running at port ${PORT}`);
});
