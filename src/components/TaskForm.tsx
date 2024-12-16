import { FC } from 'react';
import { Form, Input, Modal, message, Select, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Task } from '../types/task';
import { addTaskApi, updateTaskApi } from '../api/taskApi';

interface TaskFormProps {
  visible: boolean;
  currentTask: Task | null;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  closeModal: () => void;
}

interface FormValues extends Omit<Task, 'dueDate'> {
  dueDate: Dayjs;
}

const { Option } = Select;

const TaskForm: FC<TaskFormProps> = ({ visible, currentTask, setTasks, closeModal }) => {
  const [form] = Form.useForm<FormValues>();

  const initialValues = currentTask ? {
    ...currentTask,
    dueDate: currentTask.dueDate ? dayjs(currentTask.dueDate) : undefined
  } : undefined;

  const onFinish = async (values: FormValues) => {
    try {
      const formattedValues = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
      };

      if (currentTask) {
        const updatedTask = await updateTaskApi(currentTask.id, {
          ...formattedValues,
          completed: currentTask.completed
        });
        setTasks(prev => updateTasks(prev, updatedTask));
        message.success('Task updated successfully');
      } else {
        const newTask = await addTaskApi(formattedValues);
        setTasks(prev => [...prev, newTask]);
        message.success('Task created successfully');
      }
      closeModal();
      form.resetFields();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const updateTasks = (prev: Task[], t: Task) => {
    return prev.map(task => (task.id === t.id ? t : task));
  };

  return (
    <Modal
      title={currentTask ? 'Edit Task' : 'Add Task'}
      open={visible}
      onCancel={() => {
        closeModal();
        form.resetFields();
      }}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={initialValues}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select priority!' }]}
        >
          <Select>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select due date!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;