import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(15),
    email: z.string().email(),
    password: z.string().min(6)
  })
});

export const loginSchema = z.object({
  body: z.object({
    login: z.string(),
    password: z.string()
  })
});

export const verifySchema = z.object({
  body: z.object({
    email: z.string().email(),
    verificationCode: z.string().length(6)
  })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type VerifyInput = z.infer<typeof verifySchema>['body'];