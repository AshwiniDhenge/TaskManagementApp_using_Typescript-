import { FC, useState, useEffect } from 'react';
import { Button, message, Layout, Typography, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TaskTable from './components/TaskTable';
import TaskForm from './components/TaskForm';
import { Task } from './types/task';
import { fetchTasksApi, deleteTaskApi } from './api/taskApi';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasksApi();
      const formattedData = data.map(task => ({
        ...task,
        createdAt: task.createdAt || new Date().toISOString()
      }));
      setTasks(formattedData);
    } catch (error) {
      message.error('Failed to load tasks');
    }
    setLoading(false);
  };

  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTaskApi(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      message.success('Task deleted successfully');
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        background: '#1890ff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Task Management App
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentTask(null);
            setModalVisible(true);
          }}
          style={{
            background: 'white',
            color: '#1890ff'
          }}
        >
          Add Task
        </Button>
      </Header>

      <Content style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <TaskTable
            tasks={tasks}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            setTasks={setTasks}
          />
        </Card>

        <TaskForm
          visible={modalVisible}
          currentTask={currentTask}
          setTasks={setTasks}
          closeModal={() => setModalVisible(false)}
        />
      </Content>
    </Layout>
  );
};

export default App;
