import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  users, type User, type InsertUser,
  modules, type Module, type InsertModule,
  progress, type Progress, type InsertProgress,
  achievements, type Achievement, type InsertAchievement,
  projects, type Project, type InsertProject,
  resources, type Resource, type InsertResource,
  chatMessages, type ChatMessage, type InsertChatMessage,
  eq, and
} from "../shared/schema";
import { IStorage } from "./storage";

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private sql: ReturnType<typeof postgres>;

  constructor() {
    try {
      // Get database URL from environment variable
      const dbUrl = process.env.DATABASE_URL;
      
      if (!dbUrl) {
        throw new Error("DATABASE_URL environment variable is not set");
      }
      
      // Connect to Postgres
      this.sql = postgres(dbUrl);
      this.db = drizzle(this.sql);
      
      // Log successful connection
      console.log("Connected to Postgres database successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values({
      ...user,
      points: 0,
      level: 1,
      language: user.language || "en"
    }).returning();
    return result[0];
  }

  // Module operations
  async getAllModules(): Promise<Module[]> {
    return await this.db.select().from(modules);
  }

  async getModule(id: number): Promise<Module | undefined> {
    const result = await this.db.select().from(modules).where(eq(modules.id, id));
    return result[0];
  }

  async createModule(module: InsertModule): Promise<Module> {
    const result = await this.db.insert(modules).values({
      ...module,
      rating: 0,
      studentCount: 0
    }).returning();
    return result[0];
  }

  // Progress operations
  async getUserProgress(userId: number): Promise<Progress[]> {
    return await this.db.select().from(progress).where(eq(progress.userId, userId));
  }

  async getModuleProgress(userId: number, moduleId: number): Promise<Progress | undefined> {
    const result = await this.db
      .select()
      .from(progress)
      .where(and(
        eq(progress.userId, userId),
        eq(progress.moduleId, moduleId)
      ));
    return result[0];
  }

  async updateProgress(progressData: InsertProgress): Promise<Progress> {
    // Check if progress exists
    const existingProgress = await this.getModuleProgress(
      progressData.userId,
      progressData.moduleId
    );
    
    if (existingProgress) {
      // Update existing progress
      const result = await this.db
        .update(progress)
        .set({
          completionPercentage: progressData.completionPercentage,
          lastAccessed: new Date()
        })
        .where(eq(progress.id, existingProgress.id))
        .returning();
      return result[0];
    } else {
      // Create new progress
      const result = await this.db
        .insert(progress)
        .values({
          ...progressData,
          lastAccessed: new Date()
        })
        .returning();
      return result[0];
    }
  }

  // Achievement operations
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await this.db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    // Insert the achievement
    const result = await this.db
      .insert(achievements)
      .values({
        ...achievement,
        earnedAt: new Date()
      })
      .returning();
    
    // Update user points
    const user = await this.getUser(achievement.userId);
    if (user) {
      const newPoints = (user.points || 0) + (achievement.points || 0);
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      await this.db
        .update(users)
        .set({
          points: newPoints,
          level: newLevel
        })
        .where(eq(users.id, user.id));
    }
    
    return result[0];
  }

  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return await this.db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await this.db
      .insert(projects)
      .values({
        ...project,
        isActive: true
      })
      .returning();
    return result[0];
  }

  // Resource operations
  async getAllResources(): Promise<Resource[]> {
    return await this.db.select().from(resources);
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const result = await this.db.select().from(resources).where(eq(resources.id, id));
    return result[0];
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const result = await this.db
      .insert(resources)
      .values({
        ...resource,
        downloadCount: 0
      })
      .returning();
    return result[0];
  }

  // Chat operations
  async getUserChatHistory(userId: number): Promise<ChatMessage[]> {
    return await this.db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.timestamp);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await this.db
      .insert(chatMessages)
      .values({
        ...message,
        timestamp: new Date()
      })
      .returning();
    return result[0];
  }
}