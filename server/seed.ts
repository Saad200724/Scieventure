import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { modules, projects, resources, insertModuleSchema, insertProjectSchema, insertResourceSchema } from "@shared/schema";
import { seedModules, seedProjects, seedResources, SEED_VERSION } from "./seed-data";
import { sql } from "drizzle-orm";

async function seedDatabase() {
  console.log(`\n🌱 Starting database seeding (version ${SEED_VERSION})...\n`);
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  const connection = postgres(dbUrl);
  const db = drizzle(connection);
  
  try {
    await db.transaction(async (tx) => {
      let modulesInserted = 0;
      let modulesSkipped = 0;
      let projectsInserted = 0;
      let projectsSkipped = 0;
      let resourcesInserted = 0;
      let resourcesSkipped = 0;

      console.log("📚 Seeding modules...");
      for (const module of seedModules) {
        const validation = insertModuleSchema.safeParse(module);
        if (!validation.success) {
          console.error(`❌ Invalid module data for "${module.title}":`, validation.error.errors);
          continue;
        }

        const existing = await tx.select().from(modules).where(sql`${modules.title} = ${module.title}`).limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping duplicate module: ${module.title}`);
          modulesSkipped++;
          continue;
        }

        await tx.insert(modules).values(module);
        console.log(`✅ Inserted module: ${module.title}`);
        modulesInserted++;
      }

      console.log("\n🔬 Seeding projects...");
      for (const project of seedProjects) {
        const validation = insertProjectSchema.safeParse(project);
        if (!validation.success) {
          console.error(`❌ Invalid project data for "${project.title}":`, validation.error.errors);
          continue;
        }

        const existing = await tx.select().from(projects).where(sql`${projects.title} = ${project.title}`).limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping duplicate project: ${project.title}`);
          projectsSkipped++;
          continue;
        }

        await tx.insert(projects).values(project);
        console.log(`✅ Inserted project: ${project.title}`);
        projectsInserted++;
      }

      console.log("\n📖 Seeding resources...");
      for (const resource of seedResources) {
        const validation = insertResourceSchema.safeParse(resource);
        if (!validation.success) {
          console.error(`❌ Invalid resource data for "${resource.title}":`, validation.error.errors);
          continue;
        }

        const existing = await tx.select().from(resources).where(sql`${resources.title} = ${resource.title}`).limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping duplicate resource: ${resource.title}`);
          resourcesSkipped++;
          continue;
        }

        await tx.insert(resources).values(resource);
        console.log(`✅ Inserted resource: ${resource.title}`);
        resourcesInserted++;
      }

      console.log("\n" + "=".repeat(60));
      console.log("📊 Seeding Summary:");
      console.log("=".repeat(60));
      console.log(`Modules:   ${modulesInserted} inserted, ${modulesSkipped} skipped`);
      console.log(`Projects:  ${projectsInserted} inserted, ${projectsSkipped} skipped`);
      console.log(`Resources: ${resourcesInserted} inserted, ${resourcesSkipped} skipped`);
      console.log("=".repeat(60));
      console.log(`\n✨ Database seeding completed successfully!\n`);
    });

  } catch (error) {
    console.error("\n❌ Error during database seeding:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedDatabase();
