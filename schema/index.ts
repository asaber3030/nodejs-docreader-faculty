import { CategoryType, DataType, LectureType } from '@prisma/client';
import { z } from 'zod';

export const categorySchema = {
  update: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Name is required' })
      .max(255, { message: 'Cannot be greater than 255 characters' })
      .optional(),
    keywords: z
      .string()
      .trim()
      .min(1, { message: "Keywords is required. Separate them with ',' " })
      .max(255, { message: 'Cannot be greater than 255 characters' })
      .optional(),
    icon: z.string().url({ message: 'Icon must be a URL.' }).optional(),
  }),

  create: z.object({
    name: z
      .string()
      .trim()
      .max(255, { message: 'Cannot be greater than 255 characters' }),
    keywords: z
      .string()
      .max(255, { message: 'Cannot be greater than 255 characters' }),
    icon: z.string().url({ message: 'Icon must be a URL.' }).optional(),
  }),
};

export const subjectSchema = {
  create: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    icon: z.string(),
  }),

  update: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    icon: z.any().optional(),
    moduleId: z.number().optional(),
  }),
};

export const subjectLecture = {
  create: z.object({
    title: z
      .string()
      .min(1, { message: 'Title must be at least 1 character.' }),
    subTitle: z
      .string()
      .min(1, { message: 'Sub title must be at least 1 character.' })
      .optional(),
    date: z.coerce.date({ message: 'Please provide a date' }),
    type: z.enum(
      [LectureType.Normal, LectureType.Practical, LectureType.FinalRevision],
      {
        message:
          "Only support this types: 'Normal', 'Practical', 'FinalRevision'",
      },
    ),
    subjectId: z.number(),
  }),

  update: z.object({
    title: z
      .string()
      .min(1, { message: 'Title must be at least 1 character.' })
      .optional(),
    subTitle: z
      .string()
      .min(1, { message: 'Sub title must be at least 1 character.' })
      .optional(),
    date: z.coerce.date({ message: 'Please provide a date' }).optional(),
    type: z
      .enum(
        [LectureType.Normal, LectureType.Practical, LectureType.FinalRevision],
        {
          message:
            "Only support this types: 'Normal', 'Practical', 'FinalRevision'",
        },
      )
      .optional(),
    subjectId: z.number().optional(),
  }),
};

export const linkSchema = {
  create: z.object({
    title: z
      .string()
      .min(1, { message: 'Title cannot be less than 1 characters.' }),
    subTitle: z.string().optional(),
    url: z.string().url(),
    category: z.enum(
      [
        CategoryType.College,
        CategoryType.Data,
        CategoryType.Summary,
        CategoryType.Questions,
      ],
      { message: 'Invalid category choose from: College, Data, Summary' },
    ),
    type: z.enum(
      [DataType.PDF, DataType.Record, DataType.Video, DataType.Data],
      { message: 'Invalid category choose from: PDF, Video, Record, Data' },
    ),
  }),

  update: z.object({
    title: z
      .string()
      .min(1, { message: 'Title cannot be less than 1 characters.' })
      .optional(),
    subTitle: z.string().optional(),
    url: z.string().url().optional(),
    category: z
      .enum(
        [
          CategoryType.College,
          CategoryType.Data,
          CategoryType.Summary,
          CategoryType.Questions,
        ],
        {
          message: 'Invalid category choose from: College, Data, Summary',
        },
      )
      .optional(),
    type: z
      .enum([DataType.PDF, DataType.Record, DataType.Video, DataType.Data], {
        message: 'Invalid category choose from: PDF, Video, Record, Data',
      })
      .optional(),
    lectureId: z.number().optional(),
  }),
};

export const notificationSchema = {
  notify: z.object({
    links: z.array(z.number()),
    quizzes: z.array(z.number()),
  }),
  ignore: z.object({
    links: z.array(z.number()),
    quizzes: z.array(z.number()),
  }),
};

export const quizSchema = {
  quiz: {
    create: z.object({
      title: z.string().min(1, { message: 'Title is required' }),
    }),
    update: z.object({
      title: z.string().min(1, { message: 'Title is required' }),
    }),
  },
  question: {
    create: z.array(
      z.object({
        image: z.string().optional(),
        explanation: z.string().optional(),
        text: z.string().min(1, { message: 'Text is required' }),
        options: z.array(z.string()),
        correctOptionIndex: z.number().min(0),
      }),
    ),
    update: z.object({
      image: z.string().optional(),
      explanation: z.string().optional(),
      text: z.string().min(1, { message: 'Text is required' }).optional(),
      options: z.array(z.string()).optional(),
      correctOptionIndex: z.number().min(0).optional(),
    }),
  },
};
