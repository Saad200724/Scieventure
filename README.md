# SciVenture: Interactive Science Learning Platform

SciVenture is an engaging educational platform designed to make science learning interactive and fun. This application uses Supabase for both authentication and database functionality to create a seamless user experience.
![image](https://github.com/user-attachments/assets/8bc3da9d-ace9-47da-ad3e-440005c077e7)
![image](https://github.com/user-attachments/assets/a22fd8f0-354c-4aca-a72a-fb32bf1836d3)
![image](https://github.com/user-attachments/assets/0b1f9ad5-b9b6-47c9-a047-9cee05f827e4)
![image](https://github.com/user-attachments/assets/ef632539-3000-4668-8f08-3b3a2098d724)
![image](https://github.com/user-attachments/assets/6b6f75d4-19f2-4afc-b2e0-57bf0d6be665)

# And much more, run this.

## Features

- 🧪 Interactive science modules and experiments
- 🤖 AI assistant for personalized learning help
- 📊 Progress tracking and achievements
- 👥 Community and collaborative projects
- 📚 Rich educational resources

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Express.js, Node.js
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: React Query
- **Routing**: Wouter

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A Supabase account (for authentication)
- A Firebase project (for database)

### Quick Start

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Database Configuration
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Documentation

- [Dependencies](./DEPENDENCIES.md) - List of all required packages
- [Local Setup](./LOCAL_SETUP.md) - Detailed instructions for running locally in VS Code
- [Supabase Setup](./SUPABASE_SETUP.md) - Guide for Supabase authentication setup

## Project Structure

```
SciVenture/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and configurations
│   │   ├── pages/      # Application pages
│   │   └── ...
├── server/             # Backend Express server
│   ├── ai.ts           # AI functionality
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   └── ...
├── shared/             # Shared types and utilities
└── ...
```

## Authentication and Database

- **Authentication**: Handled by Supabase Auth service
- **Database Operations**: Implemented with Firebase Firestore
- **User Flow**: Registration/login via Supabase, data storage in Firebase

## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- TailwindCSS for styling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Express
- Authentication powered by Supabase
- Database functionality by Firebase
- UI components from Radix UI and shadcn/ui
