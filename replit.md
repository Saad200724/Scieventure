# ScienceBridge Bangladesh Application

## Overview

ScienceBridge Bangladesh is a full-stack educational platform designed to bridge the science education gap between urban and rural students in Bangladesh. The application features interactive learning modules, AI-assisted learning tools, collaborative projects, and educational resources.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

1. **Frontend**: React-based single-page application with TypeScript
   - Uses a component-based architecture with Shadcn UI components
   - State management through React Query for server state
   - Wouter for lightweight client-side routing

2. **Backend**: Express.js server with TypeScript
   - RESTful API architecture
   - Integration with OpenAI for AI assistance features
   - Drizzle ORM for database operations

3. **Database**: PostgreSQL (via Drizzle ORM)
   - Schema defined in `shared/schema.ts`
   - Includes tables for users, modules, progress tracking, achievements, etc.

4. **Development Environment**: 
   - Vite for frontend development and bundling
   - TSX for running TypeScript on the backend
   - ESBuild for production build

## Key Components

### Frontend

1. **Page Structure**:
   - Home page (`Home.tsx`): Landing page with featured content
   - Dashboard (`Dashboard.tsx`): User progress and achievements
   - Module Detail (`ModuleDetail.tsx`): Educational content
   - AI Assistant (`AIAssistant.tsx`): AI-powered learning assistance
   - Projects (`Projects.tsx`): Collaborative learning projects
   - Resources (`Resources.tsx`): Educational resources

2. **UI Components**:
   - Uses Shadcn UI component library (built on Radix UI primitives)
   - Custom UI components for domain-specific needs
   - Responsive design with Tailwind CSS

3. **State Management**:
   - TanStack Query (React Query) for server state
   - Local state with React hooks
   - Theme provider for light/dark mode

### Backend

1. **API Routes**:
   - User management
   - Module and learning content
   - Progress tracking
   - AI integration
   - Project collaboration
   - Resource management

2. **AI Integration**:
   - Text simplification for scientific concepts
   - Research paper analysis
   - Likely translation services (English/Bengali)

3. **Storage**:
   - Database operations abstracted through a storage interface
   - Includes fallback in-memory storage option

## Data Flow

1. **User Interaction**:
   - User interacts with the UI
   - React Query handles data fetching via API requests
   - Backend processes requests and interacts with the database
   - Response is rendered in the UI

2. **AI Assistant Flow**:
   - User submits text in the AI Assistant
   - Frontend sends request to backend API
   - Backend processes with OpenAI API
   - Response is displayed to the user

3. **Learning Progress**:
   - User interacts with modules
   - Progress is tracked and stored in the database
   - Dashboard displays aggregated progress data

## External Dependencies

### Frontend
- React and React DOM
- TanStack Query for data fetching
- Shadcn UI (built on Radix UI)
- Tailwind CSS for styling
- Lucide icons
- Wouter for routing
- Various utility libraries (clsx, class-variance-authority)

### Backend
- Express.js for the server
- OpenAI SDK for AI features
- Drizzle ORM for database operations
- Zod for validation

## Deployment Strategy

The application uses a unified build process that:

1. Builds the frontend with Vite
2. Bundles the backend with ESBuild
3. Creates a single distributable that can be run with Node.js

The deployment configuration in `.replit` shows:
- Development mode with `npm run dev`
- Production build with `npm run build`
- Production start with `npm run start`
- Exposed on port 5000 (mapped to 80 for external access)

The application is designed to be deployed as a web service with autoscaling capabilities.

## Database Schema

The database schema includes tables for:

1. **Users**: Account information, credentials, and learning stats
2. **Modules**: Science learning content organized by subject
3. **Progress**: Tracking user completion of modules
4. **Achievements**: Gamification rewards for learning milestones
5. **Projects**: Collaborative learning activities
6. **Resources**: Educational materials
7. **Chat Messages**: History of AI assistant interactions

Each table has a defined schema with appropriate relations between entities.

## Development Workflow

1. Run development server: `npm run dev`
2. Check TypeScript: `tsc`
3. Update database schema: `npm run db:push`
4. Build for production: `npm run build`
5. Start production server: `npm run start`