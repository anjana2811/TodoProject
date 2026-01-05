import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTodos = async () => {
    const res = await axios.get(API);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!task.trim()) return;
    const res = await axios.post(API, { task });
    setTodos([...todos, res.data]);
    setTask("");
  };

  const toggleComplete = async (todo) => {
    const res = await axios.put(`${API}/${todo.id}`, { completed: !todo.completed });
    setTodos(todos.map(t => t.id === todo.id ? res.data : t));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.task);
  };

  const saveEdit = async (todo) => {
    const res = await axios.put(`${API}/${todo.id}`, { task: editText });
    setTodos(todos.map(t => t.id === todo.id ? res.data : t));
    setEditingId(null);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo App</h1>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button style={styles.addBtn} onClick={addTodo}>Add</button>
      </div>

      <ul style={styles.list}>
        {todos.map(todo => (
          <li key={todo.id} style={styles.item}>

            {/* ✔ Tick icon */}
            <span
              style={{ ...styles.icon, color: todo.completed ? "green" : "black" }}
              onClick={() => toggleComplete(todo)}
              title="Mark Complete"
            >
              ✔
            </span>

            {editingId === todo.id ? (
              <>
                <input
                  style={styles.editInput}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button style={styles.saveBtn} onClick={() => saveEdit(todo)}>Save</button>
              </>
            ) : (
              <span
                style={{
                  ...styles.taskText,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "gray" : "black"
                }}
              >
                {todo.task}
              </span>
            )}

            {/* ✏️ Edit icon */}
            <span
              style={styles.icon}
              onClick={() => startEdit(todo)}
              title="Edit Task"
            >
              ✏️
            </span>

            {/* 🗑 Delete icon */}
            <span
              style={{ ...styles.icon, color: "red" }}
              onClick={() => deleteTodo(todo.id)}
              title="Delete Task"
            >
              🗑
            </span>

          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 550,
    margin: "40px auto",
    padding: 20,
    borderRadius: 10,
    background: "#f5f5f5",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  title: { textAlign: "center" },
  inputRow: { display: "flex", gap: 10 },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    border: "1px solid #ccc"
  },
  addBtn: {
    padding: "10px 15px",
    borderRadius: 5,
    border: "none",
    background: "#007bff",
    color: "white",
    cursor: "pointer"
  },
  list: { marginTop: 20, listStyle: "none", padding: 0 },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8
  },
  taskText: { flex: 1, marginLeft: 10 },
  icon: { marginLeft: 10, cursor: "pointer", fontSize: 18 },
  editInput: { flex: 1, padding: 5 },
  saveBtn: {
    marginLeft: 10,
    padding: "5px 10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  }
};

export default App;
