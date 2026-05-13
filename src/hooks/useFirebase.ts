import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Projects Hook
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  featured?: boolean;
  order?: number;
  createdAt?: any;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simplified query
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    return unsubscribe;
  }, []);

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      await addDoc(collection(db, 'projects'), {
        ...project,
        createdAt: serverTimestamp(),
        order: project.order ?? 0
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  };

  const editProject = async (id: string, project: Partial<Project>) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, project);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const removeProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  return { projects, loading, addProject, editProject, removeProject };
}

// Content Hook
export interface ContentItem {
  id: string;
  value: string;
  type: 'text' | 'image';
}

export function useContent() {
  const [content, setContent] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, 'content');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contentData: Record<string, ContentItem> = {};
      snapshot.docs.forEach(doc => {
        contentData[doc.id] = { id: doc.id, ...doc.data() } as ContentItem;
      });
      setContent(contentData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'content');
    });

    return unsubscribe;
  }, []);

  const updateContent = async (id: string, value: string, type: 'text' | 'image' = 'text') => {
    try {
      await setDoc(doc(db, 'content', id), { value, type, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `content/${id}`);
    }
  };

  return { content, loading, updateContent };
}

// Messages Hook
export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
      setLoading(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'messages');
    }
  };

  const sendMessage = async (name: string, email: string, message: string) => {
    try {
      await addDoc(collection(db, 'messages'), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
    }
  };

  return { messages, loading, fetchMessages, sendMessage, deleteMessage };
}
