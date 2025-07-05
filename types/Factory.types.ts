// models/Factory.types.ts

import { ZodObject, ZodSchema } from 'zod';

/**
 * Schema container that holds validation schemas used by factory functions.
 */
export interface FactorySchema<TUpdate = any, TSelect = any> {
  update: ZodSchema<TUpdate>;
  select?: ZodObject<TSelect>;
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
