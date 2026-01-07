"use client";

import { useState, useEffect } from "react";

export default function NotificationBell({ userId, role }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadNotifications();
    
    // Check for new notifications every 2 seconds
    const interval = setInterval(loadNotifications, 2000);
    return () => clearInterval(interval);
  }, [userId, role]);

  const loadNotifications = () => {
    if (role === "admin") {
      const adminNotifs = JSON.parse(
        localStorage.getItem("adminNotifications") || "[]"
      );
      setNotifications(adminNotifs);
      setUnreadCount(adminNotifs.filter((n) => !n.read).length);
    } else if (role === "user" && userId) {
      const userNotifs = JSON.parse(
        localStorage.getItem(`userNotifications_${userId}`) || "[]"
      );
      setNotifications(userNotifs);
      setUnreadCount(userNotifs.filter((n) => !n.read).length);
    }
  };

  const markAsRead = (notificationId) => {
    if (role === "admin") {
      const adminNotifs = JSON.parse(
        localStorage.getItem("adminNotifications") || "[]"
      );
      const updated = adminNotifs.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem("adminNotifications", JSON.stringify(updated));
    } else if (role === "user" && userId) {
      const userNotifs = JSON.parse(
        localStorage.getItem(`userNotifications_${userId}`) || "[]"
      );
      const updated = userNotifs.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`userNotifications_${userId}`, JSON.stringify(updated));
    }
    loadNotifications();
  };

  const markAllAsRead = () => {
    if (role === "admin") {
      const adminNotifs = JSON.parse(
        localStorage.getItem("adminNotifications") || "[]"
      );
      const updated = adminNotifs.map((n) => ({ ...n, read: true }));
      localStorage.setItem("adminNotifications", JSON.stringify(updated));
    } else if (role === "user" && userId) {
      const userNotifs = JSON.parse(
        localStorage.getItem(`userNotifications_${userId}`) || "[]"
      );
      const updated = userNotifs.map((n) => ({ ...n, read: true }));
      localStorage.setItem(`userNotifications_${userId}`, JSON.stringify(updated));
    }
    loadNotifications();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded hover:bg-gray-200 transition-colors"
        title="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-20 max-h-96 overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        !notif.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(notif.timestamp)}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
