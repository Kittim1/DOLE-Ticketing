"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const dummyRequests = [
  {
    ticketId: "REQ-001",
    requestName: "Printer Not Working",
    description: "Office printer is jammed and not printing",
    requestedById: "EMP-1023",
    remarks: "Pending",
    requestedAt: "2026-01-03T09:15:00",
  },
  {
    ticketId: "REQ-002",
    requestName: "PC Setup",
    description: "Need a new PC setup for new employee",
    requestedById: "EMP-1045",
    remarks: "In Progress",
    requestedAt: "2026-01-04T13:42:00",
  },
  {
    ticketId: "REQ-003",
    requestName: "Internet Issue",
    description: "No internet connection on 3rd floor",
    requestedById: "EMP-1091",
    remarks: "Resolved",
    requestedAt: "2026-01-05T16:08:00",
  },
  {
    ticketId: "REQ-004",
    requestName: "Software Installation",
    description: "Need Adobe Creative Suite installed on workstation",
    requestedById: "EMP-1056",
    remarks: "Pending",
    requestedAt: "2026-01-06T10:30:00",
  },
  {
    ticketId: "REQ-005",
    requestName: "Email Access Issue",
    description: "Cannot access email account, password reset needed",
    requestedById: "EMP-1088",
    remarks: "In Progress",
    requestedAt: "2026-01-07T14:20:00",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [requests, setRequests] = useState(dummyRequests);
  const [filter, setFilter] = useState("all");

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

  // 🔐 Protect admin route
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }

    const storedTickets = JSON.parse(
      localStorage.getItem("tickets") || "[]"
    );
    setTickets(storedTickets);

    loadRequests();

    // Refresh requests every 2 seconds to catch new submissions
    const interval = setInterval(loadRequests, 2000);
    return () => clearInterval(interval);
  }, [router]);

  // 🎯 Filtering
  const filteredTickets = tickets.filter(
    (t) => filter === "all" || t.status === filter
  );

  const filteredRequests = requests.filter(
    (r) => {
      if (filter === "all") return true;
      // Map filter values to remarks values
      const filterMap = {
        "pending": "Pending",
        "in progress": "In Progress",
        "resolved": "Resolved"
      };
      return r.remarks === filterMap[filter.toLowerCase()];
    }
  );

  // 🎨 Helpers
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⚠️";
      case "in-progress":
        return "⏳";
      case "resolved":
        return "✅";
      default:
        return "";
    }
  };

  const getRemarksColor = (remarks) => {
    switch (remarks) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="w-full flex flex-col h-full overflow-hidden">

        {/* Header */}
        <div className="mb-8 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track support requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
          <Stat title="Total Requests" value={requests.length} />
          <Stat
            title="Pending"
            value={requests.filter(r => r.remarks === "Pending").length}
            color="text-yellow-600"
          />
          <Stat
            title="In Progress"
            value={requests.filter(r => r.remarks === "In Progress").length}
            color="text-blue-600"
          />
          <Stat
            title="Resolved"
            value={requests.filter(r => r.remarks === "Resolved").length}
            color="text-green-600"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 flex-shrink-0">
          {["all", "pending", "in progress", "resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded capitalize ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Requests - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No requests found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.ticketId}
                  className="bg-white p-4 rounded shadow hover:shadow-md"
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{getStatusIcon(request.remarks.toLowerCase().replace(" ", "-"))}</span>
                        <h3 className="font-semibold">{request.requestName}</h3>
                        <span className="text-xs text-gray-500">({request.ticketId})</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.description}
                      </p>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                        <span>👤 {request.requestedByName || request.requestedById}</span>
                        <span>•</span>
                        <span>🆔 {request.requestedById}</span>
                        <span>•</span>
                        <span>
                          🕐 {new Date(request.requestedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getRemarksColor(
                          request.remarks
                        )}`}
                      >
                        {request.remarks}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* Small stat cardsss */
function Stat({ title, value, color = "text-gray-900" }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}
