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

export const classesRelations = relations(classes, ({ one }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertClassSchema = createInsertSchema(classes).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertClass = z.infer<typeof insertClassSchema>;
