import { Response } from "express";

export function send<T, D>(res: Response,
  message: string = "", 
  status: number = 200,
  data?: T,
  errors?: D
) {
  return res.status(status).json({
    message,
    status: status,
    errors,
    data
  })
}

export function unauthorized(res: Response, message: string = "Unauthorized.") {
  return res.status(401).json({
    message,
    status: 401
  })
}

export function notFound(res: Response, message: string = "Error 404 - Not Found.") {
  return res.status(404).json({
    message,
    status: 404
  })
}

export function badRequest(res: Response, message: string = "Something went wrong.") {
  return res.status(400).json({
    message,
    status: 400
  })
}

export function conflict(res: Response, message: string = "Something went wrong.") {
  return res.status(409).json({
    message,
    status: 409
  })
}