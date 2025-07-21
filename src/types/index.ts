export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  heroImage?: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
}