/**
 * Schemas Zod e tipos de tarefa.
 *
 * Este arquivo é compartilhado entre servidor (validação dos inputs do tRPC)
 * e cliente (validação do formulário), então não deve importar nada do servidor.
 * Assim as regras de validação vivem em um único lugar.
 */
import { z } from "zod";

export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
};

// Regras de cada campo, reutilizadas na criação e na edição.
const title = z
  .string()
  .trim()
  .min(1, "O título é obrigatório")
  .max(120, "O título deve ter no máximo 120 caracteres");

const description = z
  .string()
  .trim()
  .max(500, "A descrição deve ter no máximo 500 caracteres")
  .optional();

export const createTaskSchema = z.object({
  title,
  description,
});

// Na edição todos os campos são opcionais, mas o título, se enviado,
// passa pela mesma regra e não pode ficar vazio.
export const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: title.optional(),
  description,
});

export const idSchema = z.object({
  id: z.string().min(1),
});

export const listTasksSchema = z.object({
  // `cursor` é o índice inicial da página. Aceita null porque o infinite query
  // do tRPC envia null na primeira página; nesse caso começamos do 0.
  cursor: z
    .number()
    .int()
    .min(0)
    .nullish()
    .transform((cursor) => cursor ?? 0),
  limit: z.number().int().min(1).max(50).default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type IdInput = z.infer<typeof idSchema>;
export type ListTasksInput = z.infer<typeof listTasksSchema>;
