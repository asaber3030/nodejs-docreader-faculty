import db from '../prisma/db';
import {
  UserWhereInput,
  userSchemaWhere,
  userSchemaSignup,
  UserSignupInput,
  FindUsersInput,
  userSchemaFind,
  UserSelectInput,
  UserUpdateInput,
  userSchemaUpdate,
  userSchemaSelect,
} from '../schema/user.schema';
import { User as PrismaUser } from '@prisma/client';
import AppError from '../utils/AppError';
import Model from './Model';
import { parse } from 'path';

class UserModel implements Model {
  private data: Partial<PrismaUser>;

  constructor(data: Partial<PrismaUser>) {
    this.data = data;
  }

  get id() {
    if (this.data.id === undefined)
      throw new AppError('User ID is not available in partial data.', 500);

    return this.data.id;
  }

  get role() {
    if (this.data.role === undefined)
      throw new AppError('User role is not available in partial data.', 500);

    return this.data.role;
  }

  toJSON() {
    return this.data;
  }

  static async create(user: UserSignupInput): Promise<UserModel> {
    const parsedUser = userSchemaSignup.parse(user);

    const userData = await db.user.create({
      data: {
        googleSubId: parsedUser.googleSubId,
        email: parsedUser.email,
        givenName: parsedUser.givenName,
        familyName: parsedUser.familyName,
        picture: parsedUser.picture,
        status: parsedUser.status,
        role: parsedUser.role,
        devices: {
          create: [],
        },
      },
    });

    return new UserModel(userData);
  }

  static async findById(id: number): Promise<UserModel> {
    const userData = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userData) throw new AppError(`Couldn't find user with ID ${id}`, 404);

    return new UserModel(userData);
  }

  static async findByGoogleSubId(sub: string): Promise<UserModel> {
    const userData = await db.user.findUnique({
      where: {
        googleSubId: sub,
      },
    });

    if (!userData)
      throw new AppError(
        `Couldn't find user with google subject ID ${sub}`,
        404,
      );

    return new UserModel(userData);
  }

  static async findMany(queryObj: FindUsersInput): Promise<Array<UserModel>> {
    const query = userSchemaFind.safeParse(queryObj);

    if (!query.success)
      throw new AppError(
        `Invalid query object: ${JSON.stringify(query.error.issues, null, 2)}`,
        400,
      );

    const users = await db.user.findMany({
      where: query.data.where,
      select: query.data.select,
      orderBy: query.data.orderBy,
      skip: query.data.pagination?.skip,
      take: query.data.pagination?.take,
    });

    if (!users)
      throw new AppError(
        `Couldn't find any users based on provided criteria.`,
        404,
      );

    return users.map(user => new UserModel(user));
  }

  static async update(
    id: number,
    updateInput: UserUpdateInput,
    select?: UserSelectInput,
  ) {
    const validated = userSchemaUpdate.safeParse(updateInput);
    const parsedSelect = select ? userSchemaSelect.parse(select) : undefined;

    if (!validated.success)
      throw new AppError(
        `Invalid update input: ${JSON.stringify(
          validated.error.issues,
          null,
          2,
        )}`,
        400,
      );

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      select: parsedSelect,
      data: validated.data,
    });

    if (!updatedUser) {
      throw new AppError(`User with ID ${id} not found.`, 404);
    }

    return new UserModel(updatedUser);
  }
}

export default UserModel;
