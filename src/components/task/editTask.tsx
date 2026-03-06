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
    <div className="w-full h-full">
      <div className="flex items-center justify-center mt-5">
        <h1 className="text-4xl">Editar tarea: {task.title}</h1>
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white focus:outline-sky-400"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white focus:outline-sky-400"
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
              className="border border-white bg-black transition-colors hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
