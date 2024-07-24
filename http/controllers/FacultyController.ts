import { Request, Response } from "express"

import Faculty from "../models/Faculty"
import { TQueryParameters } from "../../types"
import { badRequest, conflict, notFound } from "../../utlis/responses"
import db from "../../utlis/db"
import { facultySchema } from "../../schema"
import { extractErrors } from "../../utlis/helpers"

export default class FacultyController {
  
  async get(req: Request, res: Response) {
    const { search, orderBy, orderType }: TQueryParameters = req.query as any
    const faculties = await Faculty.findAll(search ? search as string : '', orderBy, orderType)

    return res.status(200).json({
      data: faculties,
      message: "Faculties data",
      status: 200
    })
  }
  
  async getFaculty(req: Request, res: Response) {
    const facultyId = req.params.facultyId ? +req.params.facultyId : null
    if (!facultyId) return badRequest(res, "Invalid faculty id")

    const faculty = await Faculty.find(facultyId)
    if (!faculty) return notFound(res, "Faculty doesn't exist.")

    return res.status(200).json({
      data: faculty,
      message: "Faculty data",
      status: 200
    })
  }
  
  async getFacultyYears(req: Request, res: Response) {
    const facultyId = req.params.facultyId ? +req.params.facultyId : null
    if (!facultyId) return badRequest(res, "Invalid faculty id")

    try {
      const years = await db.studyingYear.findMany({
        where: { facultyId }
      })
      return res.status(200).json({
        data: years,
        message: `Faculy of ID: ${facultyId} data - Years`,
        status: 200
      })
    } catch (error) {
      return notFound(res, "Error - Faculty Doesn't exist.")
    }
  }
  
  async getYear(req: Request, res: Response) {
    const facultyId = req.params.facultyId ? +req.params.facultyId : null
    const yearId = req.params.yearId ? +req.params.yearId : null

    if (!facultyId) return badRequest(res, "Invalid faculty id")
    if (!yearId) return badRequest(res, "Invalid year id")

    const year = await db.studyingYear.findUnique({ where: { id: yearId } })
    if (!year) return notFound(res, "Year doesn't exist.")

    return res.status(200).json({
      data: year,
      message: "Year data",
      status: 200
    })
  }

  async getYearStudents(req: Request, res: Response) {
    const facultyId = req.params.facultyId ? +req.params.facultyId : null
    const yearId = req.params.yearId ? +req.params.yearId : null

    if (!facultyId) return badRequest(res, "Invalid faculty id")
    if (!yearId) return badRequest(res, "Invalid year id")

    const year = await db.studyingYear.findUnique({ where: { id: yearId } })
    if (!year) return notFound(res, "Year doesn't exist.")

    const students = await db.user.findMany({
      where: { yearId }
    })

    return res.status(200).json({
      data: students,
      message: `Students of Year: ${yearId}`,
      status: 200
    })
  }

  async updateFaculty(req: Request, res: Response) {

    const facultyId = req.params.facultyId ? +req.params.facultyId : null
    if (!facultyId) return badRequest(res, "Invalid faculty id")

    const body = req.body
    const parsedBody = facultySchema.update.safeParse(body)
    const data = parsedBody.data
    const errors = extractErrors(parsedBody)

    if (!parsedBody) return res.status(400).json({ message: "Validation errors", errors, status: 400 })
    if (!data) return res.status(400).json({ message: "Validation errors", errors, status: 400 })

    const facultyExists = await db.faculty.findFirst({ 
      where: { 
        ...data,
        AND: [
          { id: { not: facultyId } }
        ]
      }
    })
    if (facultyExists) return conflict(res, "Faculty already exists.")

    const faculty = await db.faculty.update({ where: { id: facultyId }, data })
    return res.status(200).json({
      data: faculty,
      message: "Faculty has been updated successfully.",
      status: 201
    })

  }

  async createFaculty(req: Request, res: Response) {
    
    const body = req.body
    const parsedBody = facultySchema.create.safeParse(body)
    const data = parsedBody.data
    const errors = extractErrors(parsedBody)

    if (!parsedBody) return res.status(400).json({ message: "Validation errors", errors, status: 400 })
    if (!data) return res.status(400).json({ message: "Validation errors", errors, status: 400 })

    const facultyExists = await db.faculty.findFirst({ where: { ...data } })
    if (facultyExists) return conflict(res, "Faculty already exists.")

    const faculty = await db.faculty.create({ data })
    return res.status(201).json({
      data: faculty,
      message: "Faculty has been created successfully.",
      status: 201
    })

  }

}