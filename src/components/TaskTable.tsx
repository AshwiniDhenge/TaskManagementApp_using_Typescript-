      import { FC } from 'react';
      import { Table, Button, Switch, Tag } from 'antd';
      import { Task } from '../types/task';
      import { updateTaskApi } from '../api/taskApi';

      interface TaskTableProps {
        tasks: Task[];
        loading: boolean;
        onEdit: (task: Task) => void;
        onDelete: (id: number) => void;
        setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
      }

      const TaskTable: FC<TaskTableProps> = ({ tasks, loading, onEdit, onDelete, setTasks }) => {
        // const handleStatusChange = async (checked: boolean, record: Task) => {
        //   try {
        //     const updatedTask = await updateTaskApi(record.id, { 
        //       ...record, 
        //       completed: checked 
        //     });
        //     setTasks(prev => prev.map(task => 
        //       task.id === record.id ? { ...task, completed: checked } : task
        //     ));
        //   } catch (error) {
        //     console.error('Failed to update status');
        //   }
        // };

        const handleStatusChange = async (checked: boolean, record: Task) => {
          try {
            await updateTaskApi(record.id, { 
              ...record, 
              completed: checked 
            });
            setTasks(prev => prev.map(task => 
              task.id === record.id ? { ...task, completed: checked } : task
            ));
          } catch (error) {
            console.error('Failed to update status');
          }
        };
        
        const columns = [
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => (
              <Tag color={priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'green'}>
                {priority}
              </Tag>
            ),
          },
          {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
          },
          {
            title: 'Status',
            dataIndex: 'completed',
            key: 'completed',
            render: (completed: boolean, record: Task) => (
              <Switch
                checked={completed}
                onChange={(checked) => handleStatusChange(checked, record)}
                checkedChildren="Completed"
                unCheckedChildren="Pending"
              />
            ),
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Task) => (
              <span>
                <Button type="link" onClick={() => onEdit(record)}>
                  Edit
                </Button>
                <Button type="link" danger onClick={() => onDelete(record.id)}>
                  Delete
                </Button>
              </span>
            ),
          },
        ];

        return (
          <Table
            dataSource={tasks}
            columns={columns}
            loading={loading}
            rowKey="id"
          />
        );
      };

      export default TaskTable;