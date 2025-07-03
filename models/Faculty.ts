import db from '../utils/db';

export default class Faculty {
  static dbSelectors = {
    id: true,
    name: true,
    city: true,
    createdAt: true,
    updatedAt: true,
  };

  static async findAll(
    search: string = '',
    orderBy: string = 'id',
    orderType: string = 'asc',
  ) {
    try {
      return await db.faculty.findMany({
        where: {
          OR: [{ name: { contains: search } }],
        },
        include: { years: true },
        orderBy: {
          [orderBy]: orderType,
        },
      });
    } catch (error) {
      return [];
    }
  }

  static async find(id: number, select: any = null) {
    return await db.faculty.findUnique({
      where: { id },
      select: select ? select : Faculty.dbSelectors,
    });
  }

  static async paginate(
    search: string = '',
    skip: number = 0,
    take: number = 10,
    orderBy: string = 'id',
    orderType: string = 'desc',
  ) {
    try {
      return await db.faculty.findMany({
        where: {
          OR: [{ name: { contains: search } }],
        },
        select: Faculty.dbSelectors,
        skip,
        take,
        orderBy: {
          [orderBy]: orderType,
        },
      });
    } catch (error) {
      return [];
    }
  }
}
