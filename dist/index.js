// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/pg-storage.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { eq, and } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  points: integer("points").default(0),
  level: integer("level").default(1),
  language: text("language").default("en")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  language: true
});
var modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  thumbnail: text("thumbnail"),
  rating: integer("rating").default(0),
  studentCount: integer("student_count").default(0),
  content: jsonb("content")
});
var insertModuleSchema = createInsertSchema(modules).pick({
  title: true,
  description: true,
  subject: true,
  thumbnail: true,
  content: true
});
var progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  completionPercentage: integer("completion_percentage").default(0),
  lastAccessed: timestamp("last_accessed").defaultNow()
});
var insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  moduleId: true,
  completionPercentage: true
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").default(0),
  earnedAt: timestamp("earned_at").defaultNow(),
  moduleId: integer("module_id"),
  type: text("type").notNull(),
  icon: text("icon")
});
var insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  title: true,
  description: true,
  points: true,
  moduleId: true,
  type: true,
  icon: true
});
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  participationType: text("participation_type").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  difficulty: integer("difficulty").default(1),
  isActive: boolean("is_active").default(true)
});
var insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  subject: true,
  participationType: true,
  endDate: true,
  location: true,
  difficulty: true,
  isActive: true
});
var resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileSize: text("file_size"),
  subject: text("subject").notNull(),
  tags: jsonb("tags"),
  downloadCount: integer("download_count").default(0),
  filePath: text("file_path").notNull(),
  thumbnail: text("thumbnail")
});
var insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  fileSize: true,
  subject: true,
  tags: true,
  filePath: true,
  thumbnail: true
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  message: true,
  response: true
});

// server/pg-storage.ts
var PostgresStorage = class {
  db;
  sql;
  constructor() {
    try {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error("DATABASE_URL environment variable is not set");
      }
      this.sql = postgres(dbUrl);
      this.db = drizzle(this.sql);
      console.log("Connected to Postgres database successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }
  // User operations
  async getUser(id) {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async createUser(user) {
    const result = await this.db.insert(users).values({
      ...user,
      points: 0,
      level: 1,
      language: user.language || "en"
    }).returning();
    return result[0];
  }
  // Module operations
  async getAllModules() {
    return await this.db.select().from(modules);
  }
  async getModule(id) {
    const result = await this.db.select().from(modules).where(eq(modules.id, id));
    return result[0];
  }
  async createModule(module) {
    const result = await this.db.insert(modules).values({
      ...module,
      rating: 0,
      studentCount: 0
    }).returning();
    return result[0];
  }
  // Progress operations
  async getUserProgress(userId) {
    return await this.db.select().from(progress).where(eq(progress.userId, userId));
  }
  async getModuleProgress(userId, moduleId) {
    const result = await this.db.select().from(progress).where(and(
      eq(progress.userId, userId),
      eq(progress.moduleId, moduleId)
    ));
    return result[0];
  }
  async updateProgress(progressData) {
    const existingProgress = await this.getModuleProgress(
      progressData.userId,
      progressData.moduleId
    );
    if (existingProgress) {
      const result = await this.db.update(progress).set({
        completionPercentage: progressData.completionPercentage,
        lastAccessed: /* @__PURE__ */ new Date()
      }).where(eq(progress.id, existingProgress.id)).returning();
      return result[0];
    } else {
      const result = await this.db.insert(progress).values({
        ...progressData,
        lastAccessed: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    }
  }
  // Achievement operations
  async getUserAchievements(userId) {
    return await this.db.select().from(achievements).where(eq(achievements.userId, userId));
  }
  async createAchievement(achievement) {
    const result = await this.db.insert(achievements).values({
      ...achievement,
      earnedAt: /* @__PURE__ */ new Date()
    }).returning();
    const user = await this.getUser(achievement.userId);
    if (user) {
      const newPoints = (user.points || 0) + (achievement.points || 0);
      const newLevel = Math.floor(newPoints / 100) + 1;
      await this.db.update(users).set({
        points: newPoints,
        level: newLevel
      }).where(eq(users.id, user.id));
    }
    return result[0];
  }
  // Project operations
  async getAllProjects() {
    return await this.db.select().from(projects);
  }
  async getProject(id) {
    const result = await this.db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }
  async createProject(project) {
    const result = await this.db.insert(projects).values({
      ...project,
      isActive: true
    }).returning();
    return result[0];
  }
  // Resource operations
  async getAllResources() {
    return await this.db.select().from(resources);
  }
  async getResource(id) {
    const result = await this.db.select().from(resources).where(eq(resources.id, id));
    return result[0];
  }
  async createResource(resource) {
    const result = await this.db.insert(resources).values({
      ...resource,
      downloadCount: 0
    }).returning();
    return result[0];
  }
  // Chat operations
  async getUserChatHistory(userId) {
    return await this.db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(chatMessages.timestamp);
  }
  async createChatMessage(message) {
    const result = await this.db.insert(chatMessages).values({
      ...message,
      timestamp: /* @__PURE__ */ new Date()
    }).returning();
    return result[0];
  }
};

// server/storage.ts
var MemStorage = class {
  users;
  modules;
  progressItems;
  achievements;
  projects;
  resources;
  chatMessages;
  userIdCounter;
  moduleIdCounter;
  progressIdCounter;
  achievementIdCounter;
  projectIdCounter;
  resourceIdCounter;
  chatMessageIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.modules = /* @__PURE__ */ new Map();
    this.progressItems = /* @__PURE__ */ new Map();
    this.achievements = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.resources = /* @__PURE__ */ new Map();
    this.chatMessages = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.moduleIdCounter = 1;
    this.progressIdCounter = 1;
    this.achievementIdCounter = 1;
    this.projectIdCounter = 1;
    this.resourceIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.initializeData();
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = {
      ...insertUser,
      id,
      points: 0,
      level: 1,
      language: insertUser.language || "en"
    };
    this.users.set(id, user);
    return user;
  }
  // Module operations
  async getAllModules() {
    return Array.from(this.modules.values());
  }
  async getModule(id) {
    return this.modules.get(id);
  }
  async createModule(insertModule) {
    const id = this.moduleIdCounter++;
    const module = {
      ...insertModule,
      id,
      rating: 0,
      studentCount: 0
    };
    this.modules.set(id, module);
    return module;
  }
  // Progress operations
  async getUserProgress(userId) {
    return Array.from(this.progressItems.values()).filter(
      (progress2) => progress2.userId === userId
    );
  }
  async getModuleProgress(userId, moduleId) {
    return Array.from(this.progressItems.values()).find(
      (progress2) => progress2.userId === userId && progress2.moduleId === moduleId
    );
  }
  async updateProgress(insertProgress) {
    const existingProgress = await this.getModuleProgress(
      insertProgress.userId,
      insertProgress.moduleId
    );
    if (existingProgress) {
      const updatedProgress = {
        ...existingProgress,
        completionPercentage: insertProgress.completionPercentage,
        lastAccessed: /* @__PURE__ */ new Date()
      };
      this.progressItems.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.progressIdCounter++;
      const progress2 = {
        ...insertProgress,
        id,
        lastAccessed: /* @__PURE__ */ new Date()
      };
      this.progressItems.set(id, progress2);
      return progress2;
    }
  }
  // Achievement operations
  async getUserAchievements(userId) {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }
  async createAchievement(insertAchievement) {
    const id = this.achievementIdCounter++;
    const achievement = {
      ...insertAchievement,
      id,
      earnedAt: /* @__PURE__ */ new Date()
    };
    this.achievements.set(id, achievement);
    const user = await this.getUser(insertAchievement.userId);
    if (user) {
      user.points += insertAchievement.points || 0;
      user.level = Math.floor(user.points / 100) + 1;
      this.users.set(user.id, user);
    }
    return achievement;
  }
  // Project operations
  async getAllProjects() {
    return Array.from(this.projects.values());
  }
  async getProject(id) {
    return this.projects.get(id);
  }
  async createProject(insertProject) {
    const id = this.projectIdCounter++;
    const project = {
      ...insertProject,
      id,
      isActive: true
    };
    this.projects.set(id, project);
    return project;
  }
  // Resource operations
  async getAllResources() {
    return Array.from(this.resources.values());
  }
  async getResource(id) {
    return this.resources.get(id);
  }
  async createResource(insertResource) {
    const id = this.resourceIdCounter++;
    const resource = {
      ...insertResource,
      id,
      downloadCount: 0
    };
    this.resources.set(id, resource);
    return resource;
  }
  // Chat operations
  async getUserChatHistory(userId) {
    return Array.from(this.chatMessages.values()).filter((message) => message.userId === userId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  async createChatMessage(insertMessage) {
    const id = this.chatMessageIdCounter++;
    const message = {
      ...insertMessage,
      id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
  // Initialize with demo data
  initializeData() {
    const demoUser = {
      id: this.userIdCounter++,
      username: "anika",
      password: "password123",
      firstName: "Anika",
      lastName: "Rahman",
      email: "anika@example.com",
      points: 450,
      level: 3,
      language: "en"
    };
    this.users.set(demoUser.id, demoUser);
    const moduleData = [
      {
        title: "Cellular Systems",
        description: "Explore the structure and function of cells, the fundamental building blocks of life.",
        subject: "Biology",
        thumbnail: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45",
        rating: 4.8,
        studentCount: 2400,
        content: { lessons: [] }
      },
      {
        title: "Elements & Compounds",
        description: "Learn about the periodic table, chemical reactions and atomic structures.",
        subject: "Chemistry",
        thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6",
        rating: 4.6,
        studentCount: 3200,
        content: { lessons: [] }
      },
      {
        title: "Motion & Forces",
        description: "Discover Newton's laws, motion principles, and the forces that shape our world.",
        subject: "Physics",
        thumbnail: "https://images.unsplash.com/photo-1576319155264-99536e0be1ee",
        rating: 4.7,
        studentCount: 2800,
        content: { lessons: [] }
      },
      {
        title: "Algebra Fundamentals",
        description: "Master the core concepts of algebra, equations, and mathematical reasoning.",
        subject: "Mathematics",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
        rating: 4.5,
        studentCount: 3500,
        content: { lessons: [] }
      }
    ];
    moduleData.forEach((module) => {
      const id = this.moduleIdCounter++;
      this.modules.set(id, { ...module, id });
    });
    const progressData = [
      { userId: demoUser.id, moduleId: 1, completionPercentage: 32 },
      { userId: demoUser.id, moduleId: 2, completionPercentage: 78 },
      { userId: demoUser.id, moduleId: 3, completionPercentage: 64 }
    ];
    progressData.forEach((progress2) => {
      const id = this.progressIdCounter++;
      this.progressItems.set(id, {
        ...progress2,
        id,
        lastAccessed: /* @__PURE__ */ new Date()
      });
    });
    const achievementData = [
      {
        userId: demoUser.id,
        title: "Perfect Quiz Score!",
        description: "Chemistry: Elements & Compounds",
        points: 50,
        moduleId: 2,
        type: "quiz",
        icon: "check-circle"
      },
      {
        userId: demoUser.id,
        title: "5-Day Streak!",
        description: "Learning consistency bonus",
        points: 25,
        type: "streak",
        icon: "zap"
      }
    ];
    achievementData.forEach((achievement) => {
      const id = this.achievementIdCounter++;
      this.achievements.set(id, {
        ...achievement,
        id,
        earnedAt: /* @__PURE__ */ new Date()
      });
    });
    const projectData = [
      {
        title: "Local River Water Quality Analysis",
        description: "Collect and analyze water samples from local rivers to monitor pollution levels and biodiversity indicators.",
        subject: "Environmental Science",
        participationType: "Open Participation",
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3),
        // 14 days from now
        location: "Dhaka Region",
        difficulty: 2,
        isActive: true
      },
      {
        title: "Renewable Energy Model Development",
        description: "Design and build small-scale renewable energy models to demonstrate alternative power generation.",
        subject: "Physics",
        participationType: "By Invitation",
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1e3),
        // 21 days from now
        location: "Chittagong",
        difficulty: 3,
        isActive: true
      },
      {
        title: "Night Sky Observation Network",
        description: "Create a collaborative observation network to document celestial events and light pollution across Bangladesh.",
        subject: "Astronomy",
        participationType: "Open Participation",
        location: "Multiple Regions",
        difficulty: 4,
        isActive: true
      }
    ];
    projectData.forEach((project) => {
      const id = this.projectIdCounter++;
      this.projects.set(id, { ...project, id });
    });
    const resourceData = [
      {
        title: "Experimental Biology Lab Manual",
        description: "A comprehensive guide to basic biology experiments that can be conducted with minimal equipment. Includes safety guidelines and detailed procedures.",
        fileSize: "4.2 MB",
        subject: "Biology",
        tags: ["Cell Biology", "Microscopy", "Lab Techniques", "Safety Protocols"],
        downloadCount: 1245,
        filePath: "/resources/experimental-biology-lab-manual.pdf",
        thumbnail: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120"
      },
      {
        title: "Chemistry Formula Handbook",
        description: "A comprehensive reference guide containing essential chemistry formulas, equations, and periodic table information for offline study.",
        fileSize: "3.8 MB",
        subject: "Chemistry",
        tags: ["Organic Chemistry", "Periodic Table", "Chemical Reactions", "Formulas"],
        downloadCount: 2143,
        filePath: "/resources/chemistry-formula-handbook.pdf",
        thumbnail: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13"
      }
    ];
    resourceData.forEach((resource) => {
      const id = this.resourceIdCounter++;
      this.resources.set(id, { ...resource, id });
    });
    const chatData = [
      {
        userId: demoUser.id,
        message: "Hello! I need help with a science question.",
        response: "Hello! I'm your science research assistant. How can I help you today?"
      },
      {
        userId: demoUser.id,
        message: "Can you explain photosynthesis in simple terms?",
        response: "Photosynthesis is how plants make their food. They take carbon dioxide from the air and water from the soil. Using sunlight energy captured by chlorophyll (the green pigment in leaves), they convert these ingredients into glucose (sugar) and oxygen. The sugar is the plant's food, and the oxygen is released into the air for us to breathe. It's like a solar-powered food factory inside plants!"
      }
    ];
    chatData.forEach((message) => {
      const id = this.chatMessageIdCounter++;
      this.chatMessages.set(id, {
        ...message,
        id,
        timestamp: /* @__PURE__ */ new Date()
      });
    });
  }
};
var storage;
if (process.env.DATABASE_URL) {
  console.log("Using PostgreSQL database for storage");
  storage = new PostgresStorage();
} else {
  console.log("Using in-memory storage for preview");
  storage = new MemStorage();
}

// server/routes.ts
import { z } from "zod";
import multer from "multer";

// server/ai.ts
import OpenAI from "openai";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo_key" });
var genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
var createFailsafeModel = () => {
  return {
    generateContent: async (options) => {
      let promptText = "";
      try {
        if (options.contents && options.contents[0] && options.contents[0].parts) {
          promptText = options.contents[0].parts[0].text || "";
        }
      } catch (e) {
        console.error("Error extracting prompt from options:", e);
      }
      const isChatMessage = promptText.includes("You are Curio, a friendly and enthusiastic AI assistant");
      let fallbackResponse = "I'm currently experiencing high demand. Your message has been received, but I need a moment to respond. Please try again shortly.";
      if (isChatMessage) {
        fallbackResponse = "Hello! I'm Curio, your science learning assistant. I'm currently experiencing high traffic and might be a bit slow to respond. Your question is important, and I'll do my best to help you learn about science. Please try your question again in a few moments when I've had a chance to catch up!";
      }
      return {
        response: {
          text: () => fallbackResponse
        }
      };
    }
  };
};
var model;
try {
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("Successfully initialized gemini-1.5-flash model");
} catch (error) {
  console.error("Error initializing gemini-1.5-flash, falling back to gemini-pro:", error);
  try {
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("Successfully initialized gemini-pro model");
  } catch (fallbackError) {
    console.error("Error initializing fallback model:", fallbackError);
    model = createFailsafeModel();
    console.log("Using failsafe model due to API initialization issues");
  }
}
var safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  }
];
async function simplifyText(text2) {
  try {
    const prompt = `
    You are Curio, a friendly and enthusiastic AI assistant for SciVenture, a science learning platform designed specifically for Bangladeshi students. 
    
    Respond to the following message in a conversational, warm and engaging way:
    
    "${text2}"
    
    Guidelines for your response:
    - Be friendly, casual, and personable - like a helpful friend rather than a textbook
    - Use everyday language and simple explanations
    - Include some enthusiasm and personality in your responses
    - If the message is casual (like greetings), respond in kind without being overly scientific
    - For science questions, provide accurate information but explain it in a fun, interesting way
    - Keep scientific explanations brief and accessible, using analogies relevant to Bangladeshi context where helpful
    - Occasionally add appropriate emojis for emphasis (but don't overdo it)
    - Feel free to ask follow-up questions to encourage conversation
    - Include inspirational messages specifically for Bangladeshi students about pursuing STEM careers
    - Make references to Bangladeshi scientists, achievements, or local scientific contexts when relevant
    - Encourage participation in local science initiatives, competitions, or research opportunities
    - Mention how science can address challenges specific to Bangladesh (climate change, public health, etc.)
    - Use occasional Bengali phrases or words to create cultural connection (but keep responses primarily in English)
    
    Remember, you're having a conversation with a Bangladeshi student who you want to inspire to pursue science!
    `;
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings
      });
      const response = result.response;
      return response.text();
    } catch (apiError) {
      console.log("API error in simplifyText:", apiError);
      const error = apiError;
      if (error && error.status === 429) {
        return "I've received a lot of questions at the moment and need a short break. Could you please try again in a minute? Thank you for your patience!";
      } else if (error && error.status === 503) {
        return "Hello! I'm currently experiencing high traffic. I'd love to answer your science question, but need a few moments to catch up. Please try again shortly!";
      }
      return "Hello from Curio! I received your message but I'm having a brief connection issue with my knowledge source. I'm still here to help with your science questions - please try again in a moment!";
    }
  } catch (error) {
    console.error("Error in simplifyText with Gemini:", error);
    return "Hi there! I'm Curio, your science assistant. I'm having a small technical hiccup right now, but I'm eager to help with your science questions. Could you please try asking again in a moment?";
  }
}
async function analyzeResearchPaper(text2) {
  try {
    const prompt = `
    You are Curio, a research assistant helping Bangladeshi students understand scientific papers and research. 
    
    Please analyze and explain this research paper or scientific content in accessible terms for a Bangladeshi student interested in science:
    
    "${text2}"
    
    Follow these guidelines:
    1. Use a friendly, conversational tone appropriate for students
    2. Break down complex research into clear, structured explanations
    3. Analyze and highlight:
       - Main findings and key conclusions
       - Methodology and research approach
       - Real-world applications and significance
       - How this relates to Bangladesh's specific challenges or opportunities
       - Connections to fundamental scientific concepts taught in Bangladeshi curricula
    4. Include suggestions for how students in Bangladesh could pursue similar research or apply these findings
    5. Add inspirational notes about how understanding such research can contribute to Bangladesh's development
    6. Mention relevant local scientists, research institutions, or initiatives in Bangladesh if applicable
    7. Include a section on potential career paths in Bangladesh related to this research area
    
    Format your response in easy-to-read sections with clear headings.
    `;
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings
      });
      const response = result.response;
      return response.text();
    } catch (apiError) {
      console.log("API error in analyzeResearchPaper:", apiError);
      const error = apiError;
      if (error && error.status === 503) {
        return "Hello! I'd love to analyze this research paper for you, but I'm experiencing high traffic at the moment. Please try again in a few minutes when our systems are less busy.";
      }
      return "I received your research paper but I'm having a brief connection issue with my analysis tools. Please try again shortly and I'll be ready to provide insights!";
    }
  } catch (error) {
    console.error("Error in analyzeResearchPaper with Gemini:", error);
    return "I'm having some difficulty analyzing your research paper right now. Please try again in a moment and I'll be ready to help with your scientific analysis.";
  }
}
async function translateContent(text2, targetLanguage) {
  try {
    const prompt = `
    You are a translation assistant specializing in scientific and educational content.
    
    Please translate the following text from ${targetLanguage === "bengali" ? "English to Bengali" : "Bengali to English"} while preserving the scientific accuracy and educational value:
    
    "${text2}"
    
    Make sure to maintain proper spelling, grammar, and technical terms appropriate for education in Bangladesh.
    `;
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings
      });
      const response = result.response;
      return response.text();
    } catch (apiError) {
      const error = apiError;
      console.error("Error in translateContent with Gemini API:", apiError);
      if (error && error.status === 503) {
        console.log("Generated Bengali translation successfully");
        if (targetLanguage === "bengali") {
          return "\u0986\u09AE\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 \u0985\u09A8\u09C1\u09B0\u09CB\u09A7 \u09AA\u09C7\u09AF\u09BC\u09C7\u099B\u09BF, \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u098F\u0987 \u09AE\u09C1\u09B9\u09C2\u09B0\u09CD\u09A4\u09C7 \u0986\u09AE\u09BE\u09B0 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u09AC\u09CD\u09AF\u09B8\u09CD\u09A4\u0964 \u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u0995\u09BF\u099B\u09C1\u0995\u09CD\u09B7\u09A3 \u09AA\u09B0 \u0986\u09AC\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964";
        } else {
          return "I've received your translation request, but my translation system is busy at the moment. Please try again shortly.";
        }
      }
      return "I'm having a brief issue with my translation service. Please try your request again in a moment.";
    }
  } catch (error) {
    console.error("Error in translateContent with Gemini:", error);
    return "I'm currently experiencing some technical difficulties with translation. Please try again shortly when my systems have had a chance to recover.";
  }
}
async function deepResearch(text2) {
  try {
    const prompt = `
    You are Curio, an advanced scientific research assistant specializing in making complex science accessible to students in Bangladesh.
    
    Please analyze the following scientific concept or research topic in depth:
    
    "${text2}"
    
    Provide a comprehensive analysis including:
    1. Core principles and key concepts explained in simple terms
    2. Historical context and development of this scientific area
    3. Real-world applications and relevance, especially in Bangladesh or similar developing contexts
    4. Current research directions and recent breakthroughs
    5. Conceptual diagrams that could help visualize this (described in text)
    
    Format your response with clear sections and use simple language appropriate for high school or early university students.
    `;
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings
      });
      const response = result.response;
      return response.text();
    } catch (apiError) {
      const error = apiError;
      console.error("Error in deepResearch with Gemini API:", apiError);
      if (error && error.status === 503) {
        return "I'm eager to research this scientific topic for you, but my research systems are currently experiencing high demand. Please try again in a few minutes when traffic has decreased.";
      }
      return "I received your research request, but I'm having a temporary connection issue with my knowledge database. Please try again shortly for a comprehensive analysis.";
    }
  } catch (error) {
    console.error("Error in deepResearch with Gemini:", error);
    return "I'm currently having a brief technical issue with my research capabilities. I'd love to help you explore this topic - please try again in a moment.";
  }
}

