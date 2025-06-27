// src/app/dashboard/VisitorList.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function VisitorList() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/track")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVisitors(data.visitors);
        }
      })
      .catch((err) => console.error("Failed to fetch visitors", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Visitor Logs</h2>{" "}
      <p>total visitors: {visitors.length}</p>
      {loading ? (
        <p>Loading visitors...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="">
                <th className="text-left p-2 border">IP</th>
                <th className="text-left p-2 border">Visited URL</th>
                <th className="text-left p-2 border">User Agent</th>
                <th className="text-left p-2 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 border">{visitor.ip}</td>
                  <td className="p-2 border">{visitor.url}</td>
                  <td className="p-2 border truncate max-w-[200px]">
                    {visitor.userAgent}
                  </td>
                  <td className="p-2 border">
                    {new Date(visitor.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
