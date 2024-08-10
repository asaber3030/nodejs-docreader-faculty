import { FindByField } from "../../types";
import db from "../../utlis/db";

export default class User {

  static dbSelectors = { id: true, name: true, status: true, email: true, role: true, facultyId: true, yearId: true, createdAt: true, updatedAt: true }

  static async findAll(search: string = '', orderBy: string = 'id', orderType: string = 'desc') {
    try {
      return await db.user.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } }
          ]
        },
        select: User.dbSelectors,
        orderBy: {
          [orderBy]: orderType
        }
      })
    } catch (error) {
      return []
    }
  }

  static async find(id: number, select: any = null) {
    return await db.user.findUnique({ 
      where: { id },
      select: select ? select : User.dbSelectors
    })
  }
  
  static async findBy(value: string, by: FindByField = 'email') {
    switch(by) {
      case 'email':
        return await db.user.findUnique({ where: { email: value } })

      default:
        return await db.user.findUnique({ where: { email: value } })
    }
  }

  static async paginate(search: string = '', skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    try {
      return await db.user.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } }
          ]
        },
        select: User.dbSelectors,
        skip,
        take,
        orderBy: {
          [orderBy]: orderType
        }
      })
    } catch (error) {
      return []
    }
  }
  
}