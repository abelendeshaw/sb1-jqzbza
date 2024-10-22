'use client';

import { useState, useEffect, FormEvent } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error('Todo cannot be empty');
      return;
    }
    const todo: Todo = { id: Date.now(), text: newTodo.trim(), completed: false };
    setTodos([...todos, todo]);
    setNewTodo('');
    toast.success('Todo added successfully');
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success('Todo deleted successfully');
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id: number) => {
    setEditingId(id);
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setNewTodo(todoToEdit.text);
    }
  };

  const saveEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error('Todo cannot be empty');
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === editingId ? { ...todo, text: newTodo.trim() } : todo
      )
    );
    setEditingId(null);
    setNewTodo('');
    toast.success('Todo updated successfully');
  };

  return (
    <div>
      <form onSubmit={editingId !== null ? saveEdit : addTodo} className="mb-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="flex-grow"
          />
          <Button type="submit">
            {editingId !== null ? 'Save' : <PlusCircle className="h-4 w-4" />}
          </Button>
        </div>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-card p-3 rounded-md"
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="rounded text-primary focus:ring-primary"
              />
              <span
                className={`${
                  todo.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {todo.text}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => startEditing(todo.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteTodo(todo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}