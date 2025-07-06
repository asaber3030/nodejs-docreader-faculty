import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import ModuleModel from '../models/Module';

export default class ModuleController {
  public static createModule = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const module = await ModuleModel.createOne(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        faculty: module,
      },
    });
  });

  public static getAllModules = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const modules = await ModuleModel.findMany({});

    res.status(200).json({
      status: 'success',
      data: {
        modules,
      },
    });
  });

  public static getModule = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number.parseInt(req.params.id);

    const module = await ModuleModel.findOneById(id);

    res.status(200).json({
      status: 'success',
      data: {
        module,
      },
    });
  });

  public static updateModule = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number.parseInt(req.params.id);

    const updateModule = await ModuleModel.updateOne(id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        module: updateModule,
      },
    });
  });

  public static deleteModule = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number.parseInt(req.params.id);

    await ModuleModel.deleteOne(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}
