import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ApplyLeaveModal = ({ closeModal }) => {
  const baseURL = "http://127.0.0.1:8000";
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const submitLeaveRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    try {
      const response = await axios.post(baseURL + "/leave/apply/", leaveData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Leave request submitted successfully!");
        closeModal();
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-1/3 relative border border-gray-700">
        {/* Close button (X) */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-200">Apply for Leave</h2>
        <form onSubmit={submitLeaveRequest} className="space-y-4">
          <div>
            <label
              htmlFor="leave_type"
              className="block text-sm font-medium text-gray-300"
            >
              Leave Type
            </label>
            <select
              id="leave_type"
              name="leave_type"
              value={leaveData.leave_type}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Leave Type</option>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="maternity">Maternity Leave</option>
            </select>
          </div>
          {errors.leave_type && (
            <span className="text-red-400">{errors.leave_type[0]}</span>
          )}
          <div>
            <label
              htmlFor="startdate"
              className="block text-sm font-medium text-gray-300"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={leaveData.start_date}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          {errors.startdate && (
            <span className="text-red-400">{errors.start_date[0]}</span>
          )}
          <div>
            <label
              htmlFor="enddate"
              className="block text-sm font-medium text-gray-300"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={leaveData.end_date}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          {errors.end_date && (
            <span className="text-red-400">{errors.end_date[0]}</span>
          )}
          {leaveData.start_date &&
            leaveData.end_date &&
            leaveData.end_date < leaveData.start_date && (
              <span className="text-red-400">
                End date must be after start date.
              </span>
            )}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-300"
            >
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={leaveData.reason}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {errors.reason && (
            <span className="text-red-400">{errors.reason[0]}</span>
          )}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-gray-200 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Submit Leave Request
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full py-3 px-4 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition duration-300 border border-gray-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;