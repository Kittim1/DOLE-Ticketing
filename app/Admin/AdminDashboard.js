"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");

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
  }, [router]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    router.replace("/login");
  };

  // 🎯 Filtering
  const filteredTickets = tickets.filter(
    (t) => filter === "all" || t.status === filter
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track support tickets
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="border px-4 py-2 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Stat title="Total Tickets" value={tickets.length} />
          <Stat
            title="Pending"
            value={tickets.filter(t => t.status === "pending").length}
            color="text-yellow-600"
          />
          <Stat
            title="In Progress"
            value={tickets.filter(t => t.status === "in-progress").length}
            color="text-blue-600"
          />
          <Stat
            title="Resolved"
            value={tickets.filter(t => t.status === "resolved").length}
            color="text-green-600"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "in-progress", "resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded capitalize ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Tickets */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No tickets found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-4 rounded shadow hover:shadow-md"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getStatusIcon(ticket.status)}</span>
                      <h3 className="font-semibold">{ticket.subject}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {ticket.description}
                    </p>
                    <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                      <span>👤 {ticket.name}</span>
                      <span>•</span>
                      <span>📧 {ticket.email}</span>
                      <span>•</span>
                      <span>🏢 {ticket.department}</span>
                      <span>•</span>
                      <span>
                        🕐 {new Date(ticket.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                      {ticket.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* Small stat card */
function Stat({ title, value, color = "text-gray-900" }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}
