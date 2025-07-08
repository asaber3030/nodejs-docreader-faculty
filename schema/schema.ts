import { z, ZodObject, ZodRawShape, ZodOptional, ZodTypeAny } from 'zod';
import { paginationSchema } from './pagination.schema';

export default function createModelSchema<
  T extends ZodRawShape,
  Create extends readonly (keyof T)[],
  OptionalCreate extends readonly (keyof T)[],
  Update extends readonly (keyof T)[],
>(
  fullSchema: ZodObject<T>,
  create: {
    required: Create;
    optional: OptionalCreate;
  },
  updateKeys: Update,
) {
  type CreateShape = { [K in Create[number]]: T[K] };
  type OptionalCreateShape = {
    [K in OptionalCreate[number]]: ZodOptional<T[K]>;
  };
  type UpdateShape = { [K in Update[number]]: T[K] };

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

  // Strongly typed helper for required fields
  const requiredCreateShape = create.required.reduce((acc, key) => {
    acc[key] = fullSchema.shape[key];
    return acc;
  }, {} as CreateShape);

  // Strongly typed helper for optional fields
  const optionalCreateShape = create.optional.reduce((acc, key) => {
    acc[key] = fullSchema.shape[key].optional();
    return acc;
  }, {} as OptionalCreateShape);

  const mergedCreateShape: CreateShape & OptionalCreateShape = {
    ...requiredCreateShape,
    ...optionalCreateShape,
  };

  const updateShape = updateKeys.reduce((acc, key) => {
    acc[key] = fullSchema.shape[key];
    return acc;
  }, {} as UpdateShape);

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
    create: z.object(mergedCreateShape).strict(),
    update: z.object(updateShape).partial().strict(),
  };
}
