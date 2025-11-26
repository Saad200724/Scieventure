import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// Re-export drizzle operators for use in queries
export { eq, and } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  points: integer("points").default(0),
  level: integer("level").default(1),
  language: text("language").default("en"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  language: true,
});

// Science Modules
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  thumbnail: text("thumbnail"),
  rating: integer("rating").default(0),
  studentCount: integer("student_count").default(0),
  content: jsonb("content"),
  language: text("language").default("en"),
  educationLevel: text("education_level"),
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  title: true,
  description: true,
  subject: true,
  thumbnail: true,
  content: true,
  language: true,
  educationLevel: true,
});

// User Progress
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  completionPercentage: integer("completion_percentage").default(0),
  lastAccessed: timestamp("last_accessed").defaultNow(),
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  moduleId: true,
  completionPercentage: true,
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").default(0),
  earnedAt: timestamp("earned_at").defaultNow(),
  moduleId: integer("module_id"),
  type: text("type").notNull(),
  icon: text("icon"),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  title: true,
  description: true,
  points: true,
  moduleId: true,
  type: true,
  icon: true,
});

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  participationType: text("participation_type").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  difficulty: integer("difficulty").default(1),
  isActive: boolean("is_active").default(true),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  subject: true,
  participationType: true,
  endDate: true,
  location: true,
  difficulty: true,
  isActive: true,
});

// Resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileSize: text("file_size"),
  subject: text("subject").notNull(),
  tags: jsonb("tags"),
  downloadCount: integer("download_count").default(0),
  filePath: text("file_path").notNull(),
  thumbnail: text("thumbnail"),
  language: text("language").default("en"),
  educationLevel: text("education_level"),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  fileSize: true,
  subject: true,
  tags: true,
  filePath: true,
  thumbnail: true,
  language: true,
  educationLevel: true,
});

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  message: true,
  response: true,
});

// Project Comments (Collaboration)
export const projectComments = pgTable("project_comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: integer("user_id").notNull(),
  userName: text("user_name"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectCommentSchema = createInsertSchema(projectComments).pick({
  projectId: true,
  userId: true,
  userName: true,
  content: true,
});

// Project Participants (Collaboration)
export const projectParticipants = pgTable("project_participants", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: integer("user_id").notNull(),
  userName: text("user_name"),
  role: text("role").default("participant"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertProjectParticipantSchema = createInsertSchema(projectParticipants).pick({
  projectId: true,
  userId: true,
  userName: true,
  role: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type ProjectComment = typeof projectComments.$inferSelect;
export type InsertProjectComment = z.infer<typeof insertProjectCommentSchema>;

export type ProjectParticipant = typeof projectParticipants.$inferSelect;
export type InsertProjectParticipant = z.infer<typeof insertProjectParticipantSchema>;
