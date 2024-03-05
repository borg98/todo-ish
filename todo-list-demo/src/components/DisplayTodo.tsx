import { Todo } from "../models/Todo";

interface DisplayTodoProps {
  todo: Todo;
  onChange: (id: number) => void;
}

export function DisplayTodo(props: DisplayTodoProps) {
  console.log(props.todo);

  return (
    <>
      <li>
        <h3>{props.todo.title}</h3>
        <input
          type="checkbox"
          name="completed"
          checked={props.todo.completed}
          onChange={() => {
            props.onChange(props.todo.id);
          }}
        />
      </li>
    </>
  );
}
