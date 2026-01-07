"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/components/NotificationBell";

export default function UserDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "user") {
      router.replace("/login");
      return;
    }

    const id = localStorage.getItem("userId") || "";
    const name = localStorage.getItem("userName") || "";
    const email = localStorage.getItem("userEmail") || "";
    // Prefer showing name, fallback to email username
    setUserName(name || email.split("@")[0]);
    setUserId(id);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to DOLE Portal
              </h1>
              {userName && (
                <p className="text-gray-600 mt-1">
                  Hello, {userName}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell userId={userId} role="user" />
              <button
                onClick={handleLogout}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title="Logout"
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/user/my-requests")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              My Requests
            </h2>
            <p className="text-gray-600">View and track your submitted requests</p>
          </button>

          <button
            onClick={() => router.push("/user/submit-request")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Submit Request
            </h2>
            <p className="text-gray-600">Create a new support request</p>
          </button>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Profile
            </h2>
            <p className="text-gray-600">Manage your account information</p>
          </div>
        </div>
      </div>
    </div>
  );
}
