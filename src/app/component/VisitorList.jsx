// src/app/dashboard/VisitorList.jsx
"use client";
import React, { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

export default function VisitorList() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/track")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // userAgent পার্স করে visitor data প্রসেস করা
          const parsedVisitors = data.visitors.map((visitor) => {
            const parser = new UAParser(visitor.userAgent);
            const result = parser.getResult();
            return {
              ...visitor,
              browser: result.browser.name + " " + result.browser.version,
              os: result.os.name + " " + result.os.version,
              device: result.device.type || "desktop",
            };
          });
          setVisitors(parsedVisitors);
        }
      })
      .catch((err) => console.error("Failed to fetch visitors", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Visitor Logs</h2>
      <p>total visitors: {visitors.length}</p>
      {loading ? (
        <p>Loading visitors...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="text-left p-2 border">IP</th>
                <th className="text-left p-2 border">Visited URL</th>
                <th className="text-left p-2 border">Browser</th>
                <th className="text-left p-2 border">OS</th>
                <th className="text-left p-2 border">Device</th>
                <th className="text-left p-2 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 border">{visitor.ip}</td>
                  <td className="p-2 border">{visitor.url}</td>
                  <td className="p-2 border">{visitor.browser}</td>
                  <td className="p-2 border">{visitor.os}</td>
                  <td className="p-2 border">{visitor.device}</td>
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
