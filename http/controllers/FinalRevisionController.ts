import { Request, Response } from "express"
import { UserRole } from "@prisma/client"

import { linkSchema } from "../../schema"
import { badRequest, notFound, send, unauthorized, validationErrors } from "../../utlis/responses"
import { currentDate, extractErrors, parameterExists } from "../../utlis/helpers"

import db from "../../utlis/db"
import AuthController from "./AuthController"


export default class FinalRevisionController {
  async get(req: Request, res: Response) {
    try {
      const user = await AuthController.user(req, res)

      const subjectId = parameterExists(req, res, "subjectId")
      if (!subjectId) return badRequest(res, "Invalid subjectId")

      const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
      if (!findSubject) return notFound(res, "Subject doesn't exist.")
      
      const finalRevisionData = await db.finalRevisionData.findUnique({ 
        where: { subjectId },
        include: { subject: true } 
      })

      if (!finalRevisionData) return notFound(res, "finalRevision Data doesn't exist.")
      const module = await db.module.findUnique({ where: { id: finalRevisionData?.subject.moduleId } })
    
      if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")
      
      return send(res, `subjectId [${subjectId}] - Data`, 200, finalRevisionData)
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }

  async getLinks(req: Request, res: Response) {
    try {
      const user = await AuthController.user(req, res)

      const subjectId = parameterExists(req, res, "subjectId")
      if (!subjectId) return badRequest(res, "Invalid subjectId")
    
      const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
      if (!findSubject) return notFound(res, "Subject doesn't exist.")
      
      const finalRevisionData = await db.finalRevisionData.findUnique({ 
        where: { subjectId },
        include: { subject: true } 
      })
      if (!finalRevisionData) return notFound(res, "finalRevision Data doesn't exist.")
      const module = await db.module.findUnique({ where: { id: finalRevisionData?.subject.moduleId } })
    
      if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")
      
      const links = await db.finalRevisionLinks.findMany({
        where: { finalRevisionId: finalRevisionData.id }
      })

      return send(res, `subjectId [${subjectId}] - Final Revision Data Links`, 200, links)
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
    
  }
    
  async createLink(req: Request, res: Response) {
    try {
      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot create a link.")

      const subjectId = parameterExists(req, res, "subjectId")
      if (!subjectId) return badRequest(res, "Invalid subjectId")
    
      const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
      if (!findSubject) return notFound(res, "Subject doesn't exist.")
      
      const finalRevisionData = await db.finalRevisionData.findUnique({ 
        where: { subjectId },
        include: { subject: true } 
      })
      if (!finalRevisionData) return notFound(res, "finalReFinal Revisionvision Data doesn't exist.")
      const module = await db.module.findUnique({ where: { id: finalRevisionData?.subject.moduleId } })
     
      if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")
     
      const body = linkSchema.create.safeParse(req.body)
      if (!body.success) return validationErrors(res, extractErrors(body))
  
      const data = body.data
      const createdLink = await db.finalRevisionLinks.create({
        data: { 
          ...data,
          subTitle: data.subTitle ?? '',
          finalRevisionId: finalRevisionData.id,
          createdAt: currentDate()
        }
      })
      return send(res, "finalRevision Link has been created", 201, createdLink)
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
    
  }

  async getLink(req: Request, res: Response) {
    try {
      const linkId = parameterExists(req, res, "linkId")
      if (!linkId) return badRequest(res, "Invalid linkId")

      const link = await db.finalRevisionLinks.findUnique({ where: { id: linkId } })
      if (!link) return notFound(res, "Link not found.")

      return send(res, "Link Data", 200, link)
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }

  }
    
  async updateLink(req: Request, res: Response) {
    try {
      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot update a link.")
      const subjectId = parameterExists(req, res, "subjectId")
      const linkId = parameterExists(req, res, "linkId")
     
      const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
      if (!findSubject) return notFound(res, "Subject doesn't exist.")
      
      if (!subjectId) return badRequest(res, "Invalid subjectId")
      if (!linkId) return badRequest(res, "Invalid linkId")
      
      const finalRevisionData = await db.finalRevisionData.findUnique({ 
        where: { subjectId },
        include: { subject: true } 
      })
      if (!finalRevisionData) return notFound(res, "Final Revision Data doesn't exist.")
  
      const module = await db.module.findUnique({ where: { id: finalRevisionData?.subject.moduleId } })
      if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")
  
      const link = await db.finalRevisionLinks.findUnique({ where: { id: linkId } })
      if (!link) return notFound(res, "Link doesn't exist.")
     
      const body = linkSchema.update.safeParse(req.body)
      if (!body.success) return validationErrors(res, extractErrors(body))
  
      const data = body.data
      const updatedLink = await db.finalRevisionLinks.update({
        where: { id: link.id },
        data
      })
      return send(res, "Link has been updated", 200, updatedLink)
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }

  }

  async deleteLink(req: Request, res: Response) {
    try {
          
      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot delete a link.")

      const subjectId = parameterExists(req, res, "subjectId")
      const linkId = parameterExists(req, res, "linkId")

      const findSubject = await db.subject.findUnique({ where: { id: subjectId } })
      if (!findSubject) return notFound(res, "Subject doesn't exist.")
      
      if (!subjectId) return badRequest(res, "Invalid subjectId")
      if (!linkId) return badRequest(res, "Invalid linkId")
      
      const finalRevisionData = await db.finalRevisionData.findUnique({ 
        where: { subjectId },
        include: { subject: true } 
      })
      if (!finalRevisionData) return notFound(res, "Final Revision Data doesn't exist.")

      const module = await db.module.findUnique({ where: { id: finalRevisionData?.subject.moduleId } })
      if (user?.yearId !== module?.yearId) return unauthorized(res, "Unauthorized")

      const link = await db.finalRevisionLinks.findUnique({ where: { id: linkId } })
      if (!link) return notFound(res, "Link doesn't exist.")

      const deletedLink = await db.finalRevisionLinks.delete({ where: { id: link.id } })
      return send(res, "Link has been deleted", 200, deletedLink)
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }

  }
}