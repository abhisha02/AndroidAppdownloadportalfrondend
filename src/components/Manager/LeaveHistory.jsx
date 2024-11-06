import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from '../../services/api';

const ManagerLeaveHistory = ({ closeModal }) => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + (diffDays === 1 ? " day" : " days");
  };

  const fetchLeaveHistory = async () => {
    try {
      const { data } = await api.get('/leave/manager-history/');
      setLeaveHistory(data);
    } catch (error) {
      console.error("Error fetching leave history:", error);
      toast.error("Failed to fetch leave history");
      setLeaveHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-200 text-center">
        Manager Leave Request History
      </h2>

      <div className="overflow-auto max-h-96">
        {loading ? (
          <div className="flex justify-center items-center h-32 text-gray-400">
            Loading history...
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 border border-gray-700 text-left text-gray-200">
                  Employee Name
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left text-gray-200">
                  Leave Type
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left text-gray-200">
                  Start Date
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left text-gray-200">
                  End Date
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left text-gray-200">
                  Duration
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left text-gray-200">
                  Reason
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left text-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(leaveHistory) && leaveHistory.length > 0 ? (
                leaveHistory.map((request) => (
                  <tr key={request.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-4 py-3 border border-gray-700 text-gray-300">
                      {request.employee_name}
                    </td>
                    <td className="px-4 py-3 border border-gray-700 text-gray-300">
                      {request.leave_type.charAt(0).toUpperCase() + request.leave_type.slice(1)}
                    </td>
                    <td className="px-4 py-3 border border-gray-700 text-gray-300">
                      {formatDate(request.start_date)}
                    </td>
                    <td className="px-4 py-3 border border-gray-700 text-gray-300">
                      {formatDate(request.end_date)}
                    </td>
                    <td className="px-4 py-3 border border-gray-700 text-gray-300">
                      {calculateDuration(request.start_date, request.end_date)}
                    </td>
                    <td className="px-4 py-3 border border-gray-700 text-gray-300">
                      {request.reason}
                    </td>
                    <td className="px-4 py-3 border border-gray-700">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        request.status === 'approved' ? 'bg-indigo-900 text-indigo-200' :
                        request.status === 'rejected' ? 'bg-red-900 text-red-200' :
                        'bg-yellow-900 text-yellow-200'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-3 text-center text-gray-400 bg-gray-800">
                    No leave history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={closeModal}
          className="bg-gray-800 text-gray-200 px-4 py-2 rounded hover:bg-gray-700 transition duration-300 border border-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ManagerLeaveHistory;