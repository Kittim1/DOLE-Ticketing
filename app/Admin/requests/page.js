"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const dummyRequests = [
  {
    ticketId: "REQ-001",
    requestName: "Printer Not Working",
    description: "Office printer is jammed and not printing",
    requestedById: "EMP-1023",
    requestedByName: "Sample User",
    remarks: "Pending",
    requestedAt: "2026-01-03T09:15:00",
  },
  {
    ticketId: "REQ-002",
    requestName: "PC Setup",
    description: "Need a new PC setup for new employee",
    requestedById: "EMP-1045",
    requestedByName: "Sample User",
    remarks: "In Progress",
    requestedAt: "2026-01-04T13:42:00",
  },
  {
    ticketId: "REQ-003",
    requestName: "Internet Issue",
    description: "No internet connection on 3rd floor",
    requestedById: "EMP-1091",
    requestedByName: "Sample User",
    remarks: "Resolved",
    requestedAt: "2026-01-05T16:08:00",
  },
];

export default function TicketsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    // Load requests from localStorage (submitted by users)
    const userRequests = JSON.parse(
      localStorage.getItem("userRequests") || "[]"
    );
    // Merge with dummy requests, prioritizing user-submitted ones
    const allRequests = [...userRequests, ...dummyRequests.filter(
      (dummy) => !userRequests.find((ur) => ur.ticketId === dummy.ticketId)
    )];
    // Sort by date (newest first)
    allRequests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    setRequests(allRequests);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }

    loadRequests();

    // Refresh requests every 2 seconds to catch new submissions
    const interval = setInterval(loadRequests, 2000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="w-full flex flex-col h-full overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex-shrink-0">Requests</h1>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left border">Ticket ID</th>
                  <th className="px-4 py-2 text-left border">Request Name</th>
                  <th className="px-4 py-2 text-left border">Description</th>
                  <th className="px-4 py-2 text-left border">Requested By</th>
                  <th className="px-4 py-2 text-left border">
                    Date & Time Requested
                  </th>
                  <th className="px-4 py-2 text-left border">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((req, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{req.ticketId}</td>
                      <td className="px-4 py-2 border font-medium">
                        {req.requestName}
                      </td>
                      <td className="px-4 py-2 border">{req.description}</td>
                      <td className="px-4 py-2 border">
                        <div>
                          <div className="font-medium">{req.requestedByName || "Unknown"}</div>
                          <div className="text-xs text-gray-500">{req.requestedById}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {new Date(req.requestedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold
                            ${
                              req.remarks === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : req.remarks === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }
                          `}
                        >
                          {req.remarks}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
