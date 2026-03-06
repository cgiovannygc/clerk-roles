import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2, "Nombre muy corto"),
  description: z.string().min(1, "La descripción es requerida"),
});
