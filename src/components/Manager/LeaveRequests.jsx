import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const LeaveRequests = ({ closeModal }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const baseURL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(baseURL + "/leave/requests/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setLeaveRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setLeaveRequests([]);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.patch(
        baseURL + `/leave/requests/${id}/approve/`,
        { action: "approve" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.status === 200){
        toast.success(response.data.message)
      }
     
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error approving leave request:", error);
    }
  };

  const handleDecline = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.patch(
        baseURL + `/leave/requests/${id}/decline/`,
        { action: "decline" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.status === 200){
        toast.success(response.data.message)
      }
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error declining leave request:", error);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-200 text-center">
        Requested Leaves
      </h2>

      <div className="overflow-auto max-h-96">
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
                Reason
              </th>
              <th className="px-4 py-2 border border-gray-700 text-center text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(leaveRequests) && leaveRequests.length > 0 ? (
              leaveRequests.map((request) => (
                <tr key={request.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">
                    {request.employee_name}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">
                    {request.leave_type.charAt(0).toUpperCase() +
                      request.leave_type.slice(1)}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">
                    {new Date(request.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">
                    {new Date(request.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">
                    {request.reason}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="bg-indigo-600 text-gray-200 px-3 py-1 rounded hover:bg-indigo-700 transition duration-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(request.id)}
                        className="bg-red-600 text-gray-200 px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                      >
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-3 text-center text-gray-400 bg-gray-800"
                >
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default LeaveRequests;