import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const API_URL = 'http://localhost:3001/tasks';

export const fetchTasksApi = async () => {
  const response = await axios.get<Task[]>(API_URL);
  return response.data;
};

export const createTaskApi = async (task: Partial<Task>) => {
  const response = await axios.post<Task>(API_URL, task);
  return response.data;
};

export const updateTaskApi = async (id: number, task: Partial<Task>) => {
  const response = await axios.put<Task>(`${API_URL}/${id}`, task);
  return response.data;
};

export const deleteTaskApi = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};





// -------------------------------------------------------------------------------------------------
