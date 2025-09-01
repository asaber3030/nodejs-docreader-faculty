import AppError from '../utils/AppError';
import {
  FactorySchema,
  PrismaUpdateModel,
  PrismaDeleteModel,
  PrismaFindManyModel,
  PrismaFindUniqueModel,
  PrismaCreateModel,
  CommonModel,
} from '../types/Factory.types';
import { QueryParamsService } from '../utils/QueryParamsService';

export class ModelFactory {
  static createOne<
    TCreateInput,
    TCreateResult,
    TInstance,
    TClass extends CommonModel,
  >(
    prismaModel: PrismaCreateModel<TCreateResult>,
    schema: FactorySchema<any, any, any, TCreateInput>,
    wrap?: (data: TCreateResult) => TInstance,
  ) {
    return async function (
      this: TClass,
      data: TCreateInput,
      queryParams: any,
    ): Promise<TInstance | TCreateResult> {
      const validatedCreationBody = schema.create.safeParse(data);

      if (!validatedCreationBody.success) {
        throw new AppError(
          `Invalid create input: [ ${validatedCreationBody.error.issues.map(
            issue => issue.message,
          )} ]`,
          400,
        );
      }

      const validatedQueryParams: any = QueryParamsService.parse<
        typeof schema.query
      >(schema, queryParams, {
        projection: true,
      });

      const created = await prismaModel.create({
        data,
        select: validatedQueryParams.select,
      });

      return wrap ? wrap(created) : created;
    };
  }

  static findMany<
    TFindInput,
    TFindResult,
    TInstance,
    TClass extends CommonModel,
  >(
    prismaModel: PrismaFindManyModel<TFindResult>,
    schema: FactorySchema<TFindInput>,
    wrap?: (data: TFindResult) => TInstance,
  ) {
    return async function (
      this: TClass,
      where: TFindInput,
      queryParams: any,
    ): Promise<Array<TInstance> | Array<TFindResult>> {
      const validatedWhere = schema.where.safeParse(where);

      if (validatedWhere.error)
        throw new AppError(
          `Invalid filter object. Issues: [ ${validatedWhere.error.issues.map(
            issue => issue.message,
          )} ]`,
          400,
        );

      const validatedQueryParams: any = QueryParamsService.parse<
        typeof schema.query
      >(schema, queryParams, {
        pagination: true,
        projection: true,
        sorting: true,
        joining: true,
      });

      let objects: any = {};

      if (validatedQueryParams.include)
        objects = await prismaModel.findMany({
          where: validatedWhere.data,
          include: validatedQueryParams.include,
          orderBy: validatedQueryParams.orderBy,
          skip: validatedQueryParams.skip,
          take: validatedQueryParams.take,
        });
      else
        objects = await prismaModel.findMany({
          where: validatedWhere.data,
          select: validatedQueryParams.select,
          orderBy: validatedQueryParams.orderBy,
          skip: validatedQueryParams.skip,
          take: validatedQueryParams.take,
        });

      return wrap ? objects.map((object: any) => wrap(object)) : objects;
    };
  }

  static findOneById<
    TFindInput,
    TFindResult,
    TInstance,
    TClass extends CommonModel,
  >(
    prismaModel: PrismaFindUniqueModel<TFindResult>,
    schema: FactorySchema<TFindInput>,
    wrap: (data: TFindResult) => TInstance,
  ) {
    return async function (
      this: TClass,
      id: number,
      queryParams: any,
    ): Promise<TFindResult | TInstance> {
      if (Number.isNaN(id))
        throw new AppError(
          `Invalid ID for ${this.modelName}. ID must be a valid integer.`,
          400,
        );

      const validatedQueryParams: any = QueryParamsService.parse<
        typeof schema.query
      >(schema, queryParams, { projection: true, joining: true });

      let object: any = {};

      if (validatedQueryParams.include)
        object = await prismaModel.findUnique({
          where: {
            id,
          },
          include: validatedQueryParams.include,
        });
      else
        object = await prismaModel.findUnique({
          where: {
            id,
          },
          select: validatedQueryParams.select,
        });

      if (!object)
        throw new AppError(
          `${this.capitalizedModelName} with ID ${id} was not found.`,
          404,
        );

      return wrap ? wrap(object) : object;
    };
  }

  static findCreatorIdById<TClass extends CommonModel>(prismaModel: {
    findUnique: (args: {
      where: { id: number };
      select: { creatorId: true };
    }) => Promise<{ creatorId: number | null } | null>;
  }) {
    return async function (this: TClass, id: number): Promise<number> {
      if (!Number.isInteger(id))
        throw new AppError(
          `Invalid ID for ${this.modelName}. ID must be a valid integer.`,
          400,
        );

      const object = await prismaModel.findUnique({
        where: {
          id,
        },
        select: { creatorId: true },
      });

      if (!object)
        throw new AppError(
          `${this.capitalizedModelName} with ID ${id} was not found.`,
          404,
        );

      // 0 means no creatorId set (for old resources)
      if (object?.creatorId === null) return 0;

      return object.creatorId;
    };
  }

  static updateOne<
    TUpdateInput,
    TUpdateResult,
    TInstance,
    TClass extends CommonModel,
  >(
    prismaModel: PrismaUpdateModel<TUpdateResult>,
    schema: FactorySchema<TUpdateInput>,
    wrap?: (data: TUpdateResult) => TInstance,
  ) {
    return async function (
      this: TClass,
      id: number,
      update: TUpdateInput,
      queryParams: any, // Comes from req.query
    ): Promise<TInstance | TUpdateResult> {
      if (!Number.isInteger(id))
        throw new AppError(
          `Invalid ID for ${this.modelName}. ID must be a valid integer.`,
          400,
        );

      const validatedUpdate = schema.update.safeParse(update);

      if (!validatedUpdate.success) {
        throw new AppError(
          `Invalid update input: [ ${validatedUpdate.error.issues.map(
            issue => issue.message,
          )} ]`,
          400,
        );
      }

      const validatedQueryParams: any = QueryParamsService.parse<
        typeof schema.query
      >(schema, queryParams, { projection: true }); // Both parses and validates

      const updated = await prismaModel.update({
        where: { id },
        data: validatedUpdate.data,
        select: validatedQueryParams.select,
      });

      if (!updated) {
        throw new AppError(
          `${this.capitalizedModelName} with ID ${id} was not found.`,
          404,
        );
      }

      return wrap ? wrap(updated) : updated;
    };
  }

  static deleteOne<TDeleteResult, TInstance, TClass extends CommonModel>(
    prismaModel: PrismaDeleteModel<TDeleteResult>,
    wrap?: (data: TDeleteResult) => TInstance,
  ) {
    return async function (
      this: TClass,
      id: number,
    ): Promise<TInstance | TDeleteResult> {
      const result = await prismaModel.delete({
        where: { id },
      });

      return wrap ? wrap(result) : result;
    };
  }
}
