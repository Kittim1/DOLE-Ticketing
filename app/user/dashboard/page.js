"use client";

import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/components/NotificationBell";

export default function UserDashboard() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [activeModal, setActiveModal] = useState(null);
  // "requests" | "submit" | "profile" | null

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "user") {
      router.replace("/login");
      return;
    }

    setUserId(localStorage.getItem("userId") || "");
    setUserName(localStorage.getItem("userName") || "");
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, [router]);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb", // blue
      cancelButtonColor: "#6b7280",  // gray
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
  
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been logged out successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
  
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    });
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome to DOLE Portal</h1>
              <p className="text-gray-600 mt-1">Hello, {userName}</p>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell userId={userId} role="user" />
              <button onClick={handleLogout} className="hover:bg-gray-200 p-2 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="My Requests" onClick={() => setActiveModal("requests")} />
          <DashboardCard title="Submit Request" onClick={() => setActiveModal("submit")} />
          <DashboardCard title="Profile" onClick={() => setActiveModal("profile")} />
        </div>
      </div>

      {/* MODAL */}
      {activeModal && (
        <Modal onClose={() => setActiveModal(null)}>
          {activeModal === "requests" && <MyRequests />}
          {activeModal === "submit" && <SubmitRequest />}
          {activeModal === "profile" && (
            <Profile userName={userName} userEmail={userEmail} userId={userId} />
          )}
        </Modal>
      )}
    </div>
  );
}

/* ---------------- Components ---------------- */

function DashboardCard({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------------- MODAL CONTENT ---------------- */

function MyRequests() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">My Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Ticket ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">REQ-001</td>
              <td className="border p-2">PC not opening</td>
              <td className="border p-2">Pending</td>
              <td className="border p-2">2026-01-08</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function SubmitRequest() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Submit Request</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Request Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter request title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            rows="4"
            className="w-full border rounded px-3 py-2"
            placeholder="Describe your issue"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </>
  );
}

function Profile({ userName, userEmail, userId }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      <div className="space-y-3 text-sm">
        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Name:</strong> {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
      </div>
    </>
  );
}
