import z, { ZodObject, ZodBoolean, ZodOptional } from 'zod';
import { ZodSchema } from 'zod';

export type ValidationSchema = {
  where: ZodSchema;
  readonly select: Record<string, ZodBoolean | ZodOptional<ZodBoolean>>;
  readonly orderBy: Record<string, z.ZodOptional<z.ZodEnum<['asc', 'desc']>>>;
  readonly find: ZodObject<any>;
  update: ZodSchema;
  create: ZodSchema;
};
