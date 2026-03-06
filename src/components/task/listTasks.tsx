"use client";

import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function TaskList() {
  const router = useRouter();
  const tasks = useQuery(api.tasks.getTaskByUser);
  const markTaskAsCompleted = useMutation(api.tasks.updateStatusOfTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  if (!tasks) return <p className="text-center mt-5">Cargando...</p>;
  if (tasks.length === 0)
    return (
      <div className="w-full mt-5">
        <p className="text-center mt-10 text-slate-400 text-4xl">
          No tienes tareas aún. ¡Crea una!
        </p>
        <button
          onClick={() => router.push("/tasks/create")}
          className="fixed bottom-8 right-8 bg-black border-3 border-white hover:bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold transition-colors disabled:opacity-50 shadow-lg"
        >
          +
        </button>
      </div>
    );

  const handleStatusOfTask = async (taskId: string, completed: boolean) => {
    setLoadingTaskId(taskId);
    try {
      await markTaskAsCompleted({
        taskId: taskId as Id<"tasks">,
        status: completed,
      });
    } catch (error) {
      console.error("Error marking task as completed:", error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setLoadingTaskId(taskId);
    try {
      await deleteTask({ taskId: taskId as Id<"tasks"> });
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoadingTaskId(null);
    }
  };
  return (
    <div className="w-full mt-5">
      <div className="flex justify-center mb-8">
        <h1 className="text-5xl">Mis tareas</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-8">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`bg-black border-2 border-white rounded-lg p-5 text-white flex flex-col justify-between h-full ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            <div className="relative text-end">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {
                  handleStatusOfTask(task._id, !task.completed);
                }}
                disabled={loadingTaskId === task._id}
                className="w-5 h-5 cursor-pointer accent-blue-500"
              />
            </div>
            <div className="mt-2 flex-1">
              <h2 className="text-xl font-bold mb-3 pr-4">{task.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {task.description}
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-end md:justify-start gap-3 mt-5">
              <button
                onClick={() => router.push(`/tasks/${task._id}/edit`)}
                disabled={loadingTaskId === task._id}
                className="bg-black border border-white hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                Actualizar
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                disabled={loadingTaskId === task._id}
                className="bg-black border border-white hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push("/tasks/create")}
        className="fixed bottom-8 right-8 bg-black border-3 border-white hover:bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold transition-colors disabled:opacity-50 shadow-lg"
      >
        +
      </button>
    </div>
  );
}
