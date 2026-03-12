"use client";

import { z } from "zod";
import { taskSchema } from "@/lib/schemas/task.schema";
import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

interface EditTaskProps {
  task: Doc<"tasks">;
}

type FormData = z.infer<typeof taskSchema>;
export default function EditTask({ task }: EditTaskProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const updateTask = useMutation(api.tasks.updateTask);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateTask({
        taskId: task._id,
        title: data.title,
        description: data.description,
      });
      router.push("/tasks");
    } catch (err) {
      console.log(err);
      setServerError(`Error al actualizar la tarea, intenta de nuevo`);
    }
  };
  return (
    <section className="app-shell-compact">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="app-title">Editar tarea</h1>
        <button
          type="button"
          onClick={() => router.push("/tasks")}
          className="app-pill-button"
        >
          Volver a tareas
        </button>
      </div>

      <div className="app-hero mb-6">
        <p className="app-section-label">Edicion</p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--app-title)]">
          {task.title}
        </h2>
        <p className="app-body-text mt-3 max-w-2xl">
          Actualiza el titulo o la descripcion de la tarea.
        </p>
      </div>

      <form className="app-card p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label
            className="mb-2 block text-sm font-semibold text-[var(--app-title)]"
            htmlFor="title"
          >
            Título
          </label>
          <input
            className="app-input h-11"
            id="title"
            type="text"
            placeholder="Título de la tarea"
            {...register("title")}
          />
          {errors.title && (
            <p className="mt-2 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="mb-2 block text-sm font-semibold text-[var(--app-title)]"
            htmlFor="description"
          >
            Descripción
          </label>
          <textarea
            className="app-input min-h-32 py-3"
            id="description"
            placeholder="Descripción de la tarea"
            rows={5}
            {...register("description")}
          ></textarea>
          {errors.description && (
            <p className="mt-2 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        {serverError && (
          <p className="mb-4 text-sm text-red-500">{serverError}</p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/tasks")}
            className="app-pill-button-soft"
          >
            Cancelar
          </button>
          <button
            className="app-pill-button-solid"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Actualizando..." : "Actualizar tarea"}
          </button>
        </div>
      </form>
    </section>
  );
}
