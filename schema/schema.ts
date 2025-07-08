import { z, ZodObject, ZodRawShape, ZodOptional } from 'zod';
import { paginationSchema } from './pagination.schema';

export default function createModelSchema<
  T extends ZodRawShape,
  RK extends keyof T,
  OK extends keyof T = never,
  UK extends keyof T = never,
>(
  fullSchema: ZodObject<T>,
  create: {
    required: readonly RK[];
    optional?: readonly OK[];
  },
  update: readonly UK[],
) {
  // Normalize all keys as keyof T
  const requiredKeys = create.required as readonly (keyof T)[];
  const optionalKeys = (create.optional ?? []) as readonly (keyof T)[];
  const updateKeys = update as readonly (keyof T)[];

  // Exclude overlap: only keep optional keys that aren't required
  const requiredSet = new Set(requiredKeys);
  const filteredOptionalKeys = optionalKeys.filter(
    key => !requiredSet.has(key),
  );

  // --- Build CREATE schema ---
  const requiredObject = z
    .object(
      Object.fromEntries(
        requiredKeys.map(key => [key, fullSchema.shape[key]]),
      ) as { [K in RK]: T[K] },
    )
    .required();

  const optionalObject = z
    .object(
      Object.fromEntries(
        filteredOptionalKeys.map(key => [key, fullSchema.shape[key]]),
      ) as { [K in OK]: T[K] },
    )
    .partial();

  const createSchema = requiredObject.merge(optionalObject).strict();

  // --- Build UPDATE schema ---
  const updateShape = Object.fromEntries(
    updateKeys.map(key => [key, fullSchema.shape[key]]),
  ) as { [K in UK]: T[K] };

  const updateSchema = z.object(updateShape).partial().strict();

  // --- Build SELECT and ORDERBY ---
  const allKeys = Object.keys(fullSchema.shape) as (keyof T)[];

  const select = z
    .object(
      Object.fromEntries(allKeys.map(k => [k, z.boolean().optional()])) as {
        [K in keyof T]: ZodOptional<z.ZodBoolean>;
      },
    )
    .strict();

  const orderBy = z
    .object(
      Object.fromEntries(
        allKeys.map(k => [k, z.enum(['asc', 'desc']).optional()]),
      ) as {
        [K in keyof T]: ZodOptional<z.ZodEnum<['asc', 'desc']>>;
      },
    )
    .strict();

  // --- Build FIND schema ---
  const find = z
    .object({
      where: fullSchema.partial().optional(),
      select: select.optional(),
      orderBy: orderBy.optional(),
      pagination: paginationSchema.optional(),
    })
    .strict();

  // --- Return all model schemas ---
  return {
    where: fullSchema.partial().strict(),
    select,
    orderBy,
    find,
    create: createSchema,
    update: updateSchema,
  };
}
