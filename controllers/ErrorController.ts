import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import AppError from '../utils/AppError';
import { NextFunction, Request, Response } from 'express';

class ErrorController {
  static #sendDevErrors(err: any, res: Response) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  static #sendProdErrors(err: any, res: Response) {
    // Operational, trusted errors: send message to client
    if (err instanceof AppError && err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or unknown error
      console.error('UNEXPECTED ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong on the server.',
      });
    }
  }

  static #handlePrismaClientKnownRequestError(
    error: PrismaClientKnownRequestError,
  ) {
    switch (error.code) {
      case 'P2003':
        if (error?.meta?.constraint === 'User_yearId_fkey')
          return new AppError(`Year with given ID not found.`, 404);
        else if (error?.meta?.constraint === 'User_facultyId_fkey')
          return new AppError(`Faculty with given ID not found.`, 404);
        break;

      case 'P2025':
        return new AppError(`Database record not found for an update.`, 404);

      default:
        return error;
    }
  }

  static #sendAPIErrors(err: any, res: Response) {
    let error = { ...err };

    // Ensure essential properties are preserved
    error.message = err.message;
    error.name = err.name;
    error.stack = err.stack;

    if (process.env.NODE_ENV === 'development') {
      ErrorController.#sendDevErrors(error, res);
    } else {
      if (error.name === 'PrismaClientKnownRequestError')
        error = this.#handlePrismaClientKnownRequestError(error);

      error = ErrorController.#sendProdErrors(error, res);
    }
  }

  static globalErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    ErrorController.#sendAPIErrors(err, res);
  }
}

export default ErrorController.globalErrorHandler;
