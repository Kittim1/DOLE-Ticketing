"use client";

const dummyTickets = [
  {
    ticketId: "TKT-001",
    subject: "System Login Issue",
    description: "Unable to login to the system, password reset required",
    priority: "High",
    status: "Open",
    assignedTo: "IT Support",
    createdAt: "2026-01-08T08:30:00",
    updatedAt: "2026-01-08T10:15:00",
  },
  {
    ticketId: "TKT-002",
    subject: "Email Configuration",
    description: "Need help setting up email client on new workstation",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "IT Support",
    createdAt: "2026-01-07T14:20:00",
    updatedAt: "2026-01-08T09:45:00",
  },
  {
    ticketId: "TKT-003",
    subject: "Network Connectivity",
    description: "Intermittent network disconnections in building A",
    priority: "Critical",
    status: "Open",
    assignedTo: "Network Team",
    createdAt: "2026-01-06T11:00:00",
    updatedAt: "2026-01-08T08:00:00",
  },
  {
    ticketId: "TKT-004",
    subject: "Software License Renewal",
    description: "Request for Microsoft Office license renewal",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Admin",
    createdAt: "2026-01-05T09:00:00",
    updatedAt: "2026-01-07T16:30:00",
  },
];

export default function TicketsPage() {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="w-full flex flex-col h-full overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex-shrink-0">Tickets</h1>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left border">Ticket ID</th>
                  <th className="px-4 py-2 text-left border">Subject</th>
                  <th className="px-4 py-2 text-left border">Description</th>
                  <th className="px-4 py-2 text-left border">Priority</th>
                  <th className="px-4 py-2 text-left border">Status</th>
                  <th className="px-4 py-2 text-left border">Assigned To</th>
                  <th className="px-4 py-2 text-left border">Created At</th>
                </tr>
              </thead>

              <tbody>
                {dummyTickets.map((ticket, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border font-medium">{ticket.ticketId}</td>
                    <td className="px-4 py-2 border font-medium">{ticket.subject}</td>
                    <td className="px-4 py-2 border">{ticket.description}</td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">{ticket.assignedTo}</td>
                    <td className="px-4 py-2 border text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
