"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "user") {
      router.replace("/login");
      return;
    }

    const id = localStorage.getItem("userId") || "";
    setUserId(id);

    // Load user's requests
    const allRequests = JSON.parse(
      localStorage.getItem("userRequests") || "[]"
    );
    const userRequests = allRequests.filter(
      (req) => req.requestedById === id
    );
    setRequests(userRequests);
  }, [router]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⚠️";
      case "In Progress":
        return "⏳";
      case "Resolved":
        return "✅";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
            <button
              onClick={() => router.push("/user/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No requests submitted yet</p>
            <button
              onClick={() => router.push("/user/submit-request")}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Your First Request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.ticketId}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{getStatusIcon(request.remarks)}</span>
                      <h3 className="text-xl font-semibold">{request.requestName}</h3>
                      <span className="text-xs text-gray-500">({request.ticketId})</span>
                    </div>
                    <p className="text-gray-600 mb-3">{request.description}</p>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                      <span>📁 {request.category}</span>
                      <span>•</span>
                      <span>🕐 {new Date(request.requestedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${getRemarksColor(
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
  );
}
