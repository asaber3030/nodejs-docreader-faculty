import { Request, Response } from "express"

import { linkSchema } from "../../schema"
import { badRequest, notFound, send, unauthorized, validationErrors } from "../../utlis/responses"
import { extractErrors, parameterExists } from "../../utlis/helpers"

import db from "../../utlis/db"
import AuthController from "./AuthController"

export default class PracticalController {
  
  async get(req: Request, res: Response) {
    const user = await AuthController.user(req, res)

    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")

    const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")
    
    const practicalData = await db.practicalData.findUnique({ 
      where: { subjectId },
      include: { subject: true } 
    })

    if (!practicalData) return notFound(res, "Practical Data doesn't exist.")
    const module = await db.module.findUnique({ where: { id: practicalData?.subject.moduleId } })
   
    if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")
    
    return send(res, `subjectId [${subjectId}] - Data`, 200, practicalData)
  }

  async getLinks(req: Request, res: Response) {
    const user = await AuthController.user(req, res)

    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")
  
    const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")
    
    const practicalData = await db.practicalData.findUnique({ 
      where: { subjectId },
      include: { subject: true } 
    })
    if (!practicalData) return notFound(res, "Practical Data doesn't exist.")
    const module = await db.module.findUnique({ where: { id: practicalData?.subject.moduleId } })
   
    if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")
    
    const links = await db.practicalLinks.findMany({
      where: { practicalId: practicalData.id }
    })

    return send(res, `subjectId [${subjectId}] - Pracitcal Data Links`, 200, links)
  }
    
  async createLink(req: Request, res: Response) {
    const user = await AuthController.user(req, res)

    const subjectId = parameterExists(req, res, "subjectId")
    if (!subjectId) return badRequest(res, "Invalid subjectId")
  
    const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")
    
    const practicalData = await db.practicalData.findUnique({ 
      where: { subjectId },
      include: { subject: true } 
    })
    if (!practicalData) return notFound(res, "Practical Data doesn't exist.")
    const module = await db.module.findUnique({ where: { id: practicalData?.subject.moduleId } })
   
    if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")
   
    const body = linkSchema.create.safeParse(req.body)
    if (!body.success) return validationErrors(res, extractErrors(body))

    const data = body.data
    const createdLink = await db.practicalLinks.create({
      data: { ...data, practicalId: practicalData.id }
    })
    return send(res, "Practical Link has been created", 201, createdLink)
  }
    
  async updateLink(req: Request, res: Response) {
    const user = await AuthController.user(req, res)

    const subjectId = parameterExists(req, res, "subjectId")
    const linkId = parameterExists(req, res, "linkId")
   
    const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")
    
    if (!subjectId) return badRequest(res, "Invalid subjectId")
    if (!linkId) return badRequest(res, "Invalid linkId")
    
    const practicalData = await db.practicalData.findUnique({ 
      where: { subjectId },
      include: { subject: true } 
    })
    if (!practicalData) return notFound(res, "Practical Data doesn't exist.")

    const module = await db.module.findUnique({ where: { id: practicalData?.subject.moduleId } })
    if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")

    const link = await db.practicalLinks.findUnique({ where: { id: linkId } })
    if (!link) return notFound(res, "Link doesn't exist.")
   
    const body = linkSchema.update.safeParse(req.body)
    if (!body.success) return validationErrors(res, extractErrors(body))

    const data = body.data
    const updatedLink = await db.practicalLinks.update({
      where: { id: link.id },
      data
    })
    return send(res, "Link has been updated", 200, updatedLink)
  }

  async deleteLink(req: Request, res: Response) {
    const user = await AuthController.user(req, res)

    const subjectId = parameterExists(req, res, "subjectId")
    const linkId = parameterExists(req, res, "linkId")

    const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
    if (!findSubject) return notFound(res, "Subject doesn't exist.")
    
    if (!subjectId) return badRequest(res, "Invalid subjectId")
    if (!linkId) return badRequest(res, "Invalid linkId")
    
    const practicalData = await db.practicalData.findUnique({ 
      where: { subjectId },
      include: { subject: true } 
    })
    if (!practicalData) return notFound(res, "Practical Data doesn't exist.")

    const module = await db.module.findUnique({ where: { id: practicalData?.subject.moduleId } })
    if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")

    const link = await db.practicalLinks.findUnique({ where: { id: linkId } })
    if (!link) return notFound(res, "Link doesn't exist.")

    const deletedLink = await db.practicalLinks.delete({ where: { id: link.id } })
    return send(res, "Link has been deleted", 200, deletedLink)
  }
  
}