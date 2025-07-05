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
import { User as PrismaUser, Role as PrismaRole } from '@prisma/client';
import AppError from '../utils/AppError';
import RoleModel from './Role';

type PartialUserWithRole = Partial<PrismaUser> & {
  role?: PrismaRole;
};

class UserModel {
  private data: Partial<PartialUserWithRole>;

  private roleModel?: RoleModel;

  constructor(data: PartialUserWithRole) {
    this.data = data;

    if (!this.data.id)
      throw new AppError('Cannot create user without ID.', 400);

    if (this.data.role) {
      this.roleModel = new RoleModel(this.data.role);
    } // else left undefined, to be lazily fetched
  }

  get id(): number {
    return this.data.id!;
  }

  get roleId(): number {
    return this.data.roleId!;
  }

  async role(): Promise<RoleModel> {
    if (!this.roleModel)
      this.roleModel = new RoleModel(await RoleModel.findById(this.roleId));

    return this.roleModel;
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
        roleId: parsedUser.roleId,
        devices: {
          create: [],
        },
      },
    });

    return new UserModel(userData);
  }

  static async findOneById(id: number): Promise<UserModel> {
    const userData = await db.user.findUnique({
      where: {
        id: id,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!userData) throw new AppError(`Couldn't find user with ID ${id}`, 404);

    return new UserModel(userData);
  }

  static async findOneByGoogleSubId(sub: string): Promise<UserModel> {
    const userData = await db.user.findUnique({
      where: {
        googleSubId: sub,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
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

    if (users.length === 0)
      throw new AppError(
        `Couldn't find any users based on provided criteria.`,
        404,
      );

    return users.map(user => new UserModel(user));
  }

  static async updateOne(
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

  static async updateRole(userId: number, roleId: number): Promise<UserModel> {
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        roleId: roleId,
      },
    }); // Do not fetch role: if needed, the user will be able to fetch it automatically on first use of role()

    return new UserModel(updatedUser);
  }

  static async deleteOne(id: number): Promise<UserModel> {
    const user = await db.user.delete({
      where: {
        id,
      },
    });

    return new UserModel(user);
  }
}

export default UserModel;
