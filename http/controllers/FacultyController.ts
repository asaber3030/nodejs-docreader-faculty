import { Request, Response } from "express"

import { TQueryParameters } from "../../types"
import { UserRole } from "@prisma/client"

import { badRequest, conflict, notFound, send, unauthorized } from "../../utlis/responses"
import { facultySchema, studyingYearSchema } from "../../schema"
import { currentDate, extractErrors, parameterExists } from "../../utlis/helpers"

import db from "../../utlis/db"

import Faculty from "../models/Faculty"
import AuthController from "./AuthController"
import User from "../models/User"

export default class FacultyController {
  
  async get(req: Request, res: Response) {
    try {
      const { search, orderBy, orderType }: TQueryParameters = req.query as any
      const faculties = await Faculty.findAll(search ? search as string : '', orderBy, orderType)
  
      return res.status(200).json({
        data: faculties,
        message: "Faculties data",
        status: 200
      })
    } catch(errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }
  
  async getFaculty(req: Request, res: Response) {
    try {
      const facultyId = parameterExists(req, res, 'facultyId')
      if (!facultyId) return badRequest(res, "Invalid faculty id")
  
      const faculty = await Faculty.find(facultyId)
      if (!faculty) return notFound(res, "Faculty doesn't exist.")
  
      return res.status(200).json({
        data: faculty,
        message: "Faculty data",
        status: 200
      })
    } catch(errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }
  
  async getFacultyYears(req: Request, res: Response) {
    try {
      const facultyId = parameterExists(req, res, 'facultyId')
      if (!facultyId) return badRequest(res, "Invalid faculty id")

      const years = await db.studyingYear.findMany({ where: { facultyId } })

      return res.status(200).json({
        data: years,
        message: `Faculy of ID: ${facultyId} data - Years`,
        status: 200
      })
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }
  
  async getYear(req: Request, res: Response) {
    try {
      const facultyId = parameterExists(req, res, 'facultyId')
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
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }

  async getYearStudents(req: Request, res: Response) {
    try {
      const facultyId = parameterExists(req, res, 'facultyId')
      const yearId = parameterExists(req, res, 'yearId')
  
      if (!facultyId) return badRequest(res, "Invalid faculty id")
      if (!yearId) return badRequest(res, "Invalid year id")
  
      const year = await db.studyingYear.findUnique({ where: { id: yearId } })
      if (!year) return notFound(res, "Year doesn't exist.")

      if (year.facultyId !== facultyId) return notFound(res, "Year doesn't belong to given faculty id.")
  
      const students = await db.user.findMany({
        where: { yearId },
        select: User.dbSelectors
      })
  
      return res.status(200).json({
        data: students,
        message: `Students of Year: ${yearId}`,
        status: 200
      })
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }

  // Create / Delete / Update => Year for specific facultyId
  async createYear(req: Request, res: Response) {

    try {
      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot create a year.")

      const body = studyingYearSchema.create.safeParse(req.body)
      const facultyId = parameterExists(req, res, "facultyId")
      
      if (!body.success) return send(res, "Validation errors", 400, null, extractErrors(body))
      
      const data = body.data
      const faculty = await db.faculty.findUnique({ where: { id: facultyId }, select: { id: true } })
      
      if (!faculty) return notFound(res, "Faculty doesn't exist.")
  
      const yearExist = await db.studyingYear.findFirst({
        where: { facultyId, title: data.title }
      })
  
      if (yearExist) return conflict(res, "Year already exists in this faculty.")
  
      const newYear = await db.studyingYear.create({
        data: { 
          facultyId: faculty.id,
          createdAt: currentDate(),
          ...data 
        },
      })
  
      return send(res, "Year has been created.", 201, newYear)

    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }
  
  async updateYear(req: Request, res: Response) {
    
    try {
      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot update a year.")

      const body = studyingYearSchema.update.safeParse(req.body)
      const facultyId = parameterExists(req, res, "facultyId")
      const yearId = parameterExists(req, res, "yearId")
      
      if (!body.success) return send(res, "Validation errors", 400, null, extractErrors(body))
      
      const data = body.data
      const faculty = await db.faculty.findUnique({ where: { id: facultyId }, select: { id: true } })
      
      if (!faculty) return notFound(res, "Faculty doesn't exist.")

      const yearExist = await db.studyingYear.findFirst({
        where: { facultyId, title: data.title, AND: [ { id: { not: yearId } } ] }
      })

      if (yearExist) return conflict(res, "Year already exists in this faculty.")

      const findYear = await db.studyingYear.findUnique({
        where: { id: yearId },
        select: { id: true }
      })

      if (!findYear) return notFound(res, "Year doesn't exist.")

      const updatedYear = await db.studyingYear.update({
        where: { id: yearId },
        data: { ...data }
      })

      return send(res, "Year has been updated.", 200, updatedYear)

    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }

  async deleteYear(req: Request, res: Response) {
    try {
      const facultyId = parameterExists(req, res, "facultyId")
      const yearId = parameterExists(req, res, "yearId")
      const faculty = await db.faculty.findUnique({ where: { id: facultyId }, select: { id: true } })
      
      if (!faculty) return notFound(res, "Faculty doesn't exist.")

      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot delete a year.")

      const yearExist = await db.studyingYear.findFirst({
        where: { id: yearId }
      })

      if (!yearExist) return notFound(res, "Year doesn't exist.")

      const deletedYear = await db.studyingYear.delete({
        where: { id: yearId }
      })
      return send(res, "Year has been deleted.", 200, deletedYear)

    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }

  // Create / Delete / Update => Faculty
  async createFaculty(req: Request, res: Response) {
    try {
      const body = req.body
      const parsedBody = facultySchema.create.safeParse(body)
      const data = parsedBody.data
      const errors = extractErrors(parsedBody)

      if (!parsedBody) return res.status(400).json({ message: "Validation errors", errors, status: 400 })
      if (!data) return res.status(400).json({ message: "Validation errors", errors, status: 400 })

      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot create a faculty.")

      const facultyExists = await db.faculty.findFirst({ where: { ...data } })
      if (facultyExists) return conflict(res, "Faculty already exists.")

      const faculty = await db.faculty.create({ 
        data: {
          ...data,
          createdAt: currentDate(),
        }
      })
      return res.status(201).json({
        data: faculty,
        message: "Faculty has been created successfully.",
        status: 201
      })
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }

  async updateFaculty(req: Request, res: Response) {

    try {
      const facultyId = parameterExists(req, res, "facultyId")

      const body = req.body
      const parsedBody = facultySchema.update.safeParse(body)
      const data = parsedBody.data
      const errors = extractErrors(parsedBody)

      if (!parsedBody) return res.status(400).json({ message: "Validation errors", errors, status: 400 })
      if (!data) return res.status(400).json({ message: "Validation errors", errors, status: 400 })

      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot update a faculty.")

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
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }

  }

  async deleteFaculty(req: Request, res: Response) {
    try {
      const facultyId = parameterExists(req, res, "facultyId")

      const user = await AuthController.user(req, res)
      if (!user || user.role !== UserRole.Admin) return unauthorized(res, "Unauthorized cannot delete a faculty.")

      const findFaculty = await db.faculty.findUnique({ where: { id: facultyId } })
      if (!findFaculty) return notFound(res, "Faculty doesn't exist.")

      const faculty = await db.faculty.delete({ where: { id: facultyId } })

      return res.status(201).json({
        data: faculty,
        message: "Faculty has been deleted successfully.",
        status: 201
      })
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }
  }

}