import z from 'zod';

export const deviceSchema = z.object({
  token: z.string(),
});

export type Device = z.infer<typeof deviceSchema>;
