"use client";

import { Separator } from "@/components/ui/separator";
import { create } from "domain";
import { useEffect, useState } from "react";

export default function Home() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<
    { id: string; name: string; isChecked: boolean }[]
  >([]);
  const [allTasks, setAllTasks] = useState<
    { id: string; name: string; isChecked: boolean }[]
  >([]);
  const [activeFilter, setActiveFilter] = useState("all");

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

  function handleAllClick() {
    setActiveFilter("all");
  }

  function handleActiveClick() {
    setActiveFilter("active");
    console.log(activeFilter);
  }

  function handleCompletedClick() {
    setActiveFilter("completed");
  }

  function loadTasks() {
    fetch(`http://localhost:8000/tasks?status=${activeFilter}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }

  function loadAllTasks() {
    fetch(`http://localhost:8000/tasks?status=all`)
      .then((res) => res.json())
      .then((data) => {
        setAllTasks(data);
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

  async function handleDeleteCompletedTasks() {
    if (confirm("Are you sure you want to delete all completed tasks?")) {
      await fetch(`http://localhost:8000/deleteAll`, {
        method: "DELETE",
      });
    }
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, [activeFilter]);

  useEffect(() => {
    loadAllTasks();
  }, [CreateNewTask, handleDeleteCompletedTasks]);

  return (
    <div className="flex justify-center w-screen h-screen bg-[#F3F4F6] ">
      <div className="m-8 w-[377px] h-fit bg-white flex items-center flex-col shadow-xl rounded-md p-4">
        <h1 className="text-4xl mb-4 mt-4">To-Do list</h1>
        <div className="flex mb-4 w-full">
          <input
            className="border  mr-2 w-full rounded-md active:outline-blue-400 p-2"
            placeholder="  Add a new task..."
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
            className="btn btn-accent w-[60px] rounded-md bg-blue-400"
            onClick={CreateNewTask}
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 w-full ">
          <button
            className={`btn  rounded-md ${
              activeFilter === "all" ? "bg-blue-400" : ""
            }`}
            onClick={handleAllClick}
          >
            All
          </button>
          <button
            className={`btn rounded-md ${
              activeFilter === "active" ? "bg-blue-400" : ""
            }`}
            onClick={handleActiveClick}
          >
            Active
          </button>
          <button
            className={`btn rounded-md ${
              activeFilter === "completed" ? "bg-blue-400" : ""
            }`}
            onClick={handleCompletedClick}
          >
            Completed
          </button>
        </div>
        {tasks.length === 0 && <div className="mt-4">No tasks</div>}
        {tasks.map((task) => (
          <div
            className="card m-auto p-2 border border-base-300 mt-4 w-[340px] bg-[#f9fafb]"
            key={task.id}
          >
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                className="checkbox checkbox-error bg-green-200"
                onChange={() => handleCheckboxChange(task)}
                defaultChecked={task.isChecked}
              />
              <div className={`flex-1 ${task.isChecked ? "line-through" : ""}`}>
                {task.name}
              </div>
              {task.isChecked ? (
                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn btn-xs btn-soft btn-error rounded-md"
                >
                  delete
                </button>
              ) : (
                <button
                  onClick={() => editTask(task)}
                  className="btn btn-xs btn-soft btn-ghost rounded-md"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
        <Separator className="my-5"></Separator>
        <div className="flex w-full items-center justify-around ">
          {tasks.length > 0 && (
            <div>
              {tasks.filter((task) => task.isChecked).length} of{" "}
              {allTasks.length} tasks completed
            </div>
          )}
          <button className="text-red-500" onClick={handleDeleteCompletedTasks}>
            clear completed
          </button>
        </div>
      </div>
    </div>
  );
}
