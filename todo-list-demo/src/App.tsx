import { useEffect, useState } from "react";
import "./App.css";
import { Todo } from "./models/Todo";
import { DisplayTodo } from "./components/DisplayTodo";
import { Socket, io } from "socket.io-client";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const [todo, setTodo] = useState<Todo>({
    id: Date.now(),
    title: "",
    completed: false,
  });

  const addTodo = (todo: Todo) => {
    setTodos([...todos, { ...todo, id: Date.now() }]);
  };

  useEffect(() => {
    const s = io("http://localhost:3000");
    s.on("connected", (initialTodos: Todo[]) => {
      setTodos(initialTodos);
    });
    s.on("todos_added", (todos: Todo[]) => {
      setTodos(todos);
    });

    setSocket(s);

    return () => {
      socket?.disconnect();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, todo: Todo) => {
    const name = e.target.name;
    const value = name === "completed" ? e.target.checked : e.target.value;
    setTodo({
      ...todo,
      [name]: value,
    });
  };

  function toggleTodo(id: number) {
    console.log("todos", todos);
    socket?.emit("toggle_todo", id);
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo = { ...todo, id: Date.now() };
    addTodo(newTodo);
    socket?.emit("add_todo", newTodo);
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <p>
          {todo.title} {todo.completed ? "true" : "false"}
        </p>
        <input
          type="text"
          placeholder="Add a todo"
          name="title"
          onChange={(e) => {
            handleChange(e, todo);
          }}
        ></input>

        <button>Add</button>
      </form>
      <ul>
        {todos.map((todo1, i) => (
          <DisplayTodo todo={todo1} onChange={toggleTodo} key={i} />
        ))}
      </ul>
    </>
  );
}

export default App;
