import { z, ZodObject, ZodRawShape } from 'zod';
import { paginationSchema } from './pagination.schema';

export default function createModelSchema<
  T extends ZodRawShape,
  Create extends readonly (keyof T)[],
  Update extends readonly (keyof T)[],
>(fullSchema: ZodObject<T>, createKeys: Create, updateKeys: Update) {
  type CreateShape = Pick<T, Create[number]>;
  type UpdateShape = Pick<T, Update[number]>;

  const keys = Object.keys(fullSchema.shape) as (keyof T)[];

  const select = z
    .object(
      Object.fromEntries(keys.map(k => [k, z.boolean().optional()])) as {
        [K in keyof T]: z.ZodOptional<z.ZodBoolean>;
      },
    )
    .strict();

  const orderBy = z
    .object(
      Object.fromEntries(
        keys.map(k => [k, z.enum(['asc', 'desc']).optional()]),
      ) as {
        [K in keyof T]: z.ZodOptional<z.ZodEnum<['asc', 'desc']>>;
      },
    )
    .strict();

  const createShape = Object.fromEntries(
    createKeys.map(k => [k, fullSchema.shape[k]]),
  ) as CreateShape;

  const updateShape = Object.fromEntries(
    updateKeys.map(k => [k, fullSchema.shape[k]]),
  ) as UpdateShape;

  return {
    where: fullSchema.partial().strict(),
    select,
    orderBy,
    find: z
      .object({
        where: fullSchema.partial().optional(),
        select: select.optional(),
        orderBy: orderBy.optional(),
        pagination: paginationSchema.optional(),
      })
      .strict(),
    create: z.object(createShape).required().strict(),
    update: z.object(updateShape).partial().strict(),
  };
}
