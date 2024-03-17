import mongoose, { Schema } from 'mongoose';

const todoCategorySchema = new Schema({
	todo: {
		type: Schema.Types.ObjectId,
		ref: 'Todo',
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
	},
});

export const TodoCategory = mongoose.model('TodoCategory', todoCategorySchema);
