"use client";

import { useState, useEffect } from "react";

const dummyUsers = [
  {
    userId: "EMP-1001",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@dole.gov.ph",
    department: "IT Department",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-01-08T09:30:00",
    createdAt: "2025-06-15T08:00:00",
  },
  {
    userId: "EMP-1002",
    name: "Maria Santos",
    email: "maria.santos@dole.gov.ph",
    department: "HR Department",
    role: "User",
    status: "Active",
    lastLogin: "2026-01-08T08:15:00",
    createdAt: "2025-07-20T08:00:00",
  },
  {
    userId: "EMP-1003",
    name: "Carlos Reyes",
    email: "carlos.reyes@dole.gov.ph",
    department: "Finance Department",
    role: "User",
    status: "Active",
    lastLogin: "2026-01-07T16:45:00",
    createdAt: "2025-08-10T08:00:00",
  },
  {
    userId: "EMP-1004",
    name: "Ana Garcia",
    email: "ana.garcia@dole.gov.ph",
    department: "Operations",
    role: "User",
    status: "Inactive",
    lastLogin: "2025-12-20T14:20:00",
    createdAt: "2025-09-05T08:00:00",
  },
  {
    userId: "EMP-1005",
    name: "Roberto Martinez",
    email: "roberto.martinez@dole.gov.ph",
    department: "IT Department",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-01-08T10:00:00",
    createdAt: "2025-10-12T08:00:00",
  },
];

export default function UsersPage() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState("");

  useEffect(() => {
    // Get logged in user's userId
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    
    if (userId) {
      // Find the user in dummyUsers by userId
      const user = dummyUsers.find(u => u.userId === userId);
      if (user) {
        setLoggedInUser(user);
        setLoggedInUserName(user.name);
      } else if (userName) {
        // Fallback to stored name if user not found in list
        setLoggedInUserName(userName);
      }
    }
  }, []);

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getRoleColor = (role) => {
    return role === "Admin"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="w-full flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          {loggedInUserName && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-600">
                Logged in as: <span className="font-semibold text-blue-800">{loggedInUserName}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left border">User ID</th>
                  <th className="px-4 py-2 text-left border">Name</th>
                  <th className="px-4 py-2 text-left border">Email</th>
                  <th className="px-4 py-2 text-left border">Department</th>
                  <th className="px-4 py-2 text-left border">Role</th>
                  <th className="px-4 py-2 text-left border">Status</th>
                  <th className="px-4 py-2 text-left border">Last Login</th>
                </tr>
              </thead>

              <tbody>
                {dummyUsers.map((user, index) => {
                  const isLoggedInUser = loggedInUser && user.userId === loggedInUser.userId;
                  return (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 ${isLoggedInUser ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
                  >
                    <td className="px-4 py-2 border font-medium">
                      {user.userId}
                      {isLoggedInUser && <span className="ml-2 text-xs text-blue-600">(You)</span>}
                    </td>
                    <td className="px-4 py-2 border font-medium">
                      {user.name}
                      {isLoggedInUser && <span className="ml-2 text-xs font-semibold text-blue-600">← Current User</span>}
                    </td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.department}</td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-600">
                      {new Date(user.lastLogin).toLocaleString()}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
