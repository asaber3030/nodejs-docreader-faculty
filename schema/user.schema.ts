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

export const userSchemaWhere = userSchema
  .omit({
    devices: true,
  })
  .partial();

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

export const userSchemaUpdate = userSchema.partial().omit({
  id: true,
  googleSubId: true,
  role: true,
  email: true,
  createdAt: true,
  givenName: true,
  familyName: true,
  picture: true,
  devices: true, // TODO: We should be able to update devices
});
export type UserUpdateInput = z.infer<typeof userSchemaUpdate>;
