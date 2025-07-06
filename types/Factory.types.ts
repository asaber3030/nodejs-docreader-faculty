// models/Factory.types.ts

import { ZodObject, ZodSchema } from 'zod';

/**
 * Schema container that holds validation schemas used by factory functions.
 */
export interface FactorySchema<
  TWhere = any,
  TSelect = any,
  TOrderBy = any,
  TUpdate = any,
  TCreate = any,
> {
  where?: ZodSchema<TWhere>;
  select?: ZodSchema<TSelect>;
  orderBy?: ZodSchema<TOrderBy>;
  update: ZodSchema<TUpdate>;
  create: ZodSchema<TCreate>;
}

/**
 * Prisma update function type for a given model.
 */
export interface PrismaUpdateModel<TUpdateResult> {
  update(args: {
    where: { id: number };
    data: any;
    select?: any;
  }): Promise<TUpdateResult>;
}

/**
 * Prisma delete function type for a given model.
 */
export interface PrismaDeleteModel<TDeleteResult> {
  delete(args: { where: { id: number } }): Promise<TDeleteResult>;
}
