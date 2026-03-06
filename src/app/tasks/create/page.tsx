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
  if (user === undefined) return <p>Cargando...</p>;

  // 2. No autenticado
  if (user[0] !== "Logged In") {
    return <p>Esperando autenticación...</p>;
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
    <div className="w-full h-full">
      <div className="flex items-center justify-center mt-5">
        <h1 className="text-4xl">Crear nueva tarea</h1>
      </div>
      <div className="flex items-center justify-center mt-10">
        <form
          className="w-full max-w-md bg-black border border-white p-6 rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="title"
            >
              Título
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 focus:outline-sky-400"
              id="title"
              type="text"
              placeholder="Título de la tarea"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs italic mt-2">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="description"
            >
              Descripción
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 focus:outline-sky-400"
              id="description"
              placeholder="Descripción de la tarea"
              rows={4}
              {...register("description")}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description.message}
              </p>
            )}
          </div>
          {serverError && (
            <p className="text-red-500 text-sm mt-2">{serverError}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/tasks")}
              className="border border-white bg-black transition-colors hover:bg-teal-700 text-white px-4 py-2 rounded font-bold"
            >
              Cancelar
            </button>
            <button
              className="border border-white bg-black transition-colors hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
