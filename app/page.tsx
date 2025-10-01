"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<
    { id: string; name: string; isChecked: boolean }[]
  >([]);

  async function CreateNewTask() {
    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newTask }),
    });

    loadTasks();
    setNewTask("");
  }

  function loadTasks() {
    fetch("http://localhost:8000/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }

  async function deleteTask(id: string) {
    if (confirm("Are you sure?")) {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "DELETE",
      });
      loadTasks();
    }
  }

  async function editTask(task: { id: string; name: string }) {
    const newName = prompt("Enter new task name:", task.name);
    if (newName) {
      await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      }).then(() => {
        loadTasks();
      });
    }
  }

  async function handleCheckboxChange(task: {
    id: string;
    name: string;
    isChecked: boolean;
  }) {
    await fetch(`http://localhost:8000/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: task.name, isChecked: !task.isChecked }),
    });
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="m-8">
      <div className="flex">
        <input
          className="input mr-4"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newTask) {
              CreateNewTask();
            }
          }}
        />
        <button
          disabled={!newTask}
          className="btn btn-accent"
          onClick={CreateNewTask}
        >
          Add
        </button>
      </div>
      {tasks.map((task) => (
        <div className="card p-4 border border-base-300 mt-4 " key={task.id}>
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              className="checkbox"
              onChange={() => handleCheckboxChange(task)}
            />
            <div className={`flex-1 ${task.isChecked ? "line-through" : ""}`}>
              {task.name}
            </div>
            {task.isChecked ? (
              <button
                onClick={() => deleteTask(task.id)}
                className="btn btn-xs btn-soft btn-error"
              >
                delete
              </button>
            ) : (
              <button
                onClick={() => editTask(task)}
                className="btn btn-xs btn-soft btn-ghost"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
// xxaxa
