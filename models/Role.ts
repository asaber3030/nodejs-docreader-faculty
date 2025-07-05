import db from '../prisma/db';
import { Role as PrismaRole } from '@prisma/client';
import AppError from '../utils/AppError';

export default class RoleModel {
  private data: Partial<PrismaRole>;

  public static rolePermissionMap: Record<string, Set<string>> =
    Object.create(null);

  public hasPermission(permission: string): boolean {
    const perms = RoleModel.rolePermissionMap[this.name];
    if (!perms) return false;
    return perms.has('*') || perms.has(permission);
  }

  public getPermissions(): string[] {
    return Array.from(RoleModel.rolePermissionMap[this.name] ?? []);
  }

  public static async refreshPermissionCache() {
    const roles = await db.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Clear existing cache
    Object.keys(RoleModel.rolePermissionMap).forEach(
      key => delete RoleModel.rolePermissionMap[key],
    );

    // Rebuild map
    for (const role of roles) {
      RoleModel.rolePermissionMap[role.name] = new Set(
        role.permissions.map(rp => rp.permission.name),
      );
    }

    console.log(
      '[Auth] Permission cache refreshed:',
      Object.entries(RoleModel.rolePermissionMap),
    );
  }

  constructor(data: Partial<PrismaRole>) {
    this.data = data;

    if (this.data.id === undefined)
      throw new AppError('Cannot create role without ID.', 500);

    if (this.data.name === undefined)
      throw new AppError('Cannot create role without name.', 500);
  }

  get id(): number {
    return this.data.id!;
  }

  get name(): string {
    return this.data.name!;
  }

  toJSON() {
    return this.data;
  }

  static async findById(id: number): Promise<RoleModel> {
    const roleData = await db.role.findUnique({
      where: {
        id,
      },
    });

    if (!roleData) throw new AppError(`Couldn't find role with ID ${id}`, 404);

    return new RoleModel(roleData);
  }
}
