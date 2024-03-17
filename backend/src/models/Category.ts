import mongoose, { Schema } from 'mongoose';

const categoryScheme = new Schema({
	name: {
		type: String,
		required: true,
	},
	order: Number,
});

export const Category = mongoose.model('Category', categoryScheme);
