import db from '../prisma/db';
import { userSchemaSignup, UserSignupInput } from '../schema/user.schema';
import { User as PrismaUser } from '@prisma/client';
import AppError from '../utils/AppError';

class UserModel {
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

  static async findUserById(id: number): Promise<UserModel> {
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

// static async findAll(
//   search: string = '',
//   orderBy: string = 'id',
//   orderType: string = 'desc',
// ) {
//   try {
//     return await db.user.findMany({
//       where: {
//         OR: [{ name: { contains: search } }, { email: { contains: search } }],
//       },
//       select: User.dbSelectors,
//       orderBy: {
//         [orderBy]: orderType,
//       },
//     });
//   } catch (error) {
//     return [];
//   }
// }

// static async find(id: number, select: any = null) {
//   return await db.user.findUnique({
//     where: { id },
//     select: select ? select : User.dbSelectors,
//   });
// }

// static async findBy(value: string, by: FindByField = 'email') {
//   switch (by) {
//     case 'email':
//       return await db.user.findUnique({ where: { email: value } });

//     default:
//       return await db.user.findUnique({ where: { email: value } });
//   }
// }

// static async paginate(
//   search: string = '',
//   skip: number = 0,
//   take: number = 10,
//   orderBy: string = 'id',
//   orderType: string = 'desc',
// ) {
//   try {
//     return await db.user.findMany({
//       where: {
//         OR: [{ name: { contains: search } }, { email: { contains: search } }],
//       },
//       select: User.dbSelectors,
//       skip,
//       take,
//       orderBy: {
//         [orderBy]: orderType,
//       },
//     });
//   } catch (error) {
//     return [];
//   }
// }
