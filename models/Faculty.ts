import facultySchema, {
  FacultyFindInput,
  FacultyUpdateInput,
} from '../schema/faculty.schema';
import { Faculty as PrismaFaculty } from '@prisma/client';
import db from '../prisma/db';
import AppError from '../utils/AppError';
import { ModelFactory } from './ModelFactory';

export default class FacultyModel {
  private data: Partial<PrismaFaculty>;

  constructor(data: Partial<PrismaFaculty>) {
    this.data = data;

    if (!this.data.id)
      throw new AppError('Cannot create faculty without ID.', 400);
  }

  toJSON() {
    return this.data;
  }

  static async findMany(findObj: FacultyFindInput) {
    const validatedFind = facultySchema.find.safeParse(findObj);

    if (!validatedFind.success)
      throw new AppError(
        `Invalid query object: ${JSON.stringify(
          validatedFind.error.issues,
          null,
          2,
        )}`,
        400,
      );

    const faculties = await db.faculty.findMany({
      where: validatedFind.data.where,
      select: validatedFind.data.select,
      orderBy: validatedFind.data.orderBy,
      skip: validatedFind.data.pagination?.skip,
      take: validatedFind.data.pagination?.take,
    });

    if (faculties.length === 0)
      throw new AppError(
        `Couldn't find any faculty based on provided criteria.`,
        404,
      );

    return faculties.map(faculty => new FacultyModel(faculty));
  }

  static async findOneById(id: number): Promise<FacultyModel> {
    const facultyData = await db.faculty.findUnique({
      where: {
        id,
      },
    });

    if (!facultyData)
      throw new AppError(`Couldn't find faculty with ID ${id}.`, 404);

    return new FacultyModel(facultyData);
  }

  static updateOne = ModelFactory.updateOne<
    FacultyUpdateInput,
    any,
    FacultyModel
  >(db.faculty, facultySchema, data => new FacultyModel(data));

  static deleteOne = ModelFactory.deleteOne<any, FacultyModel>(
    db.faculty,
    data => new FacultyModel(data),
  );

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
