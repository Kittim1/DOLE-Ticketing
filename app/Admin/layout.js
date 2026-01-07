"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import NotificationBell from "@/app/components/NotificationBell";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Get logged in user
  useEffect(() => {
    const userName = localStorage.getItem("userName") || "";
    const email = localStorage.getItem("userEmail") || "";
    // Prefer showing name, fallback to email
    setUserEmail(userName || email);
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.replace("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Sidebar */}
      <aside
  className={`
    fixed inset-y-0 left-0 md:static
    z-40
    w-64
    bg-gradient-to-b from-blue-600 to-indigo-700 text-white
    p-5
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    flex-shrink-0
    shadow-lg
  `}
>

        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="flex flex-col gap-3 text-sm">
          <Link 
            href="/Admin" 
            onClick={() => setOpen(false)} 
            className={`px-3 py-2 rounded transition-colors ${
              pathname === "/Admin" 
                ? "bg-blue-500/50 text-blue-100 font-semibold" 
                : "hover:text-blue-200 hover:bg-blue-500/30"
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/Admin/tickets" 
            onClick={() => setOpen(false)} 
            className={`px-3 py-2 rounded transition-colors ${
              pathname === "/Admin/tickets" 
                ? "bg-blue-500/50 text-blue-100 font-semibold" 
                : "hover:text-blue-200 hover:bg-blue-500/30"
            }`}
          >
            Tickets
          </Link>
          <Link 
            href="/Admin/requests" 
            onClick={() => setOpen(false)} 
            className={`px-3 py-2 rounded transition-colors ${
              pathname === "/Admin/requests" 
                ? "bg-blue-500/50 text-blue-100 font-semibold" 
                : "hover:text-blue-200 hover:bg-blue-500/30"
            }`}
          >
            Requests
          </Link>
          <Link 
            href="/Admin/users" 
            onClick={() => setOpen(false)} 
            className={`px-3 py-2 rounded transition-colors ${
              pathname === "/Admin/users" 
                ? "bg-blue-500/50 text-blue-100 font-semibold" 
                : "hover:text-blue-200 hover:bg-blue-500/30"
            }`}
          >
            Users
          </Link>
          <Link 
            href="/Admin/settings" 
            onClick={() => setOpen(false)} 
            className={`px-3 py-2 rounded transition-colors ${
              pathname === "/Admin/settings" 
                ? "bg-blue-500/50 text-blue-100 font-semibold" 
                : "hover:text-blue-200 hover:bg-blue-500/30"
            }`}
          >
            Settings
          </Link>
          <Link 
            href="/Admin/qrcode" 
            onClick={() => setOpen(false)} 
            className={`px-3 py-2 rounded transition-colors ${
              pathname === "/Admin/qrcode" 
                ? "bg-blue-500/50 text-blue-100 font-semibold" 
                : "hover:text-blue-200 hover:bg-blue-500/30"
            }`}
          >
            Generate QR Code
          </Link>
        </nav>
      </aside>

      {/* Overlay (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>
            <h1 className="font-semibold text-lg">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-gray-700 font-medium">
                Hello, {userEmail.split("@")[0]}
              </span>
            )}
            <NotificationBell userId="" role="admin" />
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
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
