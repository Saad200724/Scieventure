# Running SciVenture Locally in VS Code

This guide will help you set up and run the SciVenture application locally in VS Code with both Supabase authentication and Firebase database functionality.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- A Supabase account (for authentication)
- A Firebase account (for database)

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/sciventure.git
cd sciventure
```

## Step 2: Install Dependencies

Install all required dependencies:

```bash
npm install
```

This will install all packages listed in package.json, including:
- React and React DOM
- Express
- TypeScript
- Supabase JS client
- Firebase
- TailwindCSS
- And other UI components and utilities

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

2. Add your Supabase and Firebase configuration:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Getting Your Supabase Keys

1. Log in to [Supabase](https://supabase.com/)
2. Select your project (or create a new one)
3. Go to Project Settings → API
4. Copy the URL and anon key

### Getting Your Firebase Configuration

1. Log in to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the web app icon (</>) to add a web app if you haven't already
4. Register your app and Firebase will display the configuration
5. Enable Firestore Database from the Firebase console

## Step 4: Start the Development Server

Run the development server:

```bash
npm run dev
```

The server should start on `http://localhost:5000`.

## Project Structure

- `/client/src`: React frontend code
  - `/components`: UI components
  - `/pages`: Application pages
  - `/lib`: Utility functions and configurations
    - `supabase.ts`: Supabase client and authentication functions
    - `firebase.ts`: Firebase configuration
    - `firebase-db.ts`: Firebase database operations
- `/server`: Express backend code
- `/shared`: Shared types and utilities

## Authentication Flow

The project uses Supabase for authentication:
1. Users register/login through Supabase Auth
2. After authentication, user data is stored in Firebase
3. Session management is handled by Supabase

## Database Operations

All database operations are performed through Firebase:
1. User profiles are stored in Firebase after authentication
2. Learning modules, progress tracking, and other app data are stored in Firebase
3. Real-time updates are supported through Firebase listeners

## VS Code Tips

For the best development experience:

1. Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

2. Use the integrated terminal for running commands

3. Set up Prettier for code formatting:
   ```json
   // .vscode/settings.json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```

## Troubleshooting

- **Authentication Issues**: Make sure your Supabase URL and anon key are correct
- **Database Connection Problems**: Verify Firebase configuration and check if Firestore is enabled
- **Missing Environment Variables**: Ensure `.env.local` is properly set up
- **Build Errors**: Run `npm install` to make sure all dependencies are installed

## Need Help?

Refer to the official documentation:
- [Supabase Docs](https://supabase.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)