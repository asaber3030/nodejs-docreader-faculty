import db from "../../utlis/db";
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import moment from 'moment'

export default class Verification {

  static dbSelectors = { id: true, name: true, status: true, email: true, role: true, facultyId: true, createdAt: true, updatedAt: true }

  static async create(userId: number) {
    const number = String(crypto.randomInt(0, 1000000))
    const hashedCode = await bcrypt.hash(number, 10)
    await db.userVerificationCode.create({
      data: {
        userId,
        plain: number,
        code: hashedCode,
        expiresIn: moment(moment.now()).add(30, 'm').toDate()
      }
    })
    return number
  }

  static async verify(userId: number, code: string) {
    const user = await db.user.findUnique({ where: { id: userId } })
    const hashedCode = await bcrypt.hash(code, 10)
    const findCode = await db.userVerificationCode.findFirst({
      where: { userId, plain: code }
    })

    if (!findCode) return { findCode, hashedCode, user }

    await db.user.update({
      where: { id: userId },
      data: { status: true }
    })

    return {  }
  }
  
}