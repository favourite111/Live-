import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import cron from "node-cron";
import { db } from "./db";
import { classes, users } from "@shared/schema";
import { eq, and, gt, lt } from "drizzle-orm";
import { sendClassReminderEmail } from "./mailer";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '10mb' }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );

  // Class reminders cron job - runs every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    log("Running class reminders check...", "cron");
    const now = new Date();
    const reminderWindowStart = new Date(now.getTime() + 25 * 60000); // 25 mins from now
    const reminderWindowEnd = new Date(now.getTime() + 35 * 60000);   // 35 mins from now

    try {
      const upcomingClasses = await db.query.classes.findMany({
        where: and(
          gt(classes.startTime, reminderWindowStart),
          lt(classes.startTime, reminderWindowEnd),
          eq(classes.reminderSent, false)
        ),
        with: {
          teacher: true
        }
      });

      for (const cls of upcomingClasses) {
        log(`Sending reminder for class: ${cls.title}`, "cron");
        // Send reminder to teacher
        await sendClassReminderEmail(cls.teacher.email, cls.teacher.fullName, {
          title: cls.title,
          startTime: cls.startTime.toLocaleString(),
          meetingLink: cls.meetingLink
        });
        
        // Mark as sent
        await db.update(classes).set({ reminderSent: true }).where(eq(classes.id, cls.id));
      }
    } catch (err) {
      log(`Error in reminders cron: ${err}`, "cron");
    }
  });
})();
