import z from 'zod';
import { Event as PrismaEvent } from '@prisma/client';
import eventSchema from '../schema/event.schema';
import AppError from '../utils/AppError';
import { QueryParamsService } from '../utils/QueryParamsService';
import db from '../prisma/db';

export default class EventModel {
  public static modelName: string = 'event';
  public static capitalizedModelName: string = 'Event';

  private data: Partial<PrismaEvent>;

  constructor(data: Partial<PrismaEvent>) {
    this.data = data;
  }

  toJSON() {
    return this.data;
  }

  static createMany = async function (
    ip: string,
    events: any,
    queryParams: any,
  ) {
    const validatedCreationBody = z.array(eventSchema.create).safeParse(events);

    if (!validatedCreationBody.success) {
      throw new AppError(
        `Invalid create input: [ ${validatedCreationBody.error.issues.map(
          issue => issue.message,
        )} ]`,
        400,
      );
    }
    QueryParamsService.parse<typeof eventSchema.query>(
      eventSchema,
      queryParams,
      {},
    );
    const created = await db.event.createMany({
      data: events.map((event: any) => ({ ...event, ip })),
    });
    return created;
  };
}
