import z from 'zod';
import createModelSchema from './schema';
import { LectureType } from '@prisma/client';

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
    subjectId: z.number().int({ message: 'Subject ID must be an integer.' }),
    type: z.enum(
      [LectureType.Normal, LectureType.Practical, LectureType.FinalRevision],
      {
        message:
          "Lecture type can only be: 'Normal', 'Practical', or 'FinalRevision'",
      },
    ),
    date: z.date({ message: 'Lecture date is required.' }),

    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

const lectureSchema = createModelSchema(
  fullSchema,
  ['title', 'subjectId', 'date', 'type'],
  ['title', 'subTitle', 'subjectId', 'date', 'type'],
);

// Subtitle should be optional and thus this is the only way to add it
lectureSchema.create = z.object({
  ...lectureSchema.create.shape,
  subTitle: z
    .string()
    .trim()
    .min(1, { message: 'Subtitle is required.' })
    .max(255, 'Cannot be greater than 255 characters.')
    .optional(),
}) as any;

// --- Type Exports ---
export type LectureWhereInput = z.infer<typeof lectureSchema.where>;
export type LectureSelectInput = z.infer<typeof lectureSchema.select>;
export type LectureOrderByInput = z.infer<typeof lectureSchema.orderBy>;
export type LectureFindInput = z.infer<typeof lectureSchema.find>;
export type LectureUpdateInput = z.infer<typeof lectureSchema.update>;
export type LectureCreateInput = z.infer<typeof lectureSchema.create>;

export default lectureSchema;
