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

  if (tasks === undefined)
    return (
      <section className="mx-auto max-w-7xl rounded-3xl border border-[#d8d8d8] bg-[#f5f6f7] p-5 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.45)] md:p-8">
        <div className="rounded-2xl border border-[#e6e8ee] bg-white p-10 text-center text-[#667080] shadow-sm">
          Cargando tus tareas...
        </div>
      </section>
    );
  if (!tasks)
    return (
      <section className="mx-auto max-w-7xl rounded-3xl border border-[#d8d8d8] bg-[#f5f6f7] p-5 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.45)] md:p-8">
        <div className="rounded-3xl bg-[#ece6dc] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6876]">
            Mis tareas
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1f2733] sm:text-4xl">
            Organiza tu trabajo en un solo lugar
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#667080]">
            Aun no tienes tareas registradas. Crea la primera para empezar a
            organizar tu flujo de trabajo.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-[#d8dde6] bg-white p-10 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#1f2733]">
            No tienes tareas aun
          </p>
          <p className="mt-2 text-sm text-[#667080]">
            Crea una tarea nueva y aparecera aqui automaticamente.
          </p>
        </div>

        <button
          onClick={() => router.push("/tasks/create")}
          className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#0f4f43] bg-[#0f4f43] text-3xl font-bold text-white shadow-lg transition hover:bg-[#0b3c34] disabled:opacity-50"
        >
          +
        </button>
      </section>
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
    <section className="mx-auto max-w-7xl rounded-3xl border border-[#d8d8d8] bg-[#f5f6f7] p-5 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.45)] md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1f2733] sm:text-4xl">
          Mis tareas
        </h1>
        <button
          onClick={() => router.push("/tasks/create")}
          className="rounded-full border border-[#0f4f43] bg-white px-5 py-2 text-sm font-semibold text-[#0f4f43] transition hover:bg-[#0f4f43] hover:text-white"
        >
          Crear tarea
        </button>
      </div>

      <div className="mb-6 rounded-3xl bg-[#ece6dc] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6876]">
          Productividad
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[#667080]">
          Visualiza tus tareas, marca avances y administra cada pendiente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map((task) => (
          <article
            key={task._id}
            className={`group rounded-2xl border border-[#e6e8ee] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
              task.completed ? "opacity-75" : ""
            }`}
          >
            <div className="relative mb-4 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#f1f4f7]">
              <span
                className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  task.completed
                    ? "border-[#cce2dc] bg-[#eef7f4] text-[#0f4f43]"
                    : "border-[#dbe2ea] bg-white text-[#6b7482]"
                }`}
              >
                {task.completed ? "Completada" : "Pendiente"}
              </span>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d9e8e4] text-3xl font-black text-[#0f4f43] transition group-hover:scale-105">
                {task.title.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="line-clamp-1 text-lg font-bold text-[#202735]">
                {task.title}
              </h2>
              <p className="mt-2 min-h-16 text-sm leading-relaxed text-[#697282]">
                {task.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#5f6876]">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {
                    handleStatusOfTask(task._id, !task.completed);
                  }}
                  disabled={loadingTaskId === task._id}
                  className="h-4 w-4 cursor-pointer accent-[#0f4f43]"
                />
                Completar
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => router.push(`/tasks/${task._id}/edit`)}
                disabled={loadingTaskId === task._id}
                className="rounded-full border border-[#0f4f43] bg-white px-4 py-2 text-sm font-semibold text-[#0f4f43] transition hover:bg-[#0f4f43] hover:text-white disabled:opacity-50"
              >
                Actualizar
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                disabled={loadingTaskId === task._id}
                className="rounded-full border border-[#f2c8c8] bg-[#fff5f5] px-4 py-2 text-sm font-semibold text-[#a93b3b] transition hover:border-[#e09a9a] hover:bg-[#fdeaea] disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>

      <button
        onClick={() => router.push("/tasks/create")}
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#0f4f43] bg-[#0f4f43] text-3xl font-bold text-white shadow-lg transition hover:bg-[#0b3c34] disabled:opacity-50"
      >
        +
      </button>
    </section>
  );
}
