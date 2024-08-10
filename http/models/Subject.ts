import db from "../../utlis/db";

export default class Subject {

  static dbSelectors = { id: true, moduleId: true, name: true, icon: true, createdAt: true, updatedAt: true }

  static async findAll(search: string = '', orderBy: string = 'id', orderType: string = 'desc') {
    try {
      return await db.subject.findMany({
        where: {
          OR: [
            { name: { contains: search } }
          ]
        },
        select: Subject.dbSelectors,
        orderBy: {
          [orderBy]: orderType
        }
      })
    } catch (error) {
      return []
    }
  }

  static async find(id: number, select: any = null) {
    return await db.subject.findUnique({ 
      where: { id },
      select: select ? select : Subject.dbSelectors
    })
  }

  static async paginate(search: string = '', skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    try {
      return await db.subject.findMany({
        where: {
          OR: [
            { name: { contains: search } }
          ]
        },
        select: Subject.dbSelectors,
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