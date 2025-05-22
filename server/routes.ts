import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import {
  insertUserSchema,
  insertModuleSchema,
  insertProgressSchema,
  insertAchievementSchema,
  insertProjectSchema,
  insertResourceSchema,
  insertChatMessageSchema
} from "@shared/schema";
import { simplifyText, analyzeResearchPaper, translateContent, deepResearch } from "./ai";
import { analyzeFileWithAI } from "./file-processor";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const memoryStorage = multer.memoryStorage();
  const upload = multer({ 
    storage: memoryStorage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
    fileFilter: (req, file, cb) => {
      // Accept PDF, DOCX and TXT files
      if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'text/plain'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        cb(new Error('Only PDF, DOCX and TXT files are allowed'));
      }
    }
  });
  
  // prefix all routes with /api
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    
    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Don't return the password
    const { password, ...userData } = user;
    res.json(userData);
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...userData2 } = user;
      res.status(201).json(userData2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Module routes
  app.get("/api/modules", async (req, res) => {
    const modules = await storage.getAllModules();
    res.json(modules);
  });
  
  app.get("/api/modules/:id", async (req, res) => {
    const moduleId = parseInt(req.params.id);
    if (isNaN(moduleId)) return res.status(400).json({ message: "Invalid module ID" });
    
    const module = await storage.getModule(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });
    
    res.json(module);
  });
  
  app.post("/api/modules", async (req, res) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create module" });
    }
  });
  
  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    
    const progressItems = await storage.getUserProgress(userId);
    res.json(progressItems);
  });
  
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.updateProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  
  // Achievement routes
  app.get("/api/users/:userId/achievements", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    
    const achievements = await storage.getUserAchievements(userId);
    res.json(achievements);
  });
  
  app.post("/api/achievements", async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(achievementData);
      res.status(201).json(achievement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid achievement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });
  
  // Project routes
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getAllProjects();
    res.json(projects);
  });
  
  app.get("/api/projects/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) return res.status(400).json({ message: "Invalid project ID" });
    
    const project = await storage.getProject(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    res.json(project);
  });
  
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  
  // Resource routes
  app.get("/api/resources", async (req, res) => {
    const resources = await storage.getAllResources();
    res.json(resources);
  });
  
  app.get("/api/resources/:id", async (req, res) => {
    const resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) return res.status(400).json({ message: "Invalid resource ID" });
    
    const resource = await storage.getResource(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    
    res.json(resource);
  });
  
  app.post("/api/resources", async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resource" });
    }
  });
  
  // Chat routes
  app.get("/api/users/:userId/chat", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    
    const messages = await storage.getUserChatHistory(userId);
    res.json(messages);
  });
  
  app.post("/api/chat", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const requestType = req.query.type as string || 'simplify';
      const translateToBengali = req.body.translate_to_bengali === true;
      
      // Generate AI response
      let response = "";
      let bengaliTranslation = null;
      
      try {
        if (requestType === 'deep_research') {
          response = await deepResearch(messageData.message);
        } else if (requestType === 'analyze') {
          response = await analyzeResearchPaper(messageData.message);
        } else if (requestType === 'translate') {
          const direction = req.query.direction as string || 'english_to_bengali';
          const targetLanguage = direction === 'english_to_bengali' ? 'bengali' : 'english';
          response = await translateContent(messageData.message, targetLanguage);
        } else {
          // Default to simplify
          response = await simplifyText(messageData.message);
        }
        
        // Generate Bengali translation if requested
        if (translateToBengali) {
          try {
            bengaliTranslation = await translateContent(response, 'bengali');
            console.log("Generated Bengali translation successfully");
          } catch (translationError) {
            console.error("Failed to generate Bengali translation:", translationError);
            bengaliTranslation = "Error generating Bengali translation";
          }
        }
      } catch (error) {
        console.error(`Error generating AI response (${requestType}):`, error);
        response = "Sorry, I'm having trouble processing your request right now. Please try again later.";
      }
      
      const chatMessage = await storage.createChatMessage({
        ...messageData,
        response
      });
      
      res.status(201).json({
        ...chatMessage,
        bengali_translation: bengaliTranslation
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });
  
  // Dedicated endpoint for deep research with Curio assistant
  app.post("/api/curio/research", async (req, res) => {
    try {
      const { text, userId } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text to research is required" });
      }
      
      // Process deep research request with Gemini AI
      let response;
      try {
        response = await deepResearch(text);
      } catch (error) {
        console.error("Error in deep research:", error);
        return res.status(500).json({ message: "Failed to process deep research request" });
      }
      
      // Store in chat history if userId is provided
      if (userId) {
        await storage.createChatMessage({
          userId,
          message: text,
          response
        });
      }
      
      res.json({ response });
    } catch (error) {
      console.error("Deep research error:", error);
      res.status(500).json({ message: "Failed to process deep research request" });
    }
  });

  // File upload endpoint for document analysis
  app.post("/api/document/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "No file uploaded or file type not supported. Please upload a PDF, DOCX, or TXT file." 
        });
      }
      
      const userId = req.body.userId ? parseInt(req.body.userId) : 1; // Default to user 1 if not provided
      
      // Process the uploaded file
      const result = await analyzeFileWithAI(req.file);
      
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          message: result.error || "Failed to analyze document" 
        });
      }
      
      // Store in chat history if requested
      if (req.body.saveToChat === 'true') {
        const message = `Analyzed document: ${req.file.originalname}`;
        
        await storage.createChatMessage({
          userId,
          message,
          response: result.summary || "No analysis available"
        });
      }
      
      res.status(200).json({
        success: true,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        text: result.text,
        analysis: result.summary
      });
      
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      res.status(500).json({ 
        success: false, 
        message: "An error occurred while processing your file" 
      });
    }
  });

  // Create an HTTP server from the Express app
  const httpServer = createServer(app);

  return httpServer;
}
