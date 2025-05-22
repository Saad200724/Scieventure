import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from '@supabase/supabase-js';

// This file contains Firebase Firestore operations for database functionality
// while authentication is handled by Supabase

// User profile operations
export const createUserProfile = async (user: User, additionalData?: Record<string, any>) => {
  try {
    const userRef = doc(db, 'users', user.id);
    const userData = {
      email: user.email,
      createdAt: serverTimestamp(),
      ...additionalData
    };
    
    await setDoc(userRef, userData);
    return { id: user.id, ...userData, ...{ email: user.email } };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Record<string, any>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Learning module operations
export const getAllModules = async () => {
  try {
    const modulesRef = collection(db, 'modules');
    const modulesSnap = await getDocs(modulesRef);
    const modules = modulesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return modules;
  } catch (error) {
    console.error('Error getting modules:', error);
    throw error;
  }
};

export const getModule = async (moduleId: string) => {
  try {
    const moduleRef = doc(db, 'modules', moduleId);
    const moduleSnap = await getDoc(moduleRef);
    
    if (moduleSnap.exists()) {
      return { id: moduleSnap.id, ...moduleSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting module:', error);
    throw error;
  }
};

// User progress operations
export const updateUserProgress = async (userId: string, moduleId: string, progress: Record<string, any>) => {
  try {
    const progressRef = doc(db, 'progress', `${userId}_${moduleId}`);
    const progressData = {
      userId,
      moduleId,
      ...progress,
      updatedAt: serverTimestamp()
    };
    
    // Check if document exists
    const docSnap = await getDoc(progressRef);
    
    if (docSnap.exists()) {
      await updateDoc(progressRef, progressData);
    } else {
      await setDoc(progressRef, {
        ...progressData,
        createdAt: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

export const getUserProgress = async (userId: string) => {
  try {
    const progressRef = collection(db, 'progress');
    const q = query(progressRef, where('userId', '==', userId));
    const progressSnap = await getDocs(q);
    
    const progressItems = progressSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return progressItems;
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

// Achievement operations
export const getUserAchievements = async (userId: string) => {
  try {
    const achievementsRef = collection(db, 'achievements');
    const q = query(achievementsRef, where('userId', '==', userId));
    const achievementsSnap = await getDocs(q);
    
    const achievements = achievementsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return achievements;
  } catch (error) {
    console.error('Error getting user achievements:', error);
    throw error;
  }
};

export const addAchievement = async (userId: string, achievementData: Record<string, any>) => {
  try {
    const achievementsRef = collection(db, 'achievements');
    const data = {
      userId,
      ...achievementData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(achievementsRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

// Projects operations
export const getAllProjects = async () => {
  try {
    const projectsRef = collection(db, 'projects');
    const projectsSnap = await getDocs(projectsRef);
    
    const projects = projectsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const getProject = async (projectId: string) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (projectSnap.exists()) {
      return { id: projectSnap.id, ...projectSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};

// Resources operations
export const getAllResources = async () => {
  try {
    const resourcesRef = collection(db, 'resources');
    const resourcesSnap = await getDocs(resourcesRef);
    
    const resources = resourcesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return resources;
  } catch (error) {
    console.error('Error getting resources:', error);
    throw error;
  }
};

// Chat operations
export const createChatMessage = async (userId: string, message: string, isAi: boolean = false) => {
  try {
    const chatRef = collection(db, 'chat_messages');
    const data = {
      userId,
      message,
      isAi,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(chatRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error creating chat message:', error);
    throw error;
  }
};

export const getUserChatHistory = async (userId: string) => {
  try {
    const chatRef = collection(db, 'chat_messages');
    const q = query(chatRef, where('userId', '==', userId));
    const chatSnap = await getDocs(q);
    
    const messages = chatSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return messages;
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};