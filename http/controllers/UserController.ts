import { Request, Response } from "express"

import { createPagination, extractErrors, extractToken } from "../../utlis/helpers"
import { notFound, unauthorized } from "../../utlis/responses"
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

    const user = await UserController.user(req)
    if (!user) return notFound(res, "No User was found")

    return res.status(200).json({
      data: user,
      status: 200
    })
  }

  async update(req: Request, res: Response) {
    
    const body = userSchema.update.safeParse(req.body)
    const data = body.data

    const user = await UserController.user(req)

    if (!user) return unauthorized(res)

    const userData = await db.user.findUnique({
      where: { id: user.id }
    })

    if (!userData) return notFound(res, "User doesn't exist.")

    if (!body.success) {
      const errors = extractErrors(body)
      return res.status(400).json({
        errors,
        message: "Form validation errors.",
        status: 400
      })
    }

    if (!data) {
      return res.status(400).json({
        message: "Please check there's valid JSON data in the request body.",
        status: 400
      }) 
    }

    if (data.email) {
      const userByEmail = await db.user.findUnique({
        where: {
          email: data.email,
          AND: [
            { id: { not: user.id } }
          ]
        }
      })
      if (userByEmail) {
        return res.status(409).json({
          message: "E-mail Already exists.",
          status: 409
        })
      }
    }


    let pass = userData.password;
    
    if (data.password) {
      pass = await bcrypt.hash(data.password!, 10)
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        email: data.email,
        password: pass
      }
    })

    const { password, ...mainUser } = updatedUser

    return res.status(200).json({
      message: "User has been updated successfully.",
      status: 200,
      data: mainUser
    })

  }
  

}