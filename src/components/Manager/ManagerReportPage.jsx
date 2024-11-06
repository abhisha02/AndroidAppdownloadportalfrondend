import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from '../../services/api';
import jsPDF from "jspdf";
import "jspdf-autotable";

const ManagerLeaveReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const { data } = await api.get('/leave/manager/report/');
      setReport(data.report);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch leave report");
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Employee Leave Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    if (report.length > 0) {
      const headers = [
        ["Employee", "Leave Type", "Start Date", "End Date", "Reason", "Status", "Submission Date"]
      ];

      const data = report.map((leave) => [
        leave.employee,
        leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1),
        new Date(leave.start_date).toLocaleDateString(),
        new Date(leave.end_date).toLocaleDateString(),
        leave.reason,
        leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
        new Date(leave.submission_date).toLocaleString()
      ]);

      doc.autoTable({
        head: headers,
        body: data,
        startY: 40,
        styles: {
          fontSize: 9,
          cellPadding: 2
        },
        columnStyles: {
          4: { cellWidth: 40 },
        },
        headStyles: {
          fillColor: [31, 41, 55],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        }
      });

      doc.save("employee-leave-report.pdf");
      toast.success("Report downloaded successfully");
    } else {
      doc.text("No leave history available.", 14, 40);
      doc.save("employee-leave-report.pdf");
      toast.info("Downloaded empty report");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            All Employees Leave Report
          </h2>
          <button 
            onClick={downloadPDF}
            className="px-4 py-2 bg-indigo-600 text-gray-200 rounded hover:bg-indigo-700 transition duration-300 flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32 text-gray-400">
            Loading report...
          </div>
        ) : report.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-900">
                  <th className="p-3 text-left border border-gray-700 font-semibold text-gray-200">
                    Employee
                  </th>
                  <th className="p-3 text-left border border-gray-700 font-semibold text-gray-200">
                    Leave Type
                  </th>
                  <th className="p-3 text-left border border-gray-700 font-semibold text-gray-200">
                    Start Date
                  </th>
                  <th className="p-3 text-left border border-gray-700 font-semibold text-gray-200">
                    End Date
                  </th>
                  <th className="p-3 text-left border border-gray-700 font-semibold text-gray-200">
                    Reason
                  </th>
                  <th className="p-3 text-left border border-gray-700 font-semibold text-gray-200">
                    Status
                  </th>
                  <th className="p-3 text-left border border-gray-700 font-semibold text-gray-200">
                    Submission Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.map((leave, index) => (
                  <tr key={index} className="hover:bg-gray-700 transition duration-200">
                    <td className="p-3 border border-gray-700 text-gray-300">
                      {leave.employee}
                    </td>
                    <td className="p-3 border border-gray-700 text-gray-300">
                      {leave.leave_type.charAt(0).toUpperCase() + 
                       leave.leave_type.slice(1)}
                    </td>
                    <td className="p-3 border border-gray-700 text-gray-300">
                      {new Date(leave.start_date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border border-gray-700 text-gray-300">
                      {new Date(leave.end_date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border border-gray-700 text-gray-300">
                      {leave.reason}
                    </td>
                    <td className="p-3 border border-gray-700">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        leave.status === 'approved' ? 'bg-indigo-900 text-indigo-200' :
                        leave.status === 'rejected' ? 'bg-red-900 text-red-200' :
                        'bg-yellow-900 text-yellow-200'
                      }`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-700 text-gray-300">
                      {new Date(leave.submission_date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4 text-gray-400">No leave data available</p>
        )}
      </div>
    </div>
  );
};

export default ManagerLeaveReport;