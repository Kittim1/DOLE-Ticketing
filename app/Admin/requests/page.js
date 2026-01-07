"use client";

const dummyRequests = [
  {
    ticketId: "REQ-001",
    requestName: "Printer Not Working",
    description: "Office printer is jammed and not printing",
    requestedById: "EMP-1023",
    remarks: "Pending",
    requestedAt: "2026-01-03T09:15:00",
  },
  {
    ticketId: "REQ-002",
    requestName: "PC Setup",
    description: "Need a new PC setup for new employee",
    requestedById: "EMP-1045",
    remarks: "In Progress",
    requestedAt: "2026-01-04T13:42:00",
  },
  {
    ticketId: "REQ-003",
    requestName: "Internet Issue",
    description: "No internet connection on 3rd floor",
    requestedById: "EMP-1091",
    remarks: "Resolved",
    requestedAt: "2026-01-05T16:08:00",
  },
];

export default function TicketsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Requests</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border">Ticket ID</th>
              <th className="px-4 py-2 text-left border">Request Name</th>
              <th className="px-4 py-2 text-left border">Description</th>
              <th className="px-4 py-2 text-left border">Requested By ID</th>
              <th className="px-4 py-2 text-left border">
                Date & Time Requested
              </th>
              <th className="px-4 py-2 text-left border">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {dummyRequests.map((req, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{req.ticketId}</td>
                <td className="px-4 py-2 border font-medium">
                  {req.requestName}
                </td>
                <td className="px-4 py-2 border">{req.description}</td>
                <td className="px-4 py-2 border">{req.requestedById}</td>
                <td className="px-4 py-2 border text-sm text-gray-600">
                  {new Date(req.requestedAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                      ${
                        req.remarks === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.remarks === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }
                    `}
                  >
                    {req.remarks}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
