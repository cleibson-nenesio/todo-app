import moongose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db = moongose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jsytsng.mongodb.net/`
);
