import db from '../prisma/db';
import { userSchemaSignup, UserSignupInput } from '../schema/user.schema';
import { User as PrismaUser } from '@prisma/client';
import AppError from '../utils/AppError';
import Model from './Model';

class UserModel implements Model {
  private data: PrismaUser;

  constructor(data: PrismaUser) {
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get role() {
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
}

export default UserModel;