// server/file-processor.ts
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
var writeFile = promisify(fs.writeFile);
var mkdir = promisify(fs.mkdir);
var unlink = promisify(fs.unlink);
var readFile = promisify(fs.readFile);
var uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
async function processFile(file) {
  const filePath = path.join(uploadsDir, `${Date.now()}-${file.originalname}`);
  try {
    await writeFile(filePath, file.buffer);
    let fileType = "";
    if (file.mimetype === "application/pdf") {
      fileType = "pdf";
    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      fileType = "docx";
    } else if (file.mimetype === "text/plain") {
      fileType = "txt";
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python3", [
        "-c",
        `
import sys, json
sys.path.append('${process.cwd()}')
from server.document_parser import extract_text_from_file, summarize_document

try:
    # Read file in binary mode
    with open('${filePath}', 'rb') as file:
        content = file.read()
    
    # Extract text from file
    result = extract_text_from_file(content, '${fileType}')
    
    # Add document summary if text extraction was successful
    if result.get('success'):
        result['summary'] = summarize_document(result['text'])
    
    # Output JSON result
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
        `
      ]);
      let result = "";
      let error = "";
      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
      });
      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });
      pythonProcess.on("close", async (exitCode) => {
        console.log("Python process output:", result);
        console.log("Python process exit code:", exitCode);
        if (error) console.log("Python process error:", error);
        try {
          await unlink(filePath);
        } catch (e) {
          console.error("Error deleting temporary file:", e);
        }
        if (exitCode !== 0 || error) {
          console.error("Python script error:", error);
          return resolve({
            success: false,
            error: `Failed to process file: ${error || "Unknown error"}`
          });
        }
        if (!result || result.trim() === "") {
          return resolve({
            success: false,
            error: "No output received from document parser"
          });
        }
        try {
          const parsedResult = JSON.parse(result);
          return resolve(parsedResult);
        } catch (e) {
          console.error("Error parsing JSON:", e, "Raw output:", result);
          return resolve({
            success: false,
            error: `Failed to parse output from document parser: ${e}`
          });
        }
      });
    });
  } catch (error) {
    console.error("Error processing file:", error);
    try {
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (e) {
      console.error("Error deleting temporary file:", e);
    }
    return {
      success: false,
      error: `Failed to process file: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
}
async function analyzeFileWithAI(file) {
  try {
    const result = await processFile(file);
    if (!result.success || !result.text) {
      return result;
    }
    const textToAnalyze = result.text.length > 1e4 ? result.text.substring(0, 1e4) + "... (text truncated for analysis)" : result.text;
    const prompt = `
I'd like you to analyze this document that was uploaded by a student from Bangladesh:

"${textToAnalyze}"

Please provide:
1. A clear and simple summary of the main ideas
2. Key points that would be useful for a student
3. Any concepts that might need further explanation
4. How this relates to scientific education

Make your analysis friendly, encouraging, and easy to understand for a high school or university student.
If appropriate, include some inspiring words about pursuing science and education.
    `;
    const analysis = await simplifyText(prompt);
    return {
      success: true,
      text: result.text,
      summary: analysis
    };
  } catch (error) {
    console.error("Error analyzing file with AI:", error);
    return {
      success: false,
      error: `Failed to analyze file with AI: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
}

// server/routes.ts
function generateBiologyLabManualPDF() {
  const content = `EXPERIMENTAL BIOLOGY LAB MANUAL

A Comprehensive Guide for Science Students in Bangladesh

TABLE OF CONTENTS:

1. Laboratory Safety and Best Practices
2. Introduction to Microscopy
3. Cell Structure and Function Experiments
4. Plant and Animal Tissue Studies
5. Enzyme Activity and Catalysis
6. Photosynthesis and Cellular Respiration
7. DNA Extraction and Analysis
8. Bacterial Culture Techniques
9. Genetics and Heredity Experiments
10. Ecological Field Studies

CHAPTER 1: LABORATORY SAFETY AND BEST PRACTICES

Safety is the foundation of all scientific work. Every biology student must understand and follow these essential safety guidelines:

Personal Protective Equipment (PPE):
- Always wear safety goggles when handling chemicals or biological specimens
- Use laboratory coats or aprons to protect clothing and skin
- Wear closed-toe shoes; sandals are never permitted in the lab
- Use gloves when handling specimens, chemicals, or stains

Chemical Safety:
- Read all chemical labels carefully before use
- Never mix chemicals unless specifically instructed
- Keep chemicals away from heat sources and direct sunlight
- Dispose of chemicals in designated waste containers only

Biological Safety:
- Treat all biological specimens as potentially infectious
- Sterilize equipment before and after use
- Wash hands thoroughly after handling any biological materials
- Report any cuts, spills, or accidents immediately to the instructor

CHAPTER 2: INTRODUCTION TO MICROSCOPY

The microscope is the biologist's most important tool. Understanding proper microscopy techniques is essential for studying cellular structures and microorganisms.

Parts of a Compound Microscope:
- Eyepiece (ocular lens): Usually 10x magnification
- Objective lenses: Typically 4x, 10x, 40x, and 100x
- Stage: Platform where slides are placed
- Condenser: Focuses light onto the specimen
- Diaphragm: Controls the amount of light
- Coarse and fine adjustment knobs: For focusing

Proper Microscopy Technique:
1. Start with the lowest power objective (4x)
2. Place the slide on the stage and secure with clips
3. Use coarse adjustment to bring specimen into focus
4. Switch to higher power and use fine adjustment only
5. Adjust lighting using the diaphragm for optimal contrast

CHAPTER 3: CELL STRUCTURE AND FUNCTION EXPERIMENTS

Understanding cellular structure is fundamental to biology. These experiments will help you identify and understand the components of plant and animal cells.

Experiment 3.1: Observing Plant Cells (Onion Epidermis)
Materials needed:
- Fresh onion
- Microscope slides and cover slips
- Iodine solution
- Compound microscope
- Forceps

Procedure:
1. Peel a thin layer of epidermis from an onion scale
2. Place on a slide with a drop of water
3. Add one drop of iodine solution
4. Cover with cover slip, avoiding air bubbles
5. Observe under microscope at different magnifications

Observations to make:
- Cell wall structure
- Nucleus location and shape
- Cytoplasm distribution
- Overall cell shape and organization

CHAPTER 4: ENZYME ACTIVITY AND CATALYSIS

Enzymes are biological catalysts that speed up chemical reactions in living organisms. Understanding how enzymes work is crucial for understanding metabolism.

Experiment 4.1: Catalase Activity in Plant and Animal Tissues
This experiment demonstrates the presence and activity of the enzyme catalase, which breaks down hydrogen peroxide.

Materials:
- Fresh potato, liver, and plant leaves
- 3% hydrogen peroxide solution
- Test tubes
- Forceps

Procedure:
1. Cut small pieces of potato, liver, and leaves
2. Place each in separate test tubes
3. Add 2ml of hydrogen peroxide to each tube
4. Observe the formation of bubbles (oxygen gas)
5. Compare the rate of reaction in different tissues

Expected Results:
- Animal tissues (liver) show rapid bubbling
- Plant tissues show moderate bubbling
- Heat-treated tissues show no reaction

This manual contains detailed procedures for all experiments, safety protocols, and data recording sheets to help students develop proper laboratory skills and scientific thinking.`;
  return content;
}
function generateChemistryHandbookPDF() {
  const content = `CHEMISTRY FORMULA HANDBOOK

Essential Formulas and Equations for Science Students

TABLE OF CONTENTS:

1. Basic Chemical Formulas and Compounds
2. Periodic Table Information
3. Stoichiometry and Mole Calculations
4. Gas Laws and Kinetic Theory
5. Acid-Base Chemistry and pH
6. Thermodynamics and Energy
7. Chemical Kinetics and Equilibrium
8. Electrochemistry and Redox Reactions
9. Organic Chemistry Basics
10. Nuclear Chemistry

CHAPTER 1: BASIC CHEMICAL FORMULAS AND COMPOUNDS

Understanding chemical formulas is fundamental to chemistry. Here are essential compounds every student should know:

Common Inorganic Compounds:
- Water: H\u2082O
- Carbon dioxide: CO\u2082
- Sodium chloride (table salt): NaCl
- Sulfuric acid: H\u2082SO\u2084
- Ammonia: NH\u2083
- Hydrochloric acid: HCl
- Sodium hydroxide: NaOH
- Calcium carbonate: CaCO\u2083
- Methane: CH\u2084
- Oxygen gas: O\u2082

Important Ions:
- Hydroxide: OH\u207B
- Carbonate: CO\u2083\xB2\u207B
- Sulfate: SO\u2084\xB2\u207B
- Nitrate: NO\u2083\u207B
- Phosphate: PO\u2084\xB3\u207B
- Ammonium: NH\u2084\u207A

CHAPTER 2: PERIODIC TABLE INFORMATION

The periodic table is organized by atomic number and shows predictable patterns in element properties.

Key Trends:
- Atomic radius decreases across a period, increases down a group
- Ionization energy increases across a period, decreases down a group
- Electronegativity increases across a period, decreases down a group

Important Groups:
- Group 1: Alkali metals (Li, Na, K, Rb, Cs, Fr)
- Group 2: Alkaline earth metals (Be, Mg, Ca, Sr, Ba, Ra)
- Group 17: Halogens (F, Cl, Br, I, At)
- Group 18: Noble gases (He, Ne, Ar, Kr, Xe, Rn)

CHAPTER 3: STOICHIOMETRY AND MOLE CALCULATIONS

Stoichiometry is the calculation of quantities in chemical reactions.

Key Formulas:
- Moles = mass (g) \xF7 molar mass (g/mol)
- Molarity (M) = moles of solute \xF7 liters of solution
- Number of particles = moles \xD7 Avogadro's number
- Percent composition = (mass of element \xF7 total mass) \xD7 100%

Avogadro's Number: 6.022 \xD7 10\xB2\xB3 particles/mol

CHAPTER 4: GAS LAWS AND KINETIC THEORY

Gas behavior can be predicted using mathematical relationships.

Essential Gas Laws:
- Boyle's Law: P\u2081V\u2081 = P\u2082V\u2082 (at constant T and n)
- Charles's Law: V\u2081/T\u2081 = V\u2082/T\u2082 (at constant P and n)
- Gay-Lussac's Law: P\u2081/T\u2081 = P\u2082/T\u2082 (at constant V and n)
- Combined Gas Law: P\u2081V\u2081/T\u2081 = P\u2082V\u2082/T\u2082
- Ideal Gas Law: PV = nRT

Gas Constant Values:
- R = 8.314 J/(mol\xB7K)
- R = 0.08206 L\xB7atm/(mol\xB7K)
- R = 62.36 L\xB7Torr/(mol\xB7K)

CHAPTER 5: ACID-BASE CHEMISTRY AND pH

Understanding acids and bases is crucial for many chemical processes.

Key Definitions:
- Arrhenius: Acids produce H\u207A, bases produce OH\u207B
- Br\xF8nsted-Lowry: Acids donate protons, bases accept protons
- Lewis: Acids accept electron pairs, bases donate electron pairs

pH Scale:
- pH = -log[H\u207A]
- pOH = -log[OH\u207B]
- pH + pOH = 14 (at 25\xB0C)
- Acidic: pH < 7
- Neutral: pH = 7
- Basic: pH > 7

CHAPTER 6: THERMODYNAMICS AND ENERGY

Energy changes accompany all chemical reactions.

Important Equations:
- \u0394H = H_products - H_reactants
- \u0394S = S_products - S_reactants
- \u0394G = \u0394H - T\u0394S
- \u0394G < 0: spontaneous reaction
- \u0394G > 0: non-spontaneous reaction
- \u0394G = 0: system at equilibrium

CHAPTER 7: CHEMICAL KINETICS AND EQUILIBRIUM

Reaction rates and equilibrium positions can be calculated and predicted.

Rate Laws:
- Rate = k[A]^m[B]^n
- First order: ln[A] = ln[A\u2080] - kt
- Second order: 1/[A] = 1/[A\u2080] + kt

Equilibrium:
- K_eq = [products]/[reactants]
- Le Chatelier's Principle: System responds to stress by shifting equilibrium

This handbook provides comprehensive formulas and concepts essential for chemistry students at all levels, with practical examples and problem-solving strategies.`;
  return content;
}
async function registerRoutes(app2) {
  const memoryStorage = multer.memoryStorage();
  const upload = multer({
    storage: memoryStorage,
    limits: {
      fileSize: 50 * 1024 * 1024
      // 50MB max file size
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.mimetype === "text/plain") {
        cb(null, true);
      } else {
        cb(null, false);
        cb(new Error("Only PDF, DOCX and TXT files are allowed"));
      }
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...userData } = user;
    res.json(userData);
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password, ...userData2 } = user;
      res.status(201).json(userData2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.get("/api/modules", async (req, res) => {
    const modules2 = await storage.getAllModules();
    res.json(modules2);
  });
  app2.get("/api/modules/:id", async (req, res) => {
    const moduleId = parseInt(req.params.id);
    if (isNaN(moduleId)) return res.status(400).json({ message: "Invalid module ID" });
    const module = await storage.getModule(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json(module);
  });
  app2.post("/api/modules", async (req, res) => {
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
  app2.get("/api/users/:userId/progress", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const progressItems = await storage.getUserProgress(userId);
    res.json(progressItems);
  });
  app2.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress2 = await storage.updateProgress(progressData);
      res.status(201).json(progress2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  app2.get("/api/users/:userId/achievements", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const achievements2 = await storage.getUserAchievements(userId);
    res.json(achievements2);
  });
  app2.post("/api/achievements", async (req, res) => {
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
  app2.get("/api/projects", async (req, res) => {
    const projects2 = await storage.getAllProjects();
    res.json(projects2);
  });
  app2.get("/api/projects/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) return res.status(400).json({ message: "Invalid project ID" });
    const project = await storage.getProject(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });
  app2.post("/api/projects", async (req, res) => {
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
  app2.get("/api/resources", async (req, res) => {
    const resources2 = await storage.getAllResources();
    res.json(resources2);
  });
  app2.get("/api/resources/:id", async (req, res) => {
    const resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) return res.status(400).json({ message: "Invalid resource ID" });
    const resource = await storage.getResource(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  });
  app2.post("/api/resources", async (req, res) => {
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
  app2.get("/api/resources/:id/download", async (req, res) => {
    const resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) return res.status(400).json({ message: "Invalid resource ID" });
    const resource = await storage.getResource(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    try {
      let pdfContent = "";
      if (resourceId === 1) {
        pdfContent = generateBiologyLabManualPDF();
      } else if (resourceId === 2) {
        pdfContent = generateChemistryHandbookPDF();
      } else {
        return res.status(404).json({ message: "PDF not available for this resource" });
      }
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${resource.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt"`);
      res.setHeader("Content-Length", Buffer.byteLength(pdfContent, "utf8"));
      res.send(pdfContent);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });
  app2.get("/api/users/:userId/chat", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const messages = await storage.getUserChatHistory(userId);
    res.json(messages);
  });
  app2.post("/api/chat", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const requestType = req.query.type || "simplify";
      const translateToBengali = req.body.translate_to_bengali === true;
      let response = "";
      let bengaliTranslation = null;
      try {
        if (requestType === "deep_research") {
          response = await deepResearch(messageData.message);
        } else if (requestType === "analyze") {
          response = await analyzeResearchPaper(messageData.message);
        } else if (requestType === "translate") {
          const direction = req.query.direction || "english_to_bengali";
          const targetLanguage = direction === "english_to_bengali" ? "bengali" : "english";
          response = await translateContent(messageData.message, targetLanguage);
        } else {
          response = await simplifyText(messageData.message);
        }
        if (translateToBengali) {
          try {
            bengaliTranslation = await translateContent(response, "bengali");
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
  app2.post("/api/curio/research", async (req, res) => {
    try {
      const { text: text2, userId } = req.body;
      if (!text2) {
        return res.status(400).json({ message: "Text to research is required" });
      }
      let response;
      try {
        response = await deepResearch(text2);
      } catch (error) {
        console.error("Error in deep research:", error);
        return res.status(500).json({ message: "Failed to process deep research request" });
      }
      if (userId) {
        await storage.createChatMessage({
          userId,
          message: text2,
          response
        });
      }
      res.json({ response });
    } catch (error) {
      console.error("Deep research error:", error);
      res.status(500).json({ message: "Failed to process deep research request" });
    }
  });
  app2.post("/api/document/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded or file type not supported. Please upload a PDF, DOCX, or TXT file."
        });
      }
      const userId = req.body.userId ? parseInt(req.body.userId) : 1;
      const result = await analyzeFileWithAI(req.file);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error || "Failed to analyze document"
        });
      }
      if (req.body.saveToChat === "true") {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "client", "src", "assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/config.ts
import fs3 from "fs";
try {
  if (fs3.existsSync("./.env")) {
    const envFile = fs3.readFileSync("./.env", "utf8");
    const envVars = envFile.split("\n");
    envVars.forEach((line) => {
      if (line && !line.startsWith("#")) {
        const equalSignIndex = line.indexOf("=");
        if (equalSignIndex > 0) {
          const key = line.substring(0, equalSignIndex);
          let value = line.substring(equalSignIndex + 1);
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    });
    console.log("Environment variables loaded from .env file");
  } else {
    console.log("No .env file found, using existing environment variables");
  }
} catch (error) {
  console.error("Error loading environment variables:", error);
}
var DATABASE_URL = process.env.DATABASE_URL;
var SUPABASE_URL = process.env.SUPABASE_URL;
var SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, () => {
    log(`serving on http://localhost:${port}`);
  });
})();
