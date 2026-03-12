"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import EditTask from "./editTask";

interface EditTaskPageProps {
  taskId: Id<"tasks">;
}

export default function EditTaskComp({ taskId }: EditTaskPageProps) {
  const taskToEdit = useQuery(api.tasks.getTaskById, { id: taskId });
  if (taskToEdit === undefined)
    return (
      <section className="mx-auto max-w-4xl rounded-3xl border border-[#d8d8d8] bg-[#f5f6f7] p-5 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.45)] md:p-8">
        <div className="rounded-2xl border border-[#e6e8ee] bg-white p-10 text-center text-[#667080] shadow-sm">
          Cargando tarea...
        </div>
      </section>
    );
  if (!taskToEdit)
    return (
      <section className="mx-auto max-w-4xl rounded-3xl border border-[#d8d8d8] bg-[#f5f6f7] p-5 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.45)] md:p-8">
        <div className="rounded-2xl border border-dashed border-[#d8dde6] bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#1f2733]">
            Tarea no encontrada
          </p>
        </div>
      </section>
    );
  return <EditTask task={taskToEdit} />;
}
