import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const baseURL = "http://127.0.0.1:8000";

  const fetchLeaveHistory = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(baseURL + "/leave/history/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaveHistory(response.data);
    } catch (error) {
      console.error("Error fetching leave history:", error);
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
    try {
      const token = localStorage.getItem("access");
      const response = await axios.patch(
        baseURL + "/leave/cancel-leave/",
        { id: selectedLeaveId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchLeaveHistory();
        toast.success("Leave Cancelled Successfully");
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error("Error Cancelling leave:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">
        Leave Request History
      </h2>
      <div className="overflow-auto w-full max-w-5xl max-h-[500px] rounded-lg border border-gray-700">
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
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
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
                  colSpan="7"
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
              >
                No, Keep it
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-gray-200 rounded hover:bg-red-700 transition duration-200"
              >
                Yes, Cancel Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;