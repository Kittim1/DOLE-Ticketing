"use client";

import { useState } from "react";
import Swal from "sweetalert2";

const initialUsers = [
  {
    userId: "EMP-1001",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@dole.gov.ph",
    department: "IT Department",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-01-08T09:30:00",
  },
  {
    userId: "EMP-1002",
    name: "Maria Santos",
    email: "maria.santos@dole.gov.ph",
    department: "HR Department",
    role: "User",
    status: "Active",
    lastLogin: "2026-01-08T08:15:00",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [activeUser, setActiveUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ---------- Helpers ---------- */

  const generateUserId = () => {
    const numbers = users.map(u => parseInt(u.userId.split("-")[1]));
    const next = Math.max(...numbers) + 1;
    return `EMP-${next}`;
  };

  const badge = (color) =>
    `px-2 py-1 rounded text-xs font-semibold ${color}`;

  /* ---------- CRUD ---------- */

  const handleCreate = (user) => {
    const newUser = {
      ...user,
      userId: generateUserId(),
      password: "1234",
      lastLogin: null,
    };
  
    setUsers([...users, newUser]);
    setModalType(null);
  };
  

  const handleUpdate = (updatedUser) => {
    setUsers(users.map(u =>
      u.userId === updatedUser.userId ? updatedUser : u
    ));
    setModalType(null);
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: "Delete User?",
      text: `This will remove ${user.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    }).then((res) => {
      if (res.isConfirmed) {
        setUsers(users.filter(u => u.userId !== user.userId));
      }
    });
  };

  /* ---------- Filter ---------- */

  const filteredUsers = users.filter((u) => {
    const searchMatch =
      u.userId.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());

    const roleMatch = roleFilter === "all" || u.role === roleFilter;
    const statusMatch = statusFilter === "all" || u.status === statusFilter;

    return searchMatch && roleMatch && statusMatch;
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-full p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <button
          onClick={() => setModalType("create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search users..."
          className="border px-3 py-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option>Admin</option>
          <option>User</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-blue-50">
            <tr>
              {["ID","Name","Email","Department","Role","Status","Actions"].map(h => (
                <th key={h} className="border px-3 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">{user.userId}</td>
                <td className="border px-3 py-2">{user.name}</td>
                <td className="border px-3 py-2">{user.email}</td>
                <td className="border px-3 py-2">{user.department}</td>
                <td className="border px-3 py-2">
                  <span className={badge(
                    user.role === "Admin"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="border px-3 py-2">
                  <span className={badge(
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  )}>
                    {user.status}
                  </span>
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setActiveUser(user);
                      setModalType("edit");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalType && (
        <Modal onClose={() => setModalType(null)}>
          <UserForm
            user={modalType === "edit" ? activeUser : null}
            onSubmit={modalType === "edit" ? handleUpdate : handleCreate}
          />
        </Modal>
      )}
    </div>
  );
}

/* ---------- Modal ---------- */

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3">✕</button>
        {children}
      </div>
    </div>
  );
}

/* ---------- User Form ---------- */

function UserForm({ user, onSubmit }) {
  const isEdit = Boolean(user);

  const [form, setForm] = useState(
    user || {
      name: "",
      email: "",
      password: "1234",
      department: "",
      role: "User",
      status: "Active",
    }
  );

  const generateEmail = (name) => {
    if (!name.trim()) return "";

    const parts = name.trim().toLowerCase().split(" ");
    if (parts.length < 2) return "";

    const firstLetter = parts[0][0];
    const lastName = parts[parts.length - 1];

    return `${firstLetter}${lastName}@dole.gov.ph`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm({
        ...form,
        name: value,
        email: generateEmail(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit User" : "Create User"}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ ...user, ...form });
        }}
        className="space-y-3"
      >
        {/* Name */}
        <input
          name="name"
          placeholder="FULL NAME"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Email (AUTO) */}
        <input
          name="email"
          value={form.email}
          readOnly
          className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
        />

        {/* Password (DEFAULT) */}
        {!isEdit && (
          <input
            name="password"
            value={form.password}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        )}

        {/* Department */}
        <input
          name="department"
          placeholder="DEPARTMENT"
          value={form.department}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div className="flex gap-3">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option>User</option>
            <option>Admin</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </form>
    </>
  );
}


  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {user ? "Edit User" : "Create User"}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ ...user, ...form });
        }}
        className="space-y-3"
      >
        {["name","email","department"].map(f => (
          <input
            key={f}
            name={f}
            placeholder={f.toUpperCase()}
            value={form[f]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        ))}

        <div className="flex gap-3">
          <select name="role" value={form.role} onChange={handleChange} className="border px-3 py-2 rounded w-full">
            <option>User</option>
            <option>Admin</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange} className="border px-3 py-2 rounded w-full">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </form>
    </>
  );

