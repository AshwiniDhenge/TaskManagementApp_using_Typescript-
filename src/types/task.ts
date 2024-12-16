export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
  }
  