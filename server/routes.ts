import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendStatusUpdateEmail } from "./mailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup auth first
  setupAuth(app);

  // OTP Verification (Real)
  app.post(api.auth.verifyOtp.path, async (req, res) => {
    const { email, otp } = req.body;
    
    // Find user by email
    const allUsers = await db.select().from(users).where(eq(users.email, email));
    const user = allUsers[0];
    
    if (!user) {
      return res.status(404).json({ message: "User not found with this email." });
    }

    // Verify OTP from database
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code. Please check your email." });
    }

    // Update user status to active if it was pending
    // Also clear the OTP after successful verification
    await db.update(users).set({ 
      status: 'active',
      otp: null 
    }).where(eq(users.id, user.id));
    
    // Log the user in manually
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed after verification" });
      res.json(user);
    });
  });

  app.get(api.classes.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const classes = await storage.getClasses();
    res.json(classes);
  });

  app.post(api.classes.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== 'teacher') return res.status(403).send("Only teachers can create classes");

    try {
      const bodySchema = api.classes.create.input.extend({
        startTime: z.coerce.date(),
      });
      const input = bodySchema.parse(req.body);
      // Ensure date is parsed correctly
      const classData = {
        ...input,
        teacherId: user.id
      };
      
      const cls = await storage.createClass(classData);
      res.status(201).json(cls);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
    }
  });

  app.delete(api.classes.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    const id = Number(req.params.id);
    
    const cls = await storage.getClass(id);
    if (!cls) return res.status(404).send("Class not found");
    
    if (user.role !== 'teacher' || cls.teacherId !== user.id) {
      return res.status(403).send("Not authorized");
    }

    await storage.deleteClass(id);
    res.sendStatus(200);
  });

  // Admin Routes
  app.get(api.auth.admin.users.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.sendStatus(403);
    }
    const allUsers = await storage.getAllUsers();
    res.json(allUsers);
  });

  app.patch(api.auth.admin.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.sendStatus(403);
    }
    const id = Number(req.params.id);
    const { status } = req.body;
    const updatedUser = await storage.updateUserStatus(id, status);
    
    // Send email notification for status changes (active/suspended)
    if (status === 'active' || status === 'suspended') {
      await sendStatusUpdateEmail(updatedUser.email, updatedUser.fullName, status);
    }
    
    res.json(updatedUser);
  });

  app.delete(api.auth.admin.deleteUser.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.sendStatus(403);
    }
    const id = Number(req.params.id);
    const userToDelete = await storage.getUser(id);
    if (!userToDelete) return res.status(404).send("User not found");
    if (userToDelete.role === 'admin') return res.status(403).send("Cannot delete admin");

    await storage.deleteUser(id);
    res.sendStatus(200);
  });

  // Seed data if empty
  const existingClasses = await storage.getClasses();
  if (existingClasses.length === 0) {
    // We can't easily seed with teacher relation without creating a user first.
    // We'll skip auto-seeding for now or create a dummy teacher if needed.
    // Let's create a dummy teacher if none exists?
    // Nah, let the user register.
  }

  return httpServer;
}
