import React, { useState, useEffect } from 'react';

const PRIORITY_COLORS = {
  high: 'bg-red-100 border-red-300',
  medium: 'bg-yellow-100 border-yellow-300',
  low: 'bg-green-100 border-green-300'
};

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [newTags, setNewTags] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority,
        tags,
        dueDate,
        createdAt: new Date().toISOString()
      }]);
      setNewTodo('');
      setNewTags('');
      setDueDate('');
      setPriority('medium');
    }
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'active') return !todo.completed;
      return true;
    })
    .filter(todo =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    high: todos.filter(todo => todo.priority === 'high').length,
    overdue: todos.filter(todo => todo.dueDate && new Date(todo.dueDate) < new Date()).length
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Enhanced Todo List</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-gray-600">Total Tasks</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-gray-600">Completed</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-red-600">{stats.high}</p>
          <p className="text-gray-600">High Priority</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.overdue}</p>
          <p className="text-gray-600">Overdue</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos or tags..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="New todo input"
          />
          <input
            type="text"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="Add todo"
        >
          Add Task
        </button>
      </form>

      {/* Todo List */}
      <ul className="space-y-3">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center gap-4 p-4 rounded-lg shadow border-2 transition-all duration-200 transform hover:scale-[1.02] ${PRIORITY_COLORS[todo.priority]}`}
          >
            <button
              onClick={() => handleToggleTodo(todo.id)}
              className={`flex-1 text-left ${todo.completed ? 'line-through text-gray-500' : ''}`}
              aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
            >
              <div className="font-medium">{todo.text}</div>
              {todo.tags.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {todo.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {todo.dueDate && (
                <div className={`text-sm mt-1 ${new Date(todo.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                </div>
              )}
            </button>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="p-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-colors"
              aria-label={`Delete ${todo.text}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList; 