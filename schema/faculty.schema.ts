import z from 'zod';
import { paginationSchema } from './pagination.schema';

const fullSchema = z.object({
  id: z.number().int({ message: 'ID must be integer.' }),
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Cannot be greater than 255 characters' }),
  city: z
    .string()
    .min(1, { message: 'City is required' })
    .max(255, { message: 'Cannot be greater than 255 characters' })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create Zod schemas for select and orderBy
const selectSchema = z.object(
  Object.fromEntries(
    Object.keys(fullSchema.shape).map(key => [key, z.boolean().optional()]),
  ),
);

const orderBySchema = z.object(
  Object.fromEntries(
    Object.keys(fullSchema.shape).map(key => [
      key,
      z.enum(['asc', 'desc']).optional(),
    ]),
  ),
);

const facultySchema = {
  where: fullSchema.partial(),
  select: selectSchema,
  orderBy: orderBySchema,
  find: z.object({
    where: fullSchema.partial().optional(),
    select: selectSchema.optional(),
    orderBy: orderBySchema.optional(),
    pagination: paginationSchema.optional(),
  }),
  update: fullSchema.pick({ name: true, city: true }).partial(),
  create: fullSchema.pick({ name: true, city: true }).required(),
};

// --- Type Exports ---
export type FacultyWhereInput = z.infer<typeof facultySchema.where>;
export type FacultySelectInput = z.infer<typeof facultySchema.select>;
export type FacultyOrderByInput = z.infer<typeof facultySchema.orderBy>;
export type FacultyFindInput = z.infer<typeof facultySchema.find>;
export type FacultyUpdateInput = z.infer<typeof facultySchema.update>;
export type FacultyCreateInput = z.infer<typeof facultySchema.create>;

export default facultySchema;
