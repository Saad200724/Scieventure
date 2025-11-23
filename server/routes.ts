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

// PDF generation functions
function generateBiologyLabManualPDF(): string {
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

function generateChemistryHandbookPDF(): string {
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
- Water: H₂O
- Carbon dioxide: CO₂
- Sodium chloride (table salt): NaCl
- Sulfuric acid: H₂SO₄
- Ammonia: NH₃
- Hydrochloric acid: HCl
- Sodium hydroxide: NaOH
- Calcium carbonate: CaCO₃
- Methane: CH₄
- Oxygen gas: O₂

Important Ions:
- Hydroxide: OH⁻
- Carbonate: CO₃²⁻
- Sulfate: SO₄²⁻
- Nitrate: NO₃⁻
- Phosphate: PO₄³⁻
- Ammonium: NH₄⁺

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
- Moles = mass (g) ÷ molar mass (g/mol)
- Molarity (M) = moles of solute ÷ liters of solution
- Number of particles = moles × Avogadro's number
- Percent composition = (mass of element ÷ total mass) × 100%

Avogadro's Number: 6.022 × 10²³ particles/mol

CHAPTER 4: GAS LAWS AND KINETIC THEORY

Gas behavior can be predicted using mathematical relationships.

Essential Gas Laws:
- Boyle's Law: P₁V₁ = P₂V₂ (at constant T and n)
- Charles's Law: V₁/T₁ = V₂/T₂ (at constant P and n)
- Gay-Lussac's Law: P₁/T₁ = P₂/T₂ (at constant V and n)
- Combined Gas Law: P₁V₁/T₁ = P₂V₂/T₂
- Ideal Gas Law: PV = nRT

Gas Constant Values:
- R = 8.314 J/(mol·K)
- R = 0.08206 L·atm/(mol·K)
- R = 62.36 L·Torr/(mol·K)

CHAPTER 5: ACID-BASE CHEMISTRY AND pH

Understanding acids and bases is crucial for many chemical processes.

Key Definitions:
- Arrhenius: Acids produce H⁺, bases produce OH⁻
- Brønsted-Lowry: Acids donate protons, bases accept protons
- Lewis: Acids accept electron pairs, bases donate electron pairs

pH Scale:
- pH = -log[H⁺]
- pOH = -log[OH⁻]
- pH + pOH = 14 (at 25°C)
- Acidic: pH < 7
- Neutral: pH = 7
- Basic: pH > 7

CHAPTER 6: THERMODYNAMICS AND ENERGY

Energy changes accompany all chemical reactions.

Important Equations:
- ΔH = H_products - H_reactants
- ΔS = S_products - S_reactants
- ΔG = ΔH - TΔS
- ΔG < 0: spontaneous reaction
- ΔG > 0: non-spontaneous reaction
- ΔG = 0: system at equilibrium

CHAPTER 7: CHEMICAL KINETICS AND EQUILIBRIUM

Reaction rates and equilibrium positions can be calculated and predicted.

Rate Laws:
- Rate = k[A]^m[B]^n
- First order: ln[A] = ln[A₀] - kt
- Second order: 1/[A] = 1/[A₀] + kt

Equilibrium:
- K_eq = [products]/[reactants]
- Le Chatelier's Principle: System responds to stress by shifting equilibrium

This handbook provides comprehensive formulas and concepts essential for chemistry students at all levels, with practical examples and problem-solving strategies.`;

  return content;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const memoryStorage = multer.memoryStorage();
  const upload = multer({ 
    storage: memoryStorage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB max file size
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

  // Resource download route
  app.get("/api/resources/:id/download", async (req, res) => {
    const resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) return res.status(400).json({ message: "Invalid resource ID" });
    
    const resource = await storage.getResource(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    
    try {
      // Generate PDF content based on resource
      let pdfContent = '';
      
      if (resourceId === 1) {
        // Experimental Biology Lab Manual
        pdfContent = generateBiologyLabManualPDF();
      } else if (resourceId === 2) {
        // Chemistry Formula Handbook
        pdfContent = generateChemistryHandbookPDF();
      } else {
        return res.status(404).json({ message: "PDF not available for this resource" });
      }
      
      // Set headers for text file download
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt"`);
      res.setHeader('Content-Length', Buffer.byteLength(pdfContent, 'utf8'));
      
      // Send the content as text
      res.send(pdfContent);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ message: "Failed to generate PDF" });
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
