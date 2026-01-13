import { db } from "./db";
import { users, classes, type User, type InsertUser, type Class, type InsertClass } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getClasses(): Promise<(Class & { teacher: User })[]>;
  createClass(cls: InsertClass): Promise<Class>;
  deleteClass(id: number): Promise<void>;
  getClass(id: number): Promise<Class | undefined>;
  
  // Admin methods
  getAllUsers(): Promise<User[]>;
  updateUserStatus(id: number, status: string): Promise<User>;
  deleteUser(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserStatus(id: number, status: any): Promise<User> {
    const [user] = await db.update(users).set({ status }).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    // Also delete any classes taught by this teacher
    await db.delete(classes).where(eq(classes.teacherId, id));
    await db.delete(users).where(eq(users.id, id));
  }

  async getClasses(): Promise<(Class & { teacher: User })[]> {
    return await db.query.classes.findMany({
      with: {
        teacher: true
      },
      orderBy: (classes, { asc }) => [asc(classes.startTime)]
    });
  }

  async createClass(insertClass: InsertClass): Promise<Class> {
    const [cls] = await db.insert(classes).values(insertClass).returning();
    return cls;
  }

  async deleteClass(id: number): Promise<void> {
    await db.delete(classes).where(eq(classes.id, id));
  }

  async getClass(id: number): Promise<Class | undefined> {
    const [cls] = await db.select().from(classes).where(eq(classes.id, id));
    return cls;
  }
}

export const storage = new DatabaseStorage();
