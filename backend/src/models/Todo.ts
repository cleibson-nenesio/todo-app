import mongoose, { Schema } from 'mongoose';

const todoSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ['pending', 'done'],
		default: 'pending',
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
	},
});

export const Todo = mongoose.model('Todo', todoSchema);
