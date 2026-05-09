"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Folder, Newspaper } from "lucide-react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
 CartesianGrid,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    users: 20,
    projects: 0,
    blogs: 0,
    subscribed: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    // Redirect if not logged in
    if (!token) {
      router.push("/signin");
      return;
    }

    // Fetch projects
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects");

        setStats((prev) => ({
          ...prev,
          projects: Array.isArray(res.data)
            ? res.data.length
            : res.data?.projects?.length || 0,
        }));
      } catch (err) {
        console.error("Fetching Projects error:", err);
      }
    };

    // Fetch blogs
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogposts");

        setStats((prev) => ({
          ...prev,
          blogs: res.data?.data?.length || 0,
        }));
      } catch (err) {
        console.error("Failed while fetching blogs:", err);
      }
    };

    // Fetch subscribers
    const fetchSubscribers = async () => {
      try {
        const res = await axios.get("/api/subscribe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats((prev) => ({
          ...prev,
          subscribed: res.data?.subscribers?.length || 0,
        }));
      } catch (err) {
        console.error("Error fetching subscribers:", err);
      }
    };

    fetchProjects();
    fetchBlogs();
    fetchSubscribers();
  }, [router]);

  const pieData = [
    {
      name: "Subscribed Users",
      value: stats.subscribed,
    },
    {
      name: "Unsubscribed Users",
      value: Math.max(stats.users - stats.subscribed, 0),
    },
  ];

  const barData = [
    {
      name: "Users",
      value: stats.users,
    },
    {
      name: "Projects",
      value: stats.projects,
    },
    {
      name: "Blogs",
      value: stats.blogs,
    },
  ];

  const COLORS = ["#6366F1", "#22C55E"];

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage users, projects, blogs, and platform activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
            <Users className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.users}
            </h2>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-xl">
            <Folder className="text-green-600 dark:text-green-400 w-8 h-8" />
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Projects
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.projects}
            </h2>
          </div>
        </div>

        {/* Blogs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-xl">
            <Newspaper className="text-amber-600 dark:text-amber-400 w-8 h-8" />
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Blogs
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.blogs}
            </h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Subscribers Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            System Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                fill="#6366F1"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}