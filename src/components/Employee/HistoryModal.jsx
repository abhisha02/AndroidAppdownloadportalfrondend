import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from '../../services/api';

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLeaveHistory = async () => {
    try {
      const { data } = await api.get('/leave/history/');
      setLeaveHistory(data);
    } catch (error) {
      console.error("Error fetching leave history:", error);
      toast.error("Failed to fetch leave history. Please try again.");
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const initiateCancel = (id) => {
    setSelectedLeaveId(id);
    setShowConfirmDialog(true);
  };

  const handleCancel = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await api.patch('/leave/cancel-leave/', { id: selectedLeaveId });
      if (response.status === 200) {
        await fetchLeaveHistory();
        toast.success("Leave cancelled successfully");
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error("Error cancelling leave:", error);
      toast.error("Failed to cancel leave. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">
        Leave Request History
      </h2>
      <div className="overflow-auto w-full max-w-6xl max-h-[500px] rounded-lg border border-gray-700">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-900 sticky top-0">
            <tr>
              <th className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold">
                Leave Type
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold">
                Start Date
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold">
                End Date
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold">
                Working Days
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold">
                Reason
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold">
                Status
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold">
                Submission Date
              </th>
              <th className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800">
            {leaveHistory.length > 0 ? (
              leaveHistory.map((leave) => (
                <tr
                  key={leave.id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-gray-300">
                    {leave.leave_type.charAt(0).toUpperCase() +
                      leave.leave_type.slice(1)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(leave.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(leave.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    <span className="bg-gray-700 px-2 py-1 rounded-full text-sm">
                      {leave.working_days} {leave.working_days === 1 ? 'day' : 'days'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{leave.reason}</td>
                  <td
                    className={`px-4 py-3 ${
                      leave.status === "approved"
                        ? "text-green-400"
                        : leave.status === "rejected"
                        ? "text-red-400"
                        : leave.status === "cancelled"
                        ? "text-sky-400"
                        : "text-yellow-400"
                    }`}
                  >
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      leave.status === "approved"
                        ? "bg-green-900/20"
                        : leave.status === "rejected"
                        ? "bg-red-900/20"
                        : leave.status === "cancelled"
                        ? "bg-sky-900/20"
                        : "bg-yellow-900/20"
                    }`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(leave.submission_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {(leave.status === "pending" ||
                      leave.status === "approved") && (
                      <button
                        onClick={() => initiateCancel(leave.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-gray-200 transition duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-3 text-center text-gray-400"
                >
                  No leave history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              Confirm Cancellation
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this leave request?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition duration-200 border border-gray-600"
                disabled={loading}
              >
                No, Keep it
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-gray-200 rounded hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Cancelling..." : "Yes, Cancel Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;