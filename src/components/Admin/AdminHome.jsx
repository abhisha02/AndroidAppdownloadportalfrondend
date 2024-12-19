import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Edit2, Trash2, Plus, Camera } from 'lucide-react';
import api from '../../services/api';
import AddAppModal from './AddAppModal';

const ScreenshotApprovalModal = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchSubmittedTasks();
    }
  }, [isOpen]);

  const fetchSubmittedTasks = async () => {
    try {
      const response = await api.get('apps/tasks/submitted/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch submitted tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.patch(`apps/tasks/${taskId}/update-status/`, {
        status: newStatus
      });
      toast.success(`Task ${newStatus.toLowerCase()} successfully`);
      fetchSubmittedTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task status');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-200">Screenshot Approvals</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-200 py-4">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-200 py-4">No tasks pending approval</div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-200 font-semibold">{task.app.name}</h3>
                    <p className="text-gray-400">User: {task.user?.email}</p>
                    <p className="text-gray-400">Submitted: {new Date(task.submitted_at).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(task.id, 'APPROVED')}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(task.id, 'REJECTED')}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {task.screenshot && (
                  <div className="mt-4">
                    <img
                      src={task.screenshot}
                      alt="Task Screenshot"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const Dashboard = () => {
  const navigate = useNavigate();
  const firstName = useSelector((state) => state.auth.first_name);
  
  const [apps, setApps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await api.get('apps/');
      setApps(response.data);
    } catch (error) {
      console.error('Error fetching apps:', error);
      toast.error('Failed to fetch apps');
    }
  };

  const handleEdit = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleDelete = async (appId) => {
    if (window.confirm('Are you sure you want to delete this app?')) {
      try {
        await api.delete(`apps/${appId}/delete/`);
        toast.success('App deleted successfully');
        fetchApps();
      } catch (error) {
        console.error('Error deleting app:', error);
        toast.error('Failed to delete app');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-black p-4 shadow-lg border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-gray-200 font-bold text-2xl">
            Android App Management Portal
          </h1>
          <div className="flex items-center space-x-4 ml-auto">
            <h1 className="text-gray-300 text-lg">Welcome, {firstName}</h1>
            <button
              className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 transition duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-6 px-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-200">Existing Apps</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsScreenshotModalOpen(true)}
              className="bg-white text-black px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-200 transition duration-300"
            >
              <Camera size={20} />
              <span>Screenshot Approvals</span>
            </button>
            <button
              onClick={() => {
                setSelectedApp(null);
                setIsModalOpen(true);
              }}
              className="bg-white text-black px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-200 transition duration-300"
            >
              <Plus size={20} />
              <span>Add New App</span>
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Points</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} className="border-b border-gray-800">
                <td className="border px-4 py-2 text-gray-200">{app.name}</td>
                <td className="border px-4 py-2 text-gray-200">{app.category}</td>
                <td className="border px-4 py-2 text-gray-200">{app.points_value}</td>
                <td className="border px-4 py-2 flex space-x-2 justify-center">
                  <button
                    onClick={() => handleEdit(app)}
                    className="bg-white text-black p-2 rounded hover:bg-gray-200 transition duration-300"
                    title="Edit"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="bg-white text-black p-2 rounded hover:bg-gray-200 transition duration-300"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <AddAppModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedApp}
          onAppAdded={fetchApps}
        />

        <ScreenshotApprovalModal
          isOpen={isScreenshotModalOpen}
          onClose={() => setIsScreenshotModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;