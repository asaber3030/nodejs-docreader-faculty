import { NextFunction, Request, Response } from "express"
import { TQueryParameters } from "../../types"

import { moduleSchema } from "../../schema"
import { badRequest, conflict, notFound, send } from "../../utlis/responses"
import { extractErrors } from "../../utlis/helpers"

import Module from "../models/Module"
import db from "../../utlis/db"

export default class ModuleController {
  
  async get(req: Request, res: Response) {
    
    const yearId = req.params.yearId ? +req.params.yearId : null
    if (!yearId) return badRequest(res, "Invalid Year Id")

    const { search, orderBy, orderType }: TQueryParameters = req.query as any
    
    const modules = await db.module.findMany({
      where: { 
        yearId,
        name: { contains: search }
      },
      include: { _count: { select: { subjects: true } } },
      orderBy: { [orderBy]: orderType }
    })

    return res.status(200).json({
      data: modules,
      message: "Modules data",
      status: 200
    })
  }

  async createModule(req: Request, res: Response) {
    const yearId = req.params.yearId ? +req.params.yearId : null
    if (!yearId) return badRequest(res, "Invalid Year Id")

    const parsedBody = moduleSchema.create.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findModule = await db.module.findFirst({
      where: { yearId, name: parsedBody.data.name }
    })
    if (findModule) return conflict(res, "Module already exists.")
    
    const newModule = await db.module.create({
      data: {
        yearId,
        ...parsedBody.data
      }
    })
    return send(res, "Module has been created", 201, newModule)
  }
  
  async getModule(req: Request, res: Response) {
    const yearId = req.params.yearId ? +req.params.yearId : null
    if (!yearId) return badRequest(res, "Invalid Year Id")

    const moduleId = req.params.moduleId ? +req.params.moduleId : null
    if (!moduleId) return badRequest(res, "Invalid Module Id")

    const module = await db.module.findUnique({
      where: { id: moduleId, yearId: yearId }
    })
    if (!module) return notFound(res, "Module doesn't exist.")
    return send(res, "Module", 200, module)
  }

  async getModuleSubjects(req: Request, res: Response) {
    const yearId = req.params.yearId ? +req.params.yearId : null
    if (!yearId) return badRequest(res, "Invalid Year Id")

    const moduleId = req.params.moduleId ? +req.params.moduleId : null
    if (!moduleId) return badRequest(res, "Invalid Module Id")

    const subjects = await Module.moduleSubjects(moduleId)
    return send(res, "Module subjects", 200, subjects)
  }

  async updateModule(req: Request, res: Response) {
    const yearId = req.params.yearId ? +req.params.yearId : null
    if (!yearId) return badRequest(res, "Invalid Year Id")

    const moduleId = req.params.moduleId ? +req.params.moduleId : null
    if (!moduleId) return badRequest(res, "Invalid Module Id")
   
    const parsedBody = moduleSchema.update.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findModule = await db.module.findFirst({
      where: { 
        yearId, 
        name: parsedBody.data.name,
        AND: [
          { id: { not: moduleId } }
        ]
      }
    })
    if (findModule) return conflict(res, "Module already exists.")
    
    const updatedModule = await db.module.update({
      where: { id: moduleId },
      data: parsedBody.data
    })
    return send(res, "Module has been updated", 200, updatedModule)
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