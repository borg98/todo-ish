import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { Todo } from "./models/Todo";

let todos: Todo[] = [];

const app = express();
const port = 3000;

const server = createServer(app);

const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("connected", todos);
  socket.on("add_todo", (todo: Todo) => {
    todos.push(todo);
    console.log("todo", todo);
    io.emit("todos_added", todos);
  });
  socket.on("toggle_todo", (id: number) => {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });
    io.emit("todos_added", todos);
  });
});

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
