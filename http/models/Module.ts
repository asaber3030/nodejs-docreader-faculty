import db, { findSubjectMany } from '../../utils/db';

import { moduleSchema } from '../../schema';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export default class Module {
  static dbSelectors = {
    id: true,
    name: true,
    icon: true,
    yearId: true,
    createdAt: true,
    updatedAt: true,
  };

  static async create(data: Prisma.ModuleCreateInput) {
    await db.module.create({
      data,
    });
  }

  static async findAll(
    search: string = '',
    orderBy: string = 'id',
    orderType: string = 'desc',
  ) {
    try {
      return await db.module.findMany({
        where: {
          OR: [{ name: { contains: search } }],
        },
        select: Module.dbSelectors,
        orderBy: {
          [orderBy]: orderType,
        },
      });
    } catch (error) {
      return [];
    }
  }

  static async find(id: number, select: any = null) {
    return await db.module.findUnique({
      where: { id },
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
      return await db.module.findMany({
        where: {
          OR: [{ name: { contains: search } }],
        },
        select: Module.dbSelectors,
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
