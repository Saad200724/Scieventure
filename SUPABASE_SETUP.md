# Setting Up Supabase with SciVenture

SciVenture uses Supabase for authentication and Firebase for database functionality. This separation allows us to leverage the strengths of both platforms.

## Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Once your project is created, find your API keys in the Supabase dashboard under Project Settings > API
3. Copy the "URL" and "anon public" key to your `.env.local` file

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Add a web app to your project
3. Copy the Firebase configuration object to your `.env.local` file
4. Make sure to enable Firestore Database in your Firebase project

## Environment Variables

Your `.env.local` file should contain:

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

## Authentication Flow

1. Users register and log in using Supabase Auth
2. Upon successful authentication, user data is stored in Firebase Firestore
3. This setup allows us to use Supabase's authentication capabilities while leveraging Firebase for database operations

## Benefits of This Approach

- **Supabase Auth**: Easy to implement authentication with built-in features like email verification
- **Firebase Firestore**: Flexible NoSQL database with real-time updates and offline capabilities