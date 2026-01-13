import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["student", "teacher", "admin"] }).notNull().default("student"),
  gender: text("gender", { enum: ["male", "female"] }).notNull().default("male"),
  status: text("status", { enum: ["pending", "active", "suspended"] }).notNull().default("pending"),
  otp: text("otp"),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  meetingLink: text("meeting_link").notNull(),
  teacherId: integer("teacher_id").notNull(),
  reminderSent: boolean("reminder_sent").notNull().default(false),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  classId: integer("class_id").notNull(),
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
}));

export const usersRelations = relations(users, ({ many }) => ({
  classes: many(classes),
  enrollments: many(enrollments),
}));

export const insertEnrollmentSchema = createInsertSchema(enrollments);
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertClassSchema = createInsertSchema(classes).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertClass = z.infer<typeof insertClassSchema>;
