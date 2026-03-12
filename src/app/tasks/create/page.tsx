"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { taskSchema } from "@/lib/schemas/task.schema";

type FormData = z.infer<typeof taskSchema>;

export default function CreateTask() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const createNewTask = useMutation(api.tasks.createTask);
  const user = useQuery(api.users.userLoginStatus);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema),
  });
  // 1. Cargando
  if (user === undefined)
    return (
      <div className="app-page">
        <section className="app-shell-compact">
          <div className="app-card p-10 text-center text-(--app-text)">
            Cargando...
          </div>
        </section>
      </div>
    );

  // 2. No autenticado
  if (user[0] !== "Logged In") {
    return (
      <div className="app-page">
        <section className="app-shell-compact">
          <div className="app-card p-10 text-center text-(--app-text)">
            Esperando autenticación...
          </div>
        </section>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      await createNewTask({
        title: data.title,
        description: data.description,
      });
      router.push("/tasks");
    } catch (err) {
      setServerError(
        `Error al crear la tarea, intenta de nuevo, error: ${err}`,
      );
    }
  };
  return (
    <div className="app-page">
      <section className="app-shell-compact">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="app-title">Crear nueva tarea</h1>
          <button
            type="button"
            onClick={() => router.push("/tasks")}
            className="app-pill-button"
          >
            Volver a tareas
          </button>
        </div>

        <div className="app-hero mb-6">
          <p className="app-section-label">Nueva tarea</p>
          <p className="app-body-text mt-3 max-w-2xl">
            Agrega un titulo y una descripcion clara para organizar tu trabajo
            dentro del sistema.
          </p>
        </div>

        <form className="app-card p-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label
              className="mb-2 block text-sm font-semibold text-(--app-title)"
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
              <p className="mt-2 text-xs text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-semibold text-(--app-title)"
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
              {isSubmitting ? "Creando..." : "Crear tarea"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
