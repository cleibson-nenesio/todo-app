// React
import React, { useState } from 'react';

// Services
import { categoriesServices } from '../../../services/Categories';

// Libraries
import { useQueryClient } from '@tanstack/react-query';
import { Category } from '../../../pages/Home';

type AsideCategoriesProps = {
	currentCategory: string;
	setCurrentCategory(name: string): void;
	categories: Category[];
};

export default function AsideCategories({
	categories,
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

	return (
		<aside className="py-9 px-5 w-fit min-w-[200px]">
			<ul className="flex flex-col gap-[16px]">
				{categories.map(({ name, _id }) => (
					<li
						onClick={() => setCurrentCategory(name)}
						className={`text-[30px] cursor-pointer transition-all duration-300 ${
							currentCategory == name && 'font-bold'
						}`}
						key={_id}
					>
						{name}
					</li>
				))}
			</ul>

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
