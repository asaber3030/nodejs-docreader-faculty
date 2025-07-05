import z from 'zod';

export const paginationSchema = z.object({
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
