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
    return <p className="text-center text-3xl">Cargando tarea...</p>;
  if (taskToEdit === null) return <p>Tarea no encontrada</p>;
  return <EditTask task={taskToEdit} />;
}
