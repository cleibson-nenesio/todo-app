// React
import React, { useState } from 'react';

// Services
import { categoriesServices } from '../../../services/Categories';

// Libraries
import { useQueryClient } from '@tanstack/react-query';
import { Category } from '../../../pages/Home';
import {
	DragDropContext,
	Draggable,
	DropResult,
	Droppable,
} from 'react-beautiful-dnd';

type AsideCategoriesProps = {
	currentCategory: string;
	setCurrentCategory(name: string): void;
	categories: Category[];
	setCategories(categories: Category[]): void;
};

export default function AsideCategories({
	categories,
	setCategories,
	currentCategory,
	setCurrentCategory,
}: AsideCategoriesProps) {
	const [showInput, setShowInput] = useState<boolean>(false);
	const [newCategoryName, setNewCategoryName] = useState<string>('');

	const queryClient = useQueryClient();

	async function createNewCategory(e: React.FormEvent<HTMLFormElement>) {
		try {
			e.preventDefault();

			await categoriesServices.create({ name: newCategoryName });

			setNewCategoryName('');

			queryClient.invalidateQueries({
				queryKey: ['categories'],
				exact: true,
				refetchType: 'all',
			});
		} catch (err) {
			console.error(err);
		}
	}

	async function handleChangeCategoryPosition(e: DropResult) {
		if (!e.destination || !e.destination.index) return;

		const copyCategories = [...categories];

		const categoryMovedId = e.draggableId.split('-')[1];

		const category = categories.find((c) => c._id == categoryMovedId);

		if (!category) return;

		copyCategories.splice(e.source.index, 1);

		copyCategories.splice(e.destination?.index, 0, category);

		setCategories(copyCategories);

		await categoriesServices.update(categoryMovedId, {
			order: e.destination?.index,
		});

		queryClient.invalidateQueries({
			queryKey: ['categories'],
			exact: true,
			refetchType: 'all',
		});
	}

	return (
		<aside className="py-9 px-5 w-fit min-w-[200px]">
			<DragDropContext onDragEnd={handleChangeCategoryPosition}>
				<Droppable droppableId="categories">
					{(provided) => (
						<ul
							className="characters"
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{categories.map(({ name, _id }, i) => (
								<Draggable
									draggableId={`category-${_id}`}
									index={i}
									key={i}
								>
									{(provided) => (
										<li
											onClick={() =>
												setCurrentCategory(name)
											}
											className={`text-[30px] cursor-pointer transition-all duration-300 ${
												currentCategory == name &&
												'font-bold'
											}`}
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											{name}
										</li>
									)}
								</Draggable>
							))}

							{provided.placeholder}
						</ul>
					)}
				</Droppable>
			</DragDropContext>

			<div className="mt-[16px]">
				{showInput && (
					<form onSubmit={createNewCategory}>
						<input
							type="text"
							placeholder="Category name"
							className="border border-slate-300 outline-none px-[8px] py-[4px] rounded-md"
							value={newCategoryName}
							onChange={(e) => setNewCategoryName(e.target.value)}
						/>
					</form>
				)}

				{!showInput && (
					<button
						className="text-[#ABABAB] w-full"
						onClick={() => setShowInput(true)}
					>
						+ New Category
					</button>
				)}
			</div>
		</aside>
	);
}
