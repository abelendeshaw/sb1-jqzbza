import TodoList from '../components/TodoList';

export default function Home() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4 text-center">Todo List</h1>
      <TodoList />
    </div>
  );
}