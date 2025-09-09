import { z } from 'zod';
import createModelSchema from './schema';

const eventSchema = z.object({
  id: z.bigint(),
  userId: z.number(),
  deviceId: z.string().nullable().optional(),
  resource: z.string().nullable().optional(),
  resourceId: z.number().nullable().optional(),
  action: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  ip: z.string(),
  userAgent: z.string(),
  payload: z.any(),
  createdAt: z.date({ coerce: true }),
});

export default createModelSchema(
  eventSchema,
  {
    required: [
      'userId',
      'deviceId',
      'resource',
      'resourceId',
      'action',
      'sessionId',
      'ip',
      'userAgent',
      'payload',
      'createdAt',
    ],
  },
  [],
  {
    projectableFields: [
      'id',
      'userId',
      'deviceId',
      'resource',
      'resourceId',
      'action',
      'sessionId',
      'ip',
      'userAgent',
      'payload',
      'createdAt',
    ],
    sortableFields: ['id', 'createdAt'],
  },
);
