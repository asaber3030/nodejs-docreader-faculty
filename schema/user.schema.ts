import { z } from 'zod';
import { deviceSchema } from './device.schema';

export const userSchema = z.object({
  googleSubId: z.string({ message: 'Invalid Google subject identifier.' }),
  givenName: z.string({ message: 'First name not provided.' }),
  familyName: z.string({ message: 'Family name not provided.' }),
  email: z.string().trim().email({ message: 'Invalid Email.' }),
  picture: z.string().url({ message: 'Invalid picture URL.' }),
  status: z.boolean({ message: 'Invalid status.' }).default(false),
  role: z.enum(['Admin', 'User'], {
    message: "Role must be either 'Admin' or 'User'.",
  }),
  facultyId: z.number().gt(0),
  yearId: z.number().gt(0),
  devices: deviceSchema.array(),
  createdAt: z
    .date({ message: 'Invalid creation date.' })
    .default(new Date(Date.now())),
  updatedAt: z
    .date({ message: 'Invalid update date.' })
    .default(new Date(Date.now())),
});

export type User = z.infer<typeof userSchema>;

export const userSchemaLogin = userSchema.partial({
  email: true,
});

export type UserLoginInput = z.infer<typeof userSchemaLogin>;

export const userSchemaSignup = userSchema.partial({
  createdAt: true,
  updatedAt: true,
  devices: true,
  facultyId: true,
  yearId: true,
});

export type UserSignupInput = z.infer<typeof userSchemaSignup>;

export const userSchema2 = {
  createAdmin: z
    .object({
      passcode: z.string().min(1, { message: 'Passcode Cannot be empty' }),
      name: z
        .string()
        .trim()
        .min(1, { message: 'Name cannot be less than 1 characters.' }),
      email: z.string().trim().email({ message: 'Invalid Email.' }),
      password: z
        .string()
        .min(8, { message: 'Password cannot be less than 8 characters.' }),
      confirmationPassword: z
        .string()
        .min(8, { message: 'Password cannot be less than 8 characters.' }),
      facultyId: z.number().gt(0),
      yearId: z.number().gt(0),
    })
    .superRefine(({ confirmationPassword, password }, ctx) => {
      if (confirmationPassword !== password) {
        ctx.addIssue({
          code: 'custom',
          message: 'The passwords did not match',
          path: ['confirmationPassword'],
        });
      }
    }),

  update: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Name cannot be less than 1 characters.' })
      .optional(),
    facultyId: z
      .number()
      .gt(0, { message: 'facultyId cannot be zero.' })
      .optional(),
    yearId: z.number().gt(0, { message: 'yearId cannot be zero.' }).optional(),
  }),

  registerDevice: z.object({
    token: z.string(),
  }),
};
