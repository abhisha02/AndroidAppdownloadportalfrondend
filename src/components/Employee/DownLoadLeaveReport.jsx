import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DownloadLeaveReport = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const baseURL ="http://127.0.0.1:8000";

  useEffect(() => {
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

    fetchLeaveHistory();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Leave Report", 14, 20);

    // Check if there is data to display
    if (leaveHistory.length > 0) {
      // Define table headers
      const headers = [
        ["Leave Type", "Start Date", "End Date", "Reason", "Status", "Submission Date"],
      ];

      // Define table rows
      const data = leaveHistory.map((leave) => [
        leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1),
        new Date(leave.start_date).toLocaleDateString(),
        new Date(leave.end_date).toLocaleDateString(),
        leave.reason,
        leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
        new Date(leave.submission_date).toLocaleString(),
      ]);

      // Add table to PDF using autoTable
      doc.autoTable({
        head: headers,
        body: data,
        startY: 30,
      });

      // Save the PDF
      doc.save("leave-report.pdf");
    } else {
      // If no leave history found, show a message in the PDF
      doc.text("No leave history available.", 14, 30);
      doc.save("leave-report.pdf");
    }
  };

  return (
    <div>
      <button
        onClick={downloadPDF}
        className="w-full py-3 px-4 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-700"
      >
        Download Leave Report
      </button>
    </div>
  );
};

export default DownloadLeaveReport;