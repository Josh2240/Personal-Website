import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  JWT_SECRET: z.string().default('ChangeThisJWTSecret'),
  ADMIN_PASSWORD: z.string().default('ChangeThisAdmin@123'),
  ADMIN_TOTP_SECRET: z.string().optional(),
  DATABASE_PATH: z.string().optional(),
})

export const env = envSchema.parse(process.env)
