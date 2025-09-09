import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Users API
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await api.post<User>('/users', user);
  return response.data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// Posts API
export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>('/posts');
  return response.data;
};

export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
  const response = await api.get<Post[]>(`/posts?userId=${userId}`);
  return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const response = await api.post<Post>('/posts', post);
  return response.data;
};

export const updatePost = async (id: number, post: Partial<Post>): Promise<Post> => {
  const response = await api.put<Post>(`/posts/${id}`, post);
  return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
