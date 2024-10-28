import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ManagerLeaveHistory from "./LeaveHistory";
import { useNavigate } from "react-router-dom";
import LeaveRequests from "./LeaveRequests";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import axios from "axios";
import ManagerLeaveReport from "./ManagerReportPage";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isRequestedLeavesModalOpen, setIsRequestedLeavesModalOpen] =
    useState(false);
  const [isLeaveHistoryModalOpen, setIsLeaveHistoryModalOpen] = useState(false);
  const [calendarLeaves, setCalendarLeaves] = useState([]);
  const baseURL = "http://127.0.0.1:8000";

  const openRequestedLeavesModal = () => {
    setIsRequestedLeavesModalOpen(true);
  };

  const closeRequestedLeavesModal = () => {
    setIsRequestedLeavesModalOpen(false);
  };

  const openLeaveHistoryModal = () => {
    setIsLeaveHistoryModalOpen(true);
  };

  const closeLeaveHistoryModal = () => {
    setIsLeaveHistoryModalOpen(false);
  };

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(baseURL + "/leave/manager-history/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCalendarLeaves(response.data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      }
    };

    fetchLeaveHistory();
  }, []);

  const handlelogout = () => {
    localStorage.clear();
    navigate("login");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <style>
        {`
          .react-calendar {
            background-color: #1f2937;
            border: 1px solid #374151;
            color: #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
            width: 100%;
          }
          .react-calendar__tile {
            color: #e5e7eb;
            padding: 0.75rem 0.5rem;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #374151;
            color: #fff;
          }
          .react-calendar__tile--now {
            background-color: #374151;
            color: #fff;
          }
          .react-calendar__tile--active {
            background-color: #3b82f6;
            color: #fff;
          }
          .react-calendar__tile--active:enabled:hover,
          .react-calendar__tile--active:enabled:focus {
            background-color: #2563eb;
          }
          .react-calendar__navigation button {
            color: #e5e7eb;
            min-width: 44px;
            padding: 0.5rem;
            background: none;
            font-size: 16px;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #374151;
          }
          .react-calendar__month-view__weekdays {
            color: #9ca3af;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 0.75rem;
          }
          .react-calendar__month-view__days__day--weekend {
            color: #ef4444;
          }
          .react-calendar__month-view__days__day--neighboringMonth {
            color: #6b7280;
          }
        `}
      </style>

      <nav className="bg-black p-4 shadow-lg border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-gray-200 font-bold text-2xl">
            Leave Management Portal (Manager)
          </h1>
          <button
            className="bg-gray-800 px-4 py-2 rounded text-gray-200 hover:bg-gray-700 transition duration-300"
            onClick={handlelogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-row mt-6 justify-between px-6 gap-6">
        {/* Left Side - Buttons */}
        <div className="flex flex-col w-1/2 space-y-4">
          <button
            onClick={openRequestedLeavesModal}
            className="w-full py-3 px-4 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-700"
          >
            Requested Leaves
          </button>
          <button
            onClick={openLeaveHistoryModal}
            className="w-full py-3 px-4 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-700"
          >
            Leave History
          </button>
          <button
            onClick={() => navigate("/manreport")}
            className="w-full py-3 px-4 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-700"
          >
            Generate Report
          </button>
        </div>

        {/* Right Side - Calendar */}
        <div className="w-1/2 bg-gray-800 p-6 shadow-xl rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Leave Calendar</h2>
          <Calendar
            tileClassName={({ date }) => {
              const leaveRanges = calendarLeaves
                .filter((leave) => leave.status !== "cancelled")
                .map((leave) => ({
                  start: new Date(leave.start_date),
                  end: new Date(leave.end_date),
                }));

              return leaveRanges.some(({ start, end }) => {
                return date >= start && date <= end;
              })
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "";
            }}
          />
        </div>
      </div>

      {/* Requested Leaves Modal */}
      {isRequestedLeavesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-5xl relative border border-gray-700">
            <button
              onClick={closeRequestedLeavesModal}
              className="absolute top-2 right-2 text-xl font-bold text-gray-400 hover:text-gray-200"
            >
              &times;
            </button>
            <LeaveRequests closeModal={closeRequestedLeavesModal} />
          </div>
        </div>
      )}

      {/* History Modal */}
      {isLeaveHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-5xl relative border border-gray-700">
            <button
              onClick={closeLeaveHistoryModal}
              className="absolute top-2 right-2 text-xl font-bold text-gray-400 hover:text-gray-200"
            >
              &times;
            </button>
            <ManagerLeaveHistory closeModal={closeLeaveHistoryModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;