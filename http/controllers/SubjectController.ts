import { Request, Response } from "express"
import { TQueryParameters } from "../../types"

import { subjectFinalRevision, subjectLecture, subjectPractical, subjectSchema } from "../../schema"
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

    const moduleId = parameterExists(req, res, "moduleId")
    if (!moduleId) return notFound(res, "Module doesn't exist.")

    const module = await db.module.findUnique({ where: { id: moduleId }, select: { id: true } })
    if (!module) return notFound(res, "Module not found.")

    const parsedBody = subjectSchema.create.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findSubject = await db.moduleSubject.findFirst({
      where: { moduleId, name: parsedBody.data.name }
    })
    if (findSubject) return conflict(res, "Subject already exists.")
    
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
      where: { id: subjectId },
      data: parsedBody.data
    })
    return send(res, "Module has been updated", 200, updatedSubject)
  }

  async deleteSubject(req: Request, res: Response) {
    
    const subjectId = parameterExists(req, res, "subjectId")
    const findSubject = await db.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })

    if (!findSubject) return notFound(res)

    const deletedSubject = await db.moduleSubject.delete({ where: { id: subjectId } })
    return send(res, "Module has been deleted", 200, deletedSubject)
  }

  async createLecture(req: Request, res: Response) {
    const body = subjectLecture.create.safeParse(req.body)
    if (!body.success) return send(res, "Validation errors", 400, null, extractErrors(body))
    
    const data = body.data
    const subjectId = parameterExists(req, res, "subjectId")
    
    const findSubject = await db.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res)

    const newLecture = await db.subjectLecture.create({
      data: { ...data, subjectId: findSubject.id },
    })

    return send(res, "Subject Lecture has been created successfully.", 201, newLecture)
  }
  async updateLecture(req: Request, res: Response) {
    const body = subjectLecture.update.safeParse(req.body)
    if (!body.success) return send(res, "Validation errors", 400, null, extractErrors(body))
    
    const data = body.data
    const subjectId = parameterExists(req, res, "subjectId")
    const lectureId = parameterExists(req, res, "lectureId")
    
    const findSubject = await db.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")

    const findLecture = await db.subjectLecture.findUnique({ where: { id: lectureId }, select: { id: true, subjectId: true } })
    if (!findLecture) return notFound(res, "Lecture doesn't exist.")

    const updatedLecture = await db.subjectLecture.update({
      where: { id: lectureId },
      data: { ...data }, 
    })
    return send(res, "Subject Lecture has been updated successfully.", 200, updatedLecture)
  }

  async createPractical(req: Request, res: Response) {
    const body = subjectPractical.create.safeParse(req.body)
    if (!body.success) return send(res, "Validation errors", 400, null, extractErrors(body))
    
    const data = body.data
    const subjectId = parameterExists(req, res, "subjectId")
    
    const findSubject = await db.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res)

    const newSubjectPractical = await db.subjectPractical.create({
      data: { ...data, subjectId: findSubject.id },
    })

    return send(res, "Subject Practical Data has been created successfully.", 201, newSubjectPractical)
  }

  async updatePractical(req: Request, res: Response) {
    const body = subjectPractical.update.safeParse(req.body)
    if (!body.success) return send(res, "Validation errors", 400, null, extractErrors(body))
    
    const data = body.data
    const subjectId = parameterExists(req, res, "subjectId")
    const practicalId = parameterExists(req, res, "practicalId")
    
    const findSubject = await db.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")

    const findPractical = await db.subjectPractical.findUnique({ where: { id: practicalId }, select: { id: true, subjectId: true } })
    if (!findPractical) return notFound(res, "Practical Data doesn't exist.")

    const updatedPractical = await db.subjectPractical.update({
      where: { id: practicalId },
      data: { ...data }, 
    })
    return send(res, "Subject Practical Data has been updated successfully.", 200, updatedPractical)
  }

  async createFinalRevision(req: Request, res: Response) {
    const body = subjectFinalRevision.create.safeParse(req.body)
    if (!body.success) return send(res, "Validation errors", 400, null, extractErrors(body))
    
    const data = body.data
    const subjectId = parameterExists(req, res, "subjectId")
    
    const findSubject = await db.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res)

    const newFinalRev = await db.subjectFinalRevision.create({
      data: { ...data, subjectId: findSubject.id },
    })

    return send(res, "Subject Final Revision Data has been created successfully.", 201, newFinalRev)
  }

  async updateFinalRevision(req: Request, res: Response) {
    const body = subjectFinalRevision.update.safeParse(req.body)
    if (!body.success) return send(res, "Validation errors", 400, null, extractErrors(body))
    
    const data = body.data
    const subjectId = parameterExists(req, res, "subjectId")
    const finalId = parameterExists(req, res, "finalId")
    
    const findSubject = await db.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")

    const findFinalRevision = await db.subjectFinalRevision.findUnique({ where: { id: finalId }, select: { id: true, subjectId: true } })
    if (!findFinalRevision) return notFound(res, "Final Revision doesn't exist.")

    const updatedFinalRevision = await db.subjectFinalRevision.update({
      where: { id: finalId },
      data: { ...data }, 
    })
    return send(res, "Subject Final Revision Data has been updated successfully.", 200, updatedFinalRevision)
  }
 
}