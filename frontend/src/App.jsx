import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { MdDeleteOutline, MdOutlineDone } from "react-icons/md";

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const getTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/todos");
      setTodos(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/todos", {
        description,
        completed: false,
      });
      setDescription("");
      getTodos();
    } catch (error) {
      console.log(error.message);
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, {
        description: editedText,
      });
      setEditingTodo(null);
      setEditedText("");
      getTodos();
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleCompleted = async (id) => {
    try {
      const todo = todos.find((todo) => todo.todo_id === id);
      await axios.put(`http://localhost:5000/todos/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-800 flex justify-center items-center  p-4">
        <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            PERN TODO APP
          </h1>
          <form
            onSubmit={onSubmitForm}
            className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6"
          >
            <input
              className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Whats needs to be done?"
              required
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer">
              Add Task
            </button>
          </form>

          <div>
            {todos.length === 0 ? (
              <p>No tasks available. Add a new task!</p>
            ) : (
              <div className="flex flex-col gap-y-4">
                {todos.map((todo) => (
                  <div key={todo.todo_id} className="pb-2">
                    {editingTodo === todo.todo_id ? (
                      <div className="flex items-center gap-x-3">
                        <input
                          className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                          type="text"
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                        />
                        <div>
                          <button
                            onClick={() => saveEdit(todo.todo_id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 hover:bg-green-600 duration-200"
                          >
                            <MdOutlineDone />
                          </button>
                          <button
                            onClick={() => setEditingTodo(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-600 duration-200"
                          >
                            <IoCloseOutline />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className={`h-5 w-5 border rounded-full flex items-center justify-center ${todo.completed ? "bg-green-500  border-green-500 text-white" : "border-gray-300 hover:border-blue-400"}`}
                          >
                            {todo.completed && <MdOutlineDone size={16} />}
                          </button>
                          <span>{todo.description}</span>
                        </div>
                        <div className="flex gap-x-2">
                          <button
                            onClick={() => {
                              setEditingTodo(todo.todo_id);
                              setEditedText(todo.description);
                            }}
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200 cursor-pointer"
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.todo_id)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200 cursor-pointer"
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
