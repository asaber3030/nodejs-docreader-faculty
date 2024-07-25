import { Request, Response } from "express"
import { TQueryParameters } from "../../types"

import { subjectSchema } from "../../schema"
import { badRequest, conflict, notFound, send, unauthorized } from "../../utlis/responses"
import { extractErrors, parameterExists } from "../../utlis/helpers"

import db from "../../utlis/db"
import AuthController from "./AuthController"

export default class SubjectController {
  
  async get(req: Request, res: Response) {
    
    const moduleId = req.params.moduleId ? +req.params.moduleId : null
    if (!moduleId) return badRequest(res, "Invalid Year Id")

    const findModule = await db.module.findUnique({ where: { id: moduleId } })
    if (!findModule) return notFound(res, "Module doesn't exist.")

    const user = await AuthController.user(req, res)
    if (!user) return unauthorized(res)

    if (findModule.yearId !== user?.yearId) { 
      return unauthorized(res)
    }

    const { search, orderBy, orderType }: TQueryParameters = req.query as any
    
    const subjects = await db.moduleSubject.findMany({
      where: { 
        moduleId,
        name: { contains: search }
      },
      orderBy: { [orderBy]: orderType }
    })

    return res.status(200).json({
      data: subjects,
      message: "Module Subjects data",
      status: 200
    })
  }

  async createSubject(req: Request, res: Response) {
    const moduleId = req.params.moduleId ? +req.params.moduleId : null
    if (!moduleId) return badRequest(res, "Invalid Year Id")

    const parsedBody = subjectSchema.create.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findSubject = await db.moduleSubject.findFirst({
      where: { moduleId, name: parsedBody.data.name }
    })
    if (findSubject) return conflict(res, "Module already exists.")
    
    const newSubject = await db.moduleSubject.create({
      data: {
        moduleId,
        ...parsedBody.data
      }
    })
    return send(res, "Subject has been created", 201, newSubject)
  }
  
  async getSubject(req: Request, res: Response) {
    const subjectId = parameterExists(req, res, "subjectId")

    const subject = await db.moduleSubject.findUnique({
      where: { id: subjectId }
    })
    if (!subject) return notFound(res, "Module doesn't exist.")
    return send(res, "Subject data", 200, subject)
  }

  async getSubjectLectures(req: Request, res: Response) {
    const moduleId = parameterExists(req, res, "moduleId")
    const subjectId = parameterExists(req, res, "subjectId")

    const lectures = await db.dataCategory.findMany({
      include: {
        subjectLectures: { where: { subjectId } }
      }
    })

    return send(res, "Module subjects", 200, lectures)
  }

  async getSubjectFinalRevisions(req: Request, res: Response) {
    const moduleId = parameterExists(req, res, "moduleId")
    const subjectId = parameterExists(req, res, "subjectId")

    const finalRevisions = await db.dataCategory.findMany({
      include: {
        subjectFinalRevisions: { where: { subjectId } }
      }
    })

    return send(res, "Module subjects", 200, finalRevisions)
  }

  async getSubjectPractical(req: Request, res: Response) {
    const moduleId = parameterExists(req, res, "moduleId")
    const subjectId = parameterExists(req, res, "subjectId")

    const practical = await db.dataCategory.findMany({
      include: {
        subjectPractical: { where: { subjectId } }
      }
    })
    return send(res, "Module subjects", 200, practical)
  }

  async updateSubject(req: Request, res: Response) {

    const moduleId = parameterExists(req, res, "moduleId")
    const subjectId = parameterExists(req, res, "subjectId")
   
    const parsedBody = subjectSchema.update.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findSubject = await db.moduleSubject.findFirst({
      where: { 
        moduleId,
        name: parsedBody.data.name,
        AND: [
          { id: { not: moduleId } }
        ]
      }
    })
    if (findSubject) return conflict(res, "Subject already exists.")
    
    const updatedSubject = await db.moduleSubject.update({
      where: { id: moduleId },
      data: parsedBody.data
    })
    return send(res, "Module has been updated", 200, updatedSubject)
  }

  async deleteModule(req: Request, res: Response) {
    const yearId = req.params.yearId ? +req.params.yearId : null
    if (!yearId) return badRequest(res, "Invalid Year Id")

    const moduleId = req.params.moduleId ? +req.params.moduleId : null
    if (!moduleId) return badRequest(res, "Invalid Module Id")

    const deletedModule = await db.module.delete({ where: { id: moduleId } })
    return send(res, "Module has been deleted", 200, deletedModule)
  }
 
}