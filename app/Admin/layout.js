"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
  className={`
    fixed inset-y-0 left-0 md:static
    z-40
    w-64
    bg-gray-900 text-white
    p-5
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>

        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/Admin" onClick={() => setOpen(false)} className="hover:text-blue-400">
            Dashboard
          </Link>
          <Link href="/Admin/tickets" onClick={() => setOpen(false)} className="hover:text-blue-400">
            Tickets
          </Link>
          <Link href="/Admin/requests" onClick={() => setOpen(false)} className="hover:text-blue-400">
            Requests
          </Link>
          <Link href="/Admin/users" onClick={() => setOpen(false)} className="hover:text-blue-400">
            Users
          </Link>
          <Link href="/Admin/settings" onClick={() => setOpen(false)} className="hover:text-blue-400">
            Settings
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
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow px-4 py-3 flex items-center gap-4">
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
          <h1 className="font-semibold text-lg">Admin Panel</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
