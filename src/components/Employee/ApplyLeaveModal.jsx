import React, { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';

const Alert = ({ children, variant = 'error' }) => {
  const bgColor = variant === 'error' ? 'bg-red-900/20' : 'bg-blue-900/20';
  const borderColor = variant === 'error' ? 'border-red-900/50' : 'border-blue-900/50';
  const textColor = variant === 'error' ? 'text-red-400' : 'text-blue-400';

  return (
    <div className={`p-3 rounded-md border ${bgColor} ${borderColor} ${textColor}`}>
      {children}
    </div>
  );
};

const ApplyLeaveModal = ({ closeModal, onSuccess }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveData, setLeaveData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const { data } = await api.get('/leave/leave-types/');
        setLeaveTypes(data);
      } catch (error) {
        setApiError('Failed to load leave types. Please try again.');
      }
    };

    fetchLeaveTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: null }));
    setApiError(null);
  };

  const submitLeaveRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setValidationErrors({});

    try {
      const { data } = await api.post('/leave/apply/', leaveData);
      onSuccess?.(data);
      closeModal();
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;
        
        if (status === 400) {
          if (data.message) {
            setApiError(data.message);
          } else {
            setValidationErrors(data);
          }
        } else {
          setApiError('An unexpected error occurred. Please try again.');
        }
      } else if (error.request) {
        setApiError('Network error. Please check your connection and try again.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isDateValid = useCallback(() => {
    if (leaveData.start_date && leaveData.end_date) {
      return new Date(leaveData.start_date) <= new Date(leaveData.end_date);
    }
    return true;
  }, [leaveData.start_date, leaveData.end_date]);

  const getSelectedLeaveType = () => {
    return leaveTypes.find(type => type.value === leaveData.leave_type);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative border border-gray-700">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-200">Apply for Leave</h2>

        {apiError && (
          <Alert className="mb-4">
            {apiError}
          </Alert>
        )}

        <form onSubmit={submitLeaveRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Leave Type
            </label>
            <select
              name="leave_type"
              value={leaveData.leave_type}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} ({type.max_days} days/year)
                </option>
              ))}
            </select>
            {validationErrors.leave_type && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.leave_type}</p>
            )}
          </div>

          {getSelectedLeaveType() && (
            <Alert variant="info" className="mb-4">
              You have selected {getSelectedLeaveType().label}. Maximum {getSelectedLeaveType().max_days} days allowed per year.
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={leaveData.start_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.start_date && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.start_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={leaveData.end_date}
                onChange={handleInputChange}
                min={leaveData.start_date || new Date().toISOString().split('T')[0]}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.end_date && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.end_date}</p>
              )}
            </div>
          </div>

          {!isDateValid() && (
            <p className="text-sm text-red-400">End date must be after or equal to start date.</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Reason
            </label>
            <textarea
              name="reason"
              value={leaveData.reason}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.reason && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.reason}</p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading || !isDateValid()}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-2 px-4 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 
                       border border-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;