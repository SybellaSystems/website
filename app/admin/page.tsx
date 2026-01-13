"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Folder, Newspaper } from "lucide-react";
import HeartBeat from './heartBeat'
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

    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects/');
        setStats(prev => ({
          ...prev,
          projects: res.data.length
        }))
      } catch (err) {
        console.error("Fetching Projects error", err)
      }
    }
    fetchProjects()

    const fetchBlogs = async () => {
      try { 

        const res = await axios.get('/api/blogposts')

        setStats(prev => ({
          ...prev,
          blogs: res.data.data.length
        }))
      } catch (err) {
        console.error("Failed while fetching blogs", err)
      }
    }

    fetchBlogs()

    const fetchSubscribers = async () => {
      try {
        const response = await axios.get('/api/subscribe', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setStats(prev => ({
          ...prev,
          subscribed: response.data.subscribers.length
        }));
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
    };

    fetchSubscribers();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/signin");
    }

    // 🔹 Replace this with API call to fetch real stats
    // fetch("/api/admin/stats").then(res => res.json()).then(data => setStats(data));
  }, [router]);

  const pieData = [
    { name: "Subscribed Users", value: stats.subscribed },
    { name: "Unsubscribed Users", value: stats.users - stats.subscribed },
  ];

  const barData = [
    { name: "Users", value: stats.users },
    { name: "Projects", value: stats.projects },
    { name: "Blogs", value: stats.blogs },
  ];

  const COLORS = ["#6366F1", "#22C55E"];

  return (
    <div className="p-6">
      <HeartBeat />
      {/* Header */}
      <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Manage users, blogs, contacts, and staff from here.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <Users className="text-indigo-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-xl font-bold">{stats.users}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <Folder className="text-green-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Projects</p>
            <h2 className="text-xl font-bold">{stats.projects}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <Newspaper className="text-amber-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Blogs</p>
            <h2 className="text-xl font-bold">{stats.blogs}</h2>
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Subscribed Users</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">System Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
