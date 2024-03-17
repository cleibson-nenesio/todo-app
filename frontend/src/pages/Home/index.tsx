// React
import React, { useEffect, useState } from 'react';

// COmpoonents
import AsideCategories from '../../components/shared/AsideCategories';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { todoServices } from '../../services/Todos';
import { categoriesServices } from '../../services/Categories';

type Todos = {
	title: string;
	status: string;
	_id: string;
};

export type Category = {
	name: string;
	order: number;
	_id: string;
};

export default function HomeScreen() {
	const [todos, setTodos] = useState<Todos[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [taskTitle, setTaskTitle] = useState<string>('');
	const [currentCategory, setCurrentCategory] = useState('All Tasks');
	const [categoriesToRelate, setCategoriesToRelate] = useState<string[]>([]);

	const queryClient = useQueryClient();

	const { data } = useQuery({
		queryKey: ['todos', currentCategory],
		queryFn: async () =>
			await todoServices.getAll(`?category=${currentCategory}`),
	});

	const { data: categoriesData } = useQuery({
		queryKey: ['categories'],
		queryFn: async () => await categoriesServices.getAll(),
	});

	useEffect(() => {
		if (data) {
			setTodos(data.data);
		}

		if (categoriesData) {
			setCategories(categoriesData.data);
		}
	}, [data, categoriesData]);

	function toggleTask(taskId: string) {
		const copyTodos = [...todos];

		const todoToToggle = copyTodos.find((todo) => todo._id == taskId);

		if (!todoToToggle) return;

		if (todoToToggle.status == 'pending') {
			todoToToggle.status = 'done';
		} else {
			todoToToggle.status = 'pending';
		}

		setTodos(copyTodos);
	}

	function toggleCategory(categoryId: string) {
		setCategoriesToRelate((prevData) => {
			if (prevData.includes(categoryId)) {
				return prevData.filter((id) => id != categoryId);
			}

			return [...prevData, categoryId];
		});
	}

	async function createTask(e: React.FormEvent<HTMLFormElement>) {
		try {
			e.preventDefault();

			await todoServices.create({
				title: taskTitle,
				status: 'pending',
				categories: categoriesToRelate,
			});

			queryClient.invalidateQueries({
				queryKey: ['todos', currentCategory],
				refetchType: 'all',
				exact: true,
			});

			setTaskTitle('');
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<main className="flex h-[100svh] gap-14">
			<AsideCategories
				currentCategory={currentCategory}
				setCurrentCategory={setCurrentCategory}
				categories={categories}
			/>

			<hr className="h-full w-[1px] bg-slate-300" />

			<section className="p-9 w-full">
				<h3 className="font-bold text-[50px]">{currentCategory}</h3>

				<form
					onSubmit={createTask}
					className="flex flex-col gap-[16px] mb-[30px]"
				>
					<input
						type="text"
						placeholder="Add a new task"
						className="bg-[#E1DEDE] px-[18px] py-[11px] w-full outline-none placeholder:text-[#ABABAB] mt-[27px]"
						name="taskTitle"
						value={taskTitle}
						onChange={(e) => setTaskTitle(e.target.value)}
					/>

					{taskTitle.length > 0 && (
						<div className="flex gap-[10px] flex-wrap">
							{categories
								.filter((c) => c.name != 'All Tasks')
								.map((category) => (
									<div
										className={`px-[16px] py-[8px] rounded-full cursor-pointer w-fit ${
											categoriesToRelate.includes(
												category._id
											)
												? 'bg-slate-200'
												: 'bg-slate-50'
										}`}
										onClick={() =>
											toggleCategory(category._id)
										}
										key={category._id}
									>
										<p>{category.name}</p>
									</div>
								))}
						</div>
					)}
				</form>

				<ul>
					{todos.map((task, i) => (
						<li className="flex gap-[4px]" key={i}>
							<input
								type="checkbox"
								checked={task.status == 'done'}
								onChange={() => toggleTask(task._id)}
								id={`task=${task._id}`}
							/>
							<p
								className={
									task.status == 'done' ? 'line-through' : ''
								}
							>
								{task.title}
							</p>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
