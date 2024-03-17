import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeScreen from './pages/Home';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeScreen />,
	},
]);

function App() {
	const queryClient = new QueryClient();

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</>
	);
}

export default App;
