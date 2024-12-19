import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import api from '../../services/api';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const ProfileModal = ({ isOpen, onClose }) => {
  const [acceptedApps, setAcceptedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const firstName = useSelector((state) => state.auth.first_name);
  const email = useSelector((state) => state.auth.email);

  useEffect(() => {
    const fetchAcceptedApps = async () => {
      try {
        const response = await api.get('apps/user/apps/accepted/');
        setAcceptedApps(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch accepted apps');
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchAcceptedApps();
    }
  }, [isOpen]);

  const totalPoints = acceptedApps.reduce((sum, app) => sum + app.points_earned, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Profile">
      <div className="text-white space-y-6">
        {/* Basic Profile Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Name</label>
            <p className="text-lg">{firstName}</p>
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <p className="text-lg">{email}</p>
          </div>
        </div>
        {/* Total Points */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-xl font-bold mb-2">Total Earned Points</h3>
          <p className="text-3xl font-bold text-green-400">{totalPoints} Points</p>
        </div>
        {/* Accepted Apps List */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-xl font-bold mb-4">Earned Points History</h3>
          
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-red-400 text-center">{error}</div>
          ) : acceptedApps.length === 0 ? (
            <div className="text-gray-400 text-center">No apps completed yet</div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {acceptedApps.map((app) => (
                <div key={app.id} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {app.app.app_icon && (
                      <img 
                        src={app.app.app_icon} 
                        alt={app.app.name} 
                        className="w-10 h-10 object-contain rounded"
                      />
                    )}
                    <span>{app.app.name}</span>
                  </div>
                  <span className="font-bold text-green-400">
                    +{app.points_earned} Points
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-white text-black py-2 rounded hover:bg-gray-100 transition mt-4"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

const ClaimModal = ({ isOpen, onClose }) => {
  // ... (previous state and handlers remain the same)
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPendingTasks = async () => {
      try {
        const response = await api.get('/apps/available/');
        setPendingTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pending tasks');
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPendingTasks();
    }
  }, [isOpen]);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setScreenshot(null);
    setError(null);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Screenshot size should be less than 5MB');
        return;
      }
      setScreenshot(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTask || !screenshot) {
      setError('Please select a task and upload a screenshot');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('app', selectedTask.id);
    formData.append('screenshot', screenshot);

    try {
      await api.post('apps/tasks/submit/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPendingTasks(pendingTasks.filter(task => task.id !== selectedTask.id));
      setSelectedTask(null);
      setScreenshot(null);
      setError('Task submitted successfully!');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError('Failed to submit task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select the App and upload screenshot to Claim Your Points">
      <div className="text-white">
        {error && (
          <div className="bg-white text-black p-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading tasks...</div>
        ) : pendingTasks.length === 0 ? (
          <div className="text-white text-center py-4">
            No pending tasks available.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedTask?.id === task.id
                      ? 'bg-white text-black'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  onClick={() => handleTaskSelect(task)}
                >
                  {task.app_icon && (
                    <img
                      src={task.app_icon}
                      alt={task.name}
                      className="w-full h-20 object-contain mb-2"
                    />
                  )}
                  <p className="text-black text-center text-sm">{task.name}</p>
                  <p className="text-black text-center text-sm">
                    {task.points_value} Points
                  </p>
                </div>
              ))}
            </div>

            {selectedTask && (
              <div className="space-y-3">
                <p className="text-white">Selected: {selectedTask.name}</p>
                <div className="space-y-2">
                  <label className="block text-white">Upload Screenshot</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="w-full text-white"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !screenshot}
                  className={`w-full py-2 rounded transition ${
                    submitting || !screenshot
                      ? 'bg-gray-300 cursor-not-allowed text-black'
                      : 'bg-white hover:bg-gray-100 text-black'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Submit Task'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const firstName = useSelector((state) => state.auth.first_name);
  const email = useSelector((state) => state.auth.email);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDownload = (playstoreLink, appName) => {
    if (playstoreLink) {
      window.open(playstoreLink, '_blank');
    } else {
      setError(`Playstore link for ${appName} is not available`);
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsResponse] = await Promise.all([
          api.get('/apps/available/'),
        ]);
        setApps(appsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-black p-4 shadow-lg border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white font-bold text-2xl">
            Android App Download Portal
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="bg-white px-4 py-2 rounded text-black hover:bg-gray-100 transition"
            >
              Claim Points
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="bg-white px-4 py-2 rounded text-black hover:bg-gray-100 transition"
            >
              Profile
            </button>
            <h1 className="text-white text-lg">Welcome, {firstName}</h1>
            <button
              className="bg-white px-4 py-2 rounded text-black hover:bg-gray-100 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8 border-b border-gray-700 pb-4">
          Available Apps
        </h2>

        {error && (
          <div className="bg-white text-black p-3 rounded mb-4 transition-opacity">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div 
                key={app.id} 
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                {app.app_icon && (
                  <img 
                    src={app.app_icon} 
                    alt={app.name} 
                    className="w-full h-32 object-contain"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{app.name}</h3>
                  <p className="text-white mb-2">{app.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">
                      {app.points_value} Points
                    </span>
                    <button
                      className={`px-3 py-1 rounded transition ${
                        app.playstore_link 
                          ? 'bg-white hover:bg-gray-100 text-black' 
                          : 'bg-gray-300 cursor-not-allowed text-black'
                      }`}
                      onClick={() => handleDownload(app.playstore_link, app.name)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;