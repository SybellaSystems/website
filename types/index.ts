// Type definitions for the application

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  createdAt?: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt?: Date;
  author: string;
  tags: string[];
  slug: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  image: string;
  results: string[];
  client: string;
  industry: string;
}

export interface Milestone {
  _id: string;
  startYear: string;
  endYear: string;
  name: string;
  description: string;
}

export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface NewsletterSubscribe {
  email: string
  subscribeAt?: Date
  source?:string
}


export interface ReplyData {
  id: string;
  subject: string;
  message: string;
}


export interface Project {
  id?: string;
  title: string;
  overview: string;
  image: string;
  demoLink?: string;
  problemSolved: string;
  techStack: string[];
  partners?: string[];
  callToAction?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Update {
  id?: string;
  title: string;
  category: "news" | "announcement" | "event" | "general";
  content: string;
  author: string;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}