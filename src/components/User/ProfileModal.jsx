import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import api from '../../services/api';
import { X } from "lucide-react";

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
        const response = await api.get('/user/apps/accepted/');
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

export default ProfileModal;