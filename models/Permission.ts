import db from '../prisma/db';
import Model from './Model';
import { Permission as PrismaPermission } from '@prisma/client';
import AppError from '../utils/AppError';

export default class PermissionModel implements Model {
  private data: PrismaPermission;

  constructor(data: PrismaPermission) {
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  static async findById(id: number): Promise<PermissionModel> {
    const permissionData = await db.role.findUnique({
      where: {
        id: id,
      },
    });

    if (!permissionData)
      throw new AppError(`Couldn't find permission with ID ${id}`, 404);

    return new PermissionModel(permissionData);
  }
}
