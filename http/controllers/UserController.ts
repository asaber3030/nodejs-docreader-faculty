import { Request, Response } from "express"

import { extractErrors, extractToken } from "../../utlis/helpers"
import { notFound, send, unauthorized } from "../../utlis/responses"
import { userSchema } from "../../schema"

import { User as TUser } from "@prisma/client"

import bcrypt from 'bcrypt'
import db from "../../utlis/db"
import jwt from 'jsonwebtoken'

import User from "../models/User"
import AuthController from "./AuthController"

export default class UserController {

  static async user(req: Request): Promise<TUser | null> {
    const token = extractToken(req.headers.authorization!)
    if (!token) return null
    try {
      const verifiedToken = jwt.verify(token, AuthController.secret!) as TUser
      if (!verifiedToken) return null
      const realUser = await User.find(verifiedToken.id)
      return realUser as unknown as TUser
    } catch (error) {
      return null
    }
  }
  
  async getUser(req: Request, res: Response) {
    try {
      const user = await UserController.user(req)
      if (!user) return notFound(res, "No User was found")
      return res.status(200).json({
        data: user,
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

  async update(req: Request, res: Response) {

    try {
      const body = userSchema.update.safeParse(req.body)
      const data = body.data
      const user = await UserController.user(req)
  
      if (!user) return unauthorized(res)
      const userData = await db.user.findUnique({ where: { id: user.id } })
  
      if (!userData) return notFound(res, "User doesn't exist.")
      if (!body.success) return send(res, "Validation errors", 400, extractErrors(body))
  
      if (!data) {
        return res.status(400).json({
          message: "Please check there's valid JSON data in the request body.",
          status: 400
        }) 
      }
  
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          facultyId: data.facultyId,
          yearId: data.facultyId
        }
      })
  
      const { password, ...mainUser } = updatedUser
  
      return res.status(200).json({
        message: "User has been updated successfully.",
        status: 200,
        data: mainUser
      })
      
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500
      })
    }

  }

  async changePassword(req: Request, res: Response) {

    try {
      const body = userSchema.changePassword.safeParse(req.body)
      if (!body.success) return send(res, "Validation errors", 400, extractErrors(body))
  
      const data = body.data
      const user = await AuthController.user(req, res)
      const userFull = await db.user.findUnique({ where: { id: user?.id }, select: { id: true, password: true } })
  
      if (!user || !userFull) return unauthorized(res)
  
      const comparePasswords = await bcrypt.compare(data.currentPassword, userFull?.password)
      if (!comparePasswords) return unauthorized(res, "Invalid password for current user.")
  
      const newPassword = await bcrypt.hash(data.newPassword, 10)
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          password: newPassword
        },
        select: { id: true }
      })
  
      return res.status(200).json({
        message: "Password has been updated successfully.",
        status: 200,
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