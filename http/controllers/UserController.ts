import { Request, Response } from "express"

import { extractErrors, extractToken } from "../../utlis/helpers"
import { notFound, send, unauthorized } from "../../utlis/responses"
import { userSchema } from "../../schema"

import { User as TUser } from "@prisma/client"

import bcrypt from "bcrypt"
import db from "../../utlis/db"
import jwt from "jsonwebtoken"

import User from "../models/User"
import AuthController from "./AuthController"
import { messaging } from "../../utlis/firebase"

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
      const user = await UserController.user(req)
  
      if (!user) return unauthorized(res)
      if (!body.success) return send(res, "Validation errors", 400, extractErrors(body))

      const data = body.data
      const oldYear = user.yearId

      const year = await db.studyingYear.findUnique({ where: { id: data.yearId } })
      const faculty = await db.faculty.findUnique({ where: { id: data.facultyId } })

      if (!year) return notFound(res, "Year doesn't exist")
      if (!faculty) return notFound(res, "Faculty doesn't exist")

      if (year?.facultyId !== faculty?.id) return notFound(res, "Year doesn't belong to given faculty!")
  
      const updatedUser = await db.user.update({
        where: { id: user.id },
        include: { devices: true },
        data: {
          name: data.name,
          facultyId: data.facultyId,
          yearId: data.yearId
        }
      })

      for (const device of updatedUser.devices) {
        const unsubRes = await messaging.unsubscribeFromTopic(
          device.token,
          oldYear.toString()
        )
        if (unsubRes.failureCount)
          throw new Error("Unsubscribing from yearId failed")
        const subRes = await messaging.subscribeToTopic(
          device.token,
          updatedUser.yearId.toString()
        )
        if (subRes.failureCount)
          throw new Error("Subscribing to yearId failed")
      }
      const { password, devices, ...mainUser } = updatedUser

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
        status: 500,
      })
    }
  }

  async registerDevice(req: Request, res: Response) {
    try {
      const user = await UserController.user(req)
      if (!user) return notFound(res, "No User was found")
      const body = userSchema.registerDevice.safeParse(req.body)
      const data = body.data

      if (!body.success) {
        const errors = extractErrors(body)
        return res.status(400).json({
          errors,
          message: "Form validation errors.",
          status: 400,
        })
      }

      if (!data) {
        return res.status(400).json({
          message: "Please check there's valid JSON data in the request body.",
          status: 400,
        })
      }

      if (!(await db.device.findFirst({ where: { token: data.token } }))) {
        await db.device.create({
          data: { token: data.token, userId: user.id },
        })

        const subRes = await messaging.subscribeToTopic(
          data.token,
          user.yearId.toString()
        )

        if (subRes.failureCount)
          throw new Error("Subscribing to yearId failed")
      }

      return res.status(200).json({
        message: "Device token registered successfully.",
        status: 200,
      })
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      })
    }
  }

  async unregisterDevice(req: Request, res: Response) {
    try {
      const user = await UserController.user(req)
      if (!user) return notFound(res, "No User was found")
      const body = userSchema.registerDevice.safeParse(req.body)
      const data = body.data

      if (!body.success) {
        const errors = extractErrors(body)
        return res.status(400).json({
          errors,
          message: "Form validation errors.",
          status: 400,
        })
      }

      if (!data) {
        return res.status(400).json({
          message: "Please check there's valid JSON data in the request body.",
          status: 400,
        })
      }

      const device = await db.device.findFirst({
        where: { token: data.token },
      })

      if (!device)
        return res.status(400).json({
          message: "Device doesn't exist.",
          status: 400,
        })

      if (device.userId !== user.id)
        return res.status(400).json({
          message: "Device doesn't belong to user.",
          status: 400,
        })

      await db.device.delete({
        where: { token: data.token, userId: user.id },
      })

      const unsubRes = await messaging.unsubscribeFromTopic(
        device.token,
        user.yearId.toString()
      )
      if (unsubRes.failureCount)
        return res.status(400).json({
          message: "Unsubscribing from yearId failed",
          status: 400,
        })

      return res.status(200).json({
        message: "Device uregistered successfully.",
        status: 200,
      })
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      })
    }
  }
}
