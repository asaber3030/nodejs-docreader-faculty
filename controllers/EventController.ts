import { Request, Response } from 'express';
import { Event } from '@prisma/client';
import EventModel from '../models/Event';
import catchAsync from '../utils/catchAsync';

export default class EventController {
  public static bulk = catchAsync(async function (req: Request, res: Response) {
    const events: Omit<Event, 'ip' | 'id'>[] = req.body.events;

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const createdEvents = await EventModel.createMany(
      typeof ip === 'string' ? ip : '',
      events,
      req.query,
    );

    return res
      .status(201)
      .json({ status: 'success', totalCount: createdEvents.count });
  });
}
