import { z } from 'zod';
import { deviceSchema } from './device.schema';
import { paginationSchema } from './pagination.schema';

export const userSchema = z.object({
  id: z.number().optional(),
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

export const userSchemaSignup = userSchema.omit({
  createdAt: true,
  updatedAt: true,
  devices: true,
  facultyId: true,
  yearId: true,
});

export type UserSignupInput = z.infer<typeof userSchemaSignup>;

export const userSchemaWhere = userSchema.omit({
  devices: true,
});

export type UserWhereInput = z.infer<typeof userSchemaWhere>;

export const userSchemaSelect = z.object(
  Object.fromEntries(
    Object.keys(userSchema.shape).map(key => [key, z.boolean().optional()]),
  ),
);

export type UserSelectInput = z.infer<typeof userSchemaSelect>;

export const userSchemaOrderBy = z.object(
  Object.fromEntries(
    Object.keys(userSchema.shape).map(key => [
      key,
      z.enum(['asc', 'desc']).optional(),
    ]),
  ),
);

export type UserOrderByInput = z.infer<typeof userSchemaOrderBy>;

export const userSchemaFind = z.object({
  where: userSchemaWhere.optional(),
  select: userSchemaSelect.optional(),
  orderBy: userSchemaOrderBy.optional(),
  pagination: paginationSchema.optional(),
});

export type FindUsersInput = z.infer<typeof userSchemaFind>;

export const userSchemaUpdate = userSchema.omit({
  id: true,
  googleSubId: true,
  email: true,
  createdAt: true,
  givenName: true,
  familyName: true,
  picture: true,
  devices: true, // TODO: We should be able to update devices
});
export type UserUpdateInput = z.infer<typeof userSchemaUpdate>;

export const userSchema2 = {
  createAdmin: z
    .object({
      passcode: z.boolean().optional(),
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
