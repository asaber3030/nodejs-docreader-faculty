import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import YearModel from '../models/Year';

export default class YearController {
  public static createYear = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const year = await YearModel.createOne(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        year,
      },
    });
  });

  public static getAllYears = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const years = await YearModel.findMany({});

    res.status(200).json({
      status: 'success',
      data: {
        years,
      },
    });
  });

  public static getYear = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number.parseInt(req.params.id);

    const year = await YearModel.findOneById(id);

    res.status(200).json({
      status: 'success',
      data: {
        year,
      },
    });
  });

  public static updateYear = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number.parseInt(req.params.id);

    const updatedYear = await YearModel.updateOne(id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        year: updatedYear,
      },
    });
  });

  public static deleteYear = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number.parseInt(req.params.id);

    await YearModel.deleteOne(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}
