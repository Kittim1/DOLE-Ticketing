"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SubmitRequestPage() {
  const router = useRouter();
  const [requestName, setRequestName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "user") {
      router.replace("/login");
      return;
    }

    const id = localStorage.getItem("userId") || "";
    const name = localStorage.getItem("userName") || "";
    setUserId(id);
    setUserName(name);
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!requestName.trim() || !description.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Generate ticket ID
    const ticketId = `REQ-${Date.now()}`;
    
    // Create request object
    const newRequest = {
      ticketId,
      requestName: requestName.trim(),
      description: description.trim(),
      category: category.trim() || "General",
      priority,
      requestedById: userId,
      requestedByName: userName,
      remarks: "Pending",
      requestedAt: new Date().toISOString(),
      status: "pending",
    };

    // Get existing requests from localStorage
    const existingRequests = JSON.parse(
      localStorage.getItem("userRequests") || "[]"
    );

    // Add new request
    const updatedRequests = [newRequest, ...existingRequests];
    localStorage.setItem("userRequests", JSON.stringify(updatedRequests));

    // Create notification for admin
    const notifications = JSON.parse(
      localStorage.getItem("adminNotifications") || "[]"
    );
    notifications.unshift({
      id: `notif-${Date.now()}`,
      type: "new_request",
      message: `New request submitted: ${requestName}`,
      requestId: ticketId,
      requestedBy: userName || userId,
      timestamp: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem("adminNotifications", JSON.stringify(notifications));

    // Create notification for user
    const userNotifications = JSON.parse(
      localStorage.getItem(`userNotifications_${userId}`) || "[]"
    );
    userNotifications.unshift({
      id: `notif-${Date.now()}`,
      type: "request_submitted",
      message: `Your request "${requestName}" has been submitted successfully`,
      requestId: ticketId,
      timestamp: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem(`userNotifications_${userId}`, JSON.stringify(userNotifications));

    setSuccess("Request submitted successfully!");
    setIsSubmitting(false);

    // Reset form
    setRequestName("");
    setDescription("");
    setCategory("");
    setPriority("medium");

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push("/user/dashboard");
    }, 2000);
  };

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
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Submit Request
              </h1>
              {userName && (
                <p className="text-gray-600 mt-1">Hello, {userName}</p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/user/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
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

        {/* Form */}
        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="requestName">Request Name *</Label>
                <Input
                  id="requestName"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="e.g., Printer Not Working"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information about your request..."
                  required
                  rows={5}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., IT Support, Facilities, etc."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
