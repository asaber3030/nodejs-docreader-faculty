import db from '../prisma/db';
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';
import {
  FactorySchema,
  PrismaUpdateModel,
  PrismaDeleteModel,
} from '../types/Factory.types';

export class ModelFactory {
  static findOneById();

  static updateOne<TUpdateInput, TUpdateResult, TInstance>(
    prismaModel: PrismaUpdateModel<TUpdateResult>,
    schema: FactorySchema<TUpdateInput>,
    wrap?: (data: TUpdateResult) => TInstance,
  ) {
    return async (
      id: number,
      update: TUpdateInput,
      select?: Record<string, boolean>,
    ): Promise<TInstance | TUpdateResult> => {
      const validatedUpdate = schema.update.safeParse(update);
      const validatedSelect =
        schema.select && select ? schema.select.parse(select) : undefined;

      if (!validatedUpdate.success) {
        throw new AppError(
          `Invalid update input: ${JSON.stringify(
            validatedUpdate.error.issues,
            null,
            2,
          )}`,
          400,
        );
      }

      const updated = await prismaModel.update({
        where: { id },
        data: validatedUpdate.data,
        select: validatedSelect,
      });

      if (!updated) {
        throw new AppError(`Record with ID ${id} not found.`, 404);
      }

      return wrap ? wrap(updated) : updated;
    };
  }

  static deleteOne<TDeleteResult, TInstance>(
    prismaModel: PrismaDeleteModel<TDeleteResult>,
    wrap?: (data: TDeleteResult) => TInstance,
  ) {
    return async (id: number): Promise<TInstance | TDeleteResult> => {
      const result = await prismaModel.delete({
        where: { id },
      });

      return wrap ? wrap(result) : result;
    };
  }
}
