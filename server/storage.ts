import {
  users, type User, type InsertUser,
  modules, type Module, type InsertModule,
  progress, type Progress, type InsertProgress,
  achievements, type Achievement, type InsertAchievement,
  projects, type Project, type InsertProject,
  resources, type Resource, type InsertResource,
  chatMessages, type ChatMessage, type InsertChatMessage
} from "../shared/schema";

// Define the storage interface with all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Module operations
  getAllModules(): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Progress operations
  getUserProgress(userId: number): Promise<Progress[]>;
  getModuleProgress(userId: number, moduleId: number): Promise<Progress | undefined>;
  updateProgress(progress: InsertProgress): Promise<Progress>;
  
  // Achievement operations
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Resource operations
  getAllResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Chat operations
  getUserChatHistory(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private modules: Map<number, Module>;
  private progressItems: Map<number, Progress>;
  private achievements: Map<number, Achievement>;
  private projects: Map<number, Project>;
  private resources: Map<number, Resource>;
  private chatMessages: Map<number, ChatMessage>;
  
  private userIdCounter: number;
  private moduleIdCounter: number;
  private progressIdCounter: number;
  private achievementIdCounter: number;
  private projectIdCounter: number;
  private resourceIdCounter: number;
  private chatMessageIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.modules = new Map();
    this.progressItems = new Map();
    this.achievements = new Map();
    this.projects = new Map();
    this.resources = new Map();
    this.chatMessages = new Map();
    
    this.userIdCounter = 1;
    this.moduleIdCounter = 1;
    this.progressIdCounter = 1;
    this.achievementIdCounter = 1;
    this.projectIdCounter = 1;
    this.resourceIdCounter = 1;
    this.chatMessageIdCounter = 1;
    
    // Initialize with some data
    this.initializeData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
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
  async getAllModules(): Promise<Module[]> {
    return Array.from(this.modules.values());
  }
  
  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }
  
  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = this.moduleIdCounter++;
    const module: Module = { 
      ...insertModule, 
      id,
      rating: 0,
      studentCount: 0
    };
    this.modules.set(id, module);
    return module;
  }
  
  // Progress operations
  async getUserProgress(userId: number): Promise<Progress[]> {
    return Array.from(this.progressItems.values()).filter(
      (progress) => progress.userId === userId
    );
  }
  
  async getModuleProgress(userId: number, moduleId: number): Promise<Progress | undefined> {
    return Array.from(this.progressItems.values()).find(
      (progress) => progress.userId === userId && progress.moduleId === moduleId
    );
  }
  
  async updateProgress(insertProgress: InsertProgress): Promise<Progress> {
    // Check if progress exists
    const existingProgress = await this.getModuleProgress(
      insertProgress.userId,
      insertProgress.moduleId
    );
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress: Progress = {
        ...existingProgress,
        completionPercentage: insertProgress.completionPercentage,
        lastAccessed: new Date()
      };
      this.progressItems.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      // Create new progress
      const id = this.progressIdCounter++;
      const progress: Progress = {
        ...insertProgress,
        id,
        lastAccessed: new Date()
      };
      this.progressItems.set(id, progress);
      return progress;
    }
  }
  
  // Achievement operations
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }
  
  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementIdCounter++;
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      earnedAt: new Date()
    };
    this.achievements.set(id, achievement);
    
    // Update user points
    const user = await this.getUser(insertAchievement.userId);
    if (user) {
      user.points += insertAchievement.points || 0;
      // Update level (1 level per 100 points)
      user.level = Math.floor(user.points / 100) + 1;
      this.users.set(user.id, user);
    }
    
    return achievement;
  }
  
  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = {
      ...insertProject,
      id,
      isActive: true
    };
    this.projects.set(id, project);
    return project;
  }
  
  // Resource operations
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const resource: Resource = {
      ...insertResource,
      id,
      downloadCount: 0
    };
    this.resources.set(id, resource);
    return resource;
  }
  
  // Chat operations
  async getUserChatHistory(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
  
  // Initialize with demo data
  private initializeData() {
    // Create demo user
    const demoUser: User = {
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
    
    // Create modules
    const moduleData: Omit<Module, "id">[] = [
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
    
    moduleData.forEach(module => {
      const id = this.moduleIdCounter++;
      this.modules.set(id, { ...module, id });
    });
    
    // Create progress
    const progressData: InsertProgress[] = [
      { userId: demoUser.id, moduleId: 1, completionPercentage: 32 },
      { userId: demoUser.id, moduleId: 2, completionPercentage: 78 },
      { userId: demoUser.id, moduleId: 3, completionPercentage: 64 }
    ];
    
    progressData.forEach(progress => {
      const id = this.progressIdCounter++;
      this.progressItems.set(id, { 
        ...progress, 
        id, 
        lastAccessed: new Date() 
      });
    });
    
    // Create achievements
    const achievementData: InsertAchievement[] = [
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
    
    achievementData.forEach(achievement => {
      const id = this.achievementIdCounter++;
      this.achievements.set(id, {
        ...achievement,
        id,
        earnedAt: new Date()
      });
    });
    
    // Create projects
    const projectData: Omit<Project, "id">[] = [
      {
        title: "Local River Water Quality Analysis",
        description: "Collect and analyze water samples from local rivers to monitor pollution levels and biodiversity indicators.",
        subject: "Environmental Science",
        participationType: "Open Participation",
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        location: "Dhaka Region",
        difficulty: 2,
        isActive: true
      },
      {
        title: "Renewable Energy Model Development",
        description: "Design and build small-scale renewable energy models to demonstrate alternative power generation.",
        subject: "Physics",
        participationType: "By Invitation",
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
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
    
    projectData.forEach(project => {
      const id = this.projectIdCounter++;
      this.projects.set(id, { ...project, id });
    });
    
    // Create resources
    const resourceData: Omit<Resource, "id">[] = [
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
    
    resourceData.forEach(resource => {
      const id = this.resourceIdCounter++;
      this.resources.set(id, { ...resource, id });
    });
    
    // Create chat messages
    const chatData: Omit<ChatMessage, "id" | "timestamp">[] = [
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
    
    chatData.forEach(message => {
      const id = this.chatMessageIdCounter++;
      this.chatMessages.set(id, {
        ...message,
        id,
        timestamp: new Date()
      });
    });
  }
}

// Import PostgreSQL storage implementation 
import { PostgresStorage } from "./pg-storage";

// Determine which storage implementation to use
let storage: IStorage;

if (process.env.DATABASE_URL) {
  // Use Postgres storage if DATABASE_URL is available
  console.log('Using PostgreSQL database for storage');
  storage = new PostgresStorage();
} else {
  // Fallback to in-memory storage for local development
  console.log('Using in-memory storage for preview');
  storage = new MemStorage();
}

export { storage };
