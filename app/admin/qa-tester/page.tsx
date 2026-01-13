"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

interface QATestReport {
  _id: string;
  uploadBy: string;
  fileName: string;
  testPhase: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  bugCount: number;
  remarks?: string;
  rawData: any[];
}

interface Feedback {
  _id: string;
  userId?: string;
  feedbackText: string;
  sentiment?: string;
  source?: string;
  createdAt: string;
}

interface StaffMember {
  _id: string;
  names: string;
  email: string;
  role: string;
}

export default function QADashboard() {
  const [activeTab, setActiveTab] = useState<"upload" | "reports" | "feedback" | "metrics">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [uploadBy, setUploadBy] = useState("");
  const [testPhase, setTestPhase] = useState("");
  const [reports, setReports] = useState<QATestReport[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Get token on client-side only
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    setToken(storedToken);
  }, []);

  // Fetch reports
  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/qa-tester/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  // Fetch staff
  const fetchStaff = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setStaff(res.data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("/api/qa-tester/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    }
  };

  // Load data whenever tab or token changes
  useEffect(() => {
    if (!token) return;
    if (activeTab === "reports") fetchReports();
    if (activeTab === "feedback") fetchFeedbacks();
    if (activeTab === "upload") fetchStaff();
  }, [activeTab, token]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    if (!uploadBy) return alert("Please provide your name");
    if (!testPhase) return alert("Please provide the test phase");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadBy", uploadBy);
    formData.append("testPhase", testPhase);
    formData.append("notifiedUsers", JSON.stringify(selectedUsers));

    try {
      const res = await axios.post("/api/qa-tester/upload", formData);
      alert("Upload successful! Report ID: " + res.data.id);
      setFile(null);
      setUploadBy("");
      setTestPhase("");
      setSelectedUsers([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navbar */}
      {/* Sub Navbar (sits below main navbar) */}
<nav className="bg-indigo-100 text-indigo-700 text-sm px-6 py-1 flex justify-between items-center sticky top-[2px] z-40 shadow-sm border-b border-indigo-200">
  <h2 className="font-semibold">QA Dashboard</h2>
  <ul className="flex space-x-4">
    {["upload", "reports", "feedback", "metrics"].map((tab) => (
      <li
        key={tab}
        className={`cursor-pointer capitalize transition ${
          activeTab === tab
            ? "font-semibold text-indigo-900 border-b-2 border-indigo-600"
            : "hover:text-indigo-500"
        }`}
        onClick={() => setActiveTab(tab as any)}
      >
        {tab}
      </li>
    ))}
  </ul>
</nav>


      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Upload */}
        {activeTab === "upload" && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">Upload QA Report</h2>

            <input
              type="text"
              placeholder="Uploaded by"
              value={uploadBy}
              onChange={(e) => setUploadBy(e.target.value)}
              className="border p-2 mb-2 w-full rounded"
            />
            <input
              type="text"
              placeholder="Test Phase"
              value={testPhase}
              onChange={(e) => setTestPhase(e.target.value)}
              className="border p-2 mb-2 w-full rounded"
            />
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="mb-4"
            />

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Notify Staff Members
              </h3>
              <input
                type="text"
                placeholder="Search staff by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
              />
              <div className="border rounded p-2 max-h-60 overflow-y-auto bg-white">
                {filteredStaff.map((s) => (
                  <div key={s._id} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(s._id)}
                      onChange={() => toggleUserSelection(s._id)}
                      className="mr-2"
                    />
                    <span>
                      {s.names} ({s.role}) —{" "}
                      <span className="text-gray-600">{s.email}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        )}

        {/* Reports */}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">QA Reports</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-1">ID</th>
                    <th className="border px-2 py-1">Uploaded By</th>
                    <th className="border px-2 py-1">File Name</th>
                    <th className="border px-2 py-1">Phase</th>
                    <th className="border px-2 py-1">Total</th>
                    <th className="border px-2 py-1">Passed</th>
                    <th className="border px-2 py-1">Failed</th>
                    <th className="border px-2 py-1">Bugs</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{r._id}</td>
                      <td className="border px-2 py-1">{r.uploadBy}</td>
                      <td className="border px-2 py-1">{r.fileName}</td>
                      <td className="border px-2 py-1">{r.testPhase}</td>
                      <td className="border px-2 py-1">{r.totalTests}</td>
                      <td className="border px-2 py-1">{r.passedTests}</td>
                      <td className="border px-2 py-1">{r.failedTests}</td>
                      <td className="border px-2 py-1">{r.bugCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback */}
        {activeTab === "feedback" && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">User Feedback</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-1">ID</th>
                    <th className="border px-2 py-1">User</th>
                    <th className="border px-2 py-1">Feedback</th>
                    <th className="border px-2 py-1">Sentiment</th>
                    <th className="border px-2 py-1">Source</th>
                    <th className="border px-2 py-1">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f) => (
                    <tr key={f._id} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{f._id}</td>
                      <td className="border px-2 py-1">
                        {f.userId || "Anonymous"}
                      </td>
                      <td className="border px-2 py-1">{f.feedbackText}</td>
                      <td className="border px-2 py-1">
                        {f.sentiment || "N/A"}
                      </td>
                      <td className="border px-2 py-1">{f.source}</td>
                      <td className="border px-2 py-1">
                        {new Date(f.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Metrics */}
        {activeTab === "metrics" && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">Metrics (Coming Soon)</h2>
          </div>
        )}
      </main>
    </div>
  );
}
