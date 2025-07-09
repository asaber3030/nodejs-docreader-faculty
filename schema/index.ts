import { z } from 'zod';

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
