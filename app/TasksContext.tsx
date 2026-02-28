import React, { createContext, ReactNode, useContext, useState } from "react";

export type Task = {
  id: string;
  title: string;
  notes: string;
  date: string;
  done: boolean;
};

export type TasksContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Task 1", notes: "", date: "2026-02-28", done: false },
    { id: "2", title: "Task 2", notes: "", date: "2026-02-28", done: true },
  ]);

  const addTask = (task: Task) => setTasks((prev) => [...prev, task]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks must be used within TasksProvider");
  return context;
};