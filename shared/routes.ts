import { z } from 'zod';
import { insertUserSchema, insertClassSchema, users, classes } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: { 200: z.custom<typeof users.$inferSelect>(), 401: z.object({ message: z.string() }) },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: insertUserSchema,
      responses: { 201: z.custom<typeof users.$inferSelect>(), 400: errorSchemas.validation },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: { 200: z.void() },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: { 200: z.custom<typeof users.$inferSelect>(), 401: z.void() },
    },
    verifyOtp: {
      method: 'POST' as const,
      path: '/api/auth/verify-otp',
      input: z.object({ email: z.string(), otp: z.string() }),
      responses: { 200: z.custom<typeof users.$inferSelect>(), 400: z.object({ message: z.string() }) },
    },
    forgotPassword: {
      method: 'POST' as const,
      path: '/api/auth/forgot-password',
      input: z.object({ email: z.string() }),
      responses: { 200: z.object({ message: z.string() }), 404: z.object({ message: z.string() }) },
    },
    resetPassword: {
      method: 'POST' as const,
      path: '/api/auth/reset-password',
      input: z.object({ email: z.string(), otp: z.string(), newPassword: z.string() }),
      responses: { 200: z.object({ message: z.string() }), 400: z.object({ message: z.string() }) },
    },
    admin: {
      users: {
        method: 'GET' as const,
        path: '/api/admin/users',
        responses: { 200: z.array(z.custom<typeof users.$inferSelect>()), 403: z.void() },
      },
      updateStatus: {
        method: 'PATCH' as const,
        path: '/api/admin/users/:id/status',
        input: z.object({ status: z.enum(["pending", "active", "suspended"]) }),
        responses: { 200: z.custom<typeof users.$inferSelect>(), 403: z.void() },
      },
      deleteUser: {
        method: 'DELETE' as const,
        path: '/api/admin/users/:id',
        responses: { 200: z.void(), 403: z.void(), 404: errorSchemas.notFound },
      }
    }
  },
  classes: {
    list: {
      method: 'GET' as const,
      path: '/api/classes',
      responses: { 200: z.array(z.custom<typeof classes.$inferSelect & { teacher: typeof users.$inferSelect }>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/classes',
      input: insertClassSchema,
      responses: { 201: z.custom<typeof classes.$inferSelect>(), 400: errorSchemas.validation },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/classes/:id',
      responses: { 200: z.void(), 404: errorSchemas.notFound },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
