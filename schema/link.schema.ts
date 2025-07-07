import z from 'zod';
import createModelSchema from './schema';
import { CategoryType, DataType } from '@prisma/client';

const fullSchema = z
  .object({
    id: z.number().int({ message: 'ID must be integer.' }),
    title: z
      .string()
      .trim()
      .min(1, { message: 'Title is required.' })
      .max(255, { message: 'Cannot be greater than 255 characters.' }),
    subTitle: z
      .string()
      .trim()
      .min(1, { message: 'Subtitle is required.' })
      .max(255, 'Cannot be greater than 255 characters.'),
    url: z.string().url({ message: 'Link URL is not a valid URL.' }),
    type: z.enum(
      [DataType.Data, DataType.PDF, DataType.Record, DataType.Video],
      {
        message:
          "Invalid link type. Link type must be one of these: 'Data', 'PDF', 'Record', 'Video'",
      },
    ),
    category: z.enum(
      [
        CategoryType.College,
        CategoryType.Data,
        CategoryType.Summary,
        CategoryType.Questions,
      ],
      {
        message:
          "Invalid category. Category must be one of these: 'College', 'Data', 'Summary', 'Questions'.",
      },
    ),
    lectureId: z.number().int({ message: 'Lecture ID must be an integer.' }),
    notifiable: z.boolean(),

    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

const linkSchema = createModelSchema(
  fullSchema,
  ['title', 'url', 'category', 'type'],
  ['title', 'subTitle', 'url', 'category', 'type', 'lectureId'],
);

// Subtitle should be optional and thus this is the only way to add it
linkSchema.create = z.object({
  ...linkSchema.create.shape,
  subTitle: z
    .string()
    .trim()
    .min(1, { message: 'Subtitle is required.' })
    .max(255, 'Cannot be greater than 255 characters.')
    .optional(),
}) as any;

// --- Type Exports ---
export type LinkWhereInput = z.infer<typeof linkSchema.where>;
export type LinkSelectInput = z.infer<typeof linkSchema.select>;
export type LinkOrderByInput = z.infer<typeof linkSchema.orderBy>;
export type LinkFindInput = z.infer<typeof linkSchema.find>;
export type LinkUpdateInput = z.infer<typeof linkSchema.update>;
export type LinkCreateInput = z.infer<typeof linkSchema.create>;

export default linkSchema;
