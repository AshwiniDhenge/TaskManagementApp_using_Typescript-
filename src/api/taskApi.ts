import axios from 'axios';
import { Task } from '../types/task';

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

interface ApiTask {
  id: number;
  title: string;
  body: string;
}

export const fetchTasksApi = async (): Promise<Task[]> => {
  const response = await axios.get<ApiTask[]>(`${BASE_URL}?_limit=10`);
  return response.data.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.body,
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString()
  }));
};

export const addTaskApi = async (task: Partial<Task>): Promise<Task> => {
  const response = await axios.post<ApiTask>(BASE_URL, task);
  return {
    ...task,
    id: response.data.id,
    completed: false,
    createdAt: new Date().toISOString()
  } as Task;
};

export const updateTaskApi = async (id: number, task: Partial<Task>): Promise<Task> => {
  await axios.put(`${BASE_URL}/${id}`, task);
  return task as Task;
};

export const deleteTaskApi = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};