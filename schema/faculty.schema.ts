import z from 'zod';
import createModelSchema from './schema';

const fullSchema = z
  .object({
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
  })
  .strict();

// Create Zod schemas for select and orderBy
// const selectSchema = z
//   .object(
//     Object.fromEntries(
//       Object.keys(fullSchema.shape).map(key => [key, z.boolean().optional()]),
//     ),
//   )
//   .strict();

// const orderBySchema = z
//   .object(
//     Object.fromEntries(
//       Object.keys(fullSchema.shape).map(key => [
//         key,
//         z.enum(['asc', 'desc']).optional(),
//       ]),
//     ),
//   )
//   .strict();

// const facultySchema = {
//   where: fullSchema.partial().strict(),
//   select: selectSchema,
//   orderBy: orderBySchema,
//   find: z
//     .object({
//       where: fullSchema.partial().optional(),
//       select: selectSchema.optional(),
//       orderBy: orderBySchema.optional(),
//       pagination: paginationSchema.optional(),
//     })
//     .strict(),
//   update: fullSchema.pick({ name: true, city: true }).partial().strict(),
//   create: fullSchema.pick({ name: true, city: true }).required().strict(),
// };

const facultySchema = createModelSchema(
  fullSchema,
  ['name', 'city'],
  ['name', 'city'],
);

// --- Type Exports ---
export type FacultyWhereInput = z.infer<typeof facultySchema.where>;
export type FacultySelectInput = z.infer<typeof facultySchema.select>;
export type FacultyOrderByInput = z.infer<typeof facultySchema.orderBy>;
export type FacultyFindInput = z.infer<typeof facultySchema.find>;
export type FacultyUpdateInput = z.infer<typeof facultySchema.update>;
export type FacultyCreateInput = z.infer<typeof facultySchema.create>;

export default facultySchema;
