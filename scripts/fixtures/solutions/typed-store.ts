interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface State {
  todos: Todo[];
}

type Action =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "rename"; id: number; text: string }
  | { type: "remove"; id: number }
  | { type: "clearDone" };

function reducer(state: Readonly<State>, action: Action): State {
  switch (action.type) {
    case "add": {
      const id = Math.max(0, ...state.todos.map((t) => t.id)) + 1;
      return { todos: [...state.todos, { id, text: action.text, done: false }] };
    }
    case "toggle":
      return { todos: state.todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)) };
    case "rename":
      return { todos: state.todos.map((t) => (t.id === action.id ? { ...t, text: action.text } : t)) };
    case "remove":
      return { todos: state.todos.filter((t) => t.id !== action.id) };
    case "clearDone":
      return { todos: state.todos.filter((t) => !t.done) };
  }
}

function applyActions(initial: State, actions: Action[]): State {
  return actions.reduce(reducer, initial);
}
