import { Request, Response } from "express"
import { UserRole } from "@prisma/client"

import { subjectLecture, subjectSchema } from "../../schema"
import { badRequest, conflict, notFound, send, unauthorized, validationErrors } from "../../utlis/responses"
import { extractErrors, parameterExists } from "../../utlis/helpers"

import db from "../../utlis/db"
import AuthController from "./AuthController"

export default class SubjectController {
  
  async get(req: Request, res: Response) {

    const user = await AuthController.user(req, res)
    
    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")

    const findSubject = await db.subject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")

    const findModule = await db.module.findUnique({ where: { id: findSubject.moduleId } })
    if (findModule?.yearId !== user?.yearId) return unauthorized(res)

    const subject = await db.subject.findUnique({ where: { id: subjectId } })

    return res.status(200).json({
      data: subject,
      message: `subjectId [${subjectId}] - Data`,
      status: 200
    })
  }

  async getLectures(req: Request, res: Response) {
    const user = await AuthController.user(req, res)
    
    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")

    const findSubject = await db.subject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")

    const findModule = await db.module.findUnique({ where: { id: findSubject.moduleId } })
    if (findModule?.yearId !== user?.yearId) return unauthorized(res)

    const lectures = await db.lectureData.findMany({ where: { subjectId } })

    return res.status(200).json({
      data: lectures,
      message: `subjectId [${subjectId}] - Lectures Data`,
      status: 200
    })
  }

  async getPractical(req: Request, res: Response) {
    const user = await AuthController.user(req, res)
    
    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")

    const findSubject = await db.subject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")

    const findModule = await db.module.findUnique({ where: { id: findSubject.moduleId } })
    if (findModule?.yearId !== user?.yearId) return unauthorized(res)

    const practicalData = await db.subject.findUnique({
      where: { id: subjectId },
      select: { id: true, practical: true }
    })

    return res.status(200).json({
      data: practicalData?.practical,
      message: `subjectId [${subjectId}] - practicalData Data`,
      status: 200
    })
  }

  async getFinalRevision(req: Request, res: Response) {
    const user = await AuthController.user(req, res)
    
    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")

    const findSubject = await db.subject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")

    const findModule = await db.module.findUnique({ where: { id: findSubject.moduleId } })
    if (findModule?.yearId !== user?.yearId) return unauthorized(res)

    const finalRevisionData = await db.subject.findUnique({
      where: { id: subjectId },
      select: { id: true, finalRevision: true }
    })

    return res.status(200).json({
      data: finalRevisionData?.finalRevision,
      message: `subjectId [${subjectId}] - Final Revision Data Data`,
      status: 200
    })
  }

  async updateSubject(req: Request, res: Response) {

    const user = await AuthController.user(req, res)
    if (user?.role !== UserRole.Admin) return unauthorized(res, "Unauthorized - Admin Role Required.")
    
    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")

    const subject = await db.subject.findUnique({ where: { id: subjectId } })
    if (!subject) return notFound(res, "Subject doesn't exist.")

    const findModule = await db.module.findUnique({ where: { id: subject.moduleId } })
    if (findModule?.yearId !== user?.yearId) return unauthorized(res)
   
    const parsedBody = subjectSchema.update.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findSubject = await db.subject.findFirst({
      where: { 
        name: parsedBody.data.name,
        AND: [{ id: { not: subjectId } }]
      }
    })
    if (findSubject) return conflict(res, "Subject already exists.")
    
    const updatedSubject = await db.subject.update({
      where: { id: subjectId },
      data: parsedBody.data
    })

    return send(res, "Subject has been updated", 200, updatedSubject)
  }

  async deleteSubject(req: Request, res: Response) {
    
    const user = await AuthController.user(req, res)
    if (user?.role !== UserRole.Admin) return unauthorized(res, "Unauthorized - Admin Role Required.")
    
    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")

    const subject = await db.subject.findUnique({ where: { id: subjectId } })
    if (!subject) return notFound(res, "Subject doesn't exist.")

    const findModule = await db.module.findUnique({ where: { id: subject.moduleId } })
    if (findModule?.yearId !== user?.yearId) return unauthorized(res)

    const deletedSubject = await db.subject.delete({ where: { id: subjectId } })
    return send(res, "Subject has been deleted", 200, deletedSubject)
  }

  async createLecture(req: Request, res: Response) {
    const body = subjectLecture.create.safeParse(req.body)
    if (!body.success) return validationErrors(res, extractErrors(body))
  
    const data = body.data
    const user = await AuthController.user(req, res)
    if (user?.role !== UserRole.Admin) return unauthorized(res, "Unauthorized - Admin Role Required.")
    
    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")

    const subject = await db.subject.findUnique({ where: { id: subjectId } })
    if (!subject) return notFound(res, "Subject doesn't exist.")

    const findModule = await db.module.findUnique({ where: { id: subject.moduleId } })
    if (findModule?.yearId !== user?.yearId) return unauthorized(res)

    const newLecture = await db.lectureData.create({
      data: { subjectId, ...data }
    })

    return send(res, "Lecture has been created.", 201, newLecture)

  }
}