'use client';

import { useEffect, useState } from 'react';
import { Eye, Users, Globe, TrendingUp, MapPin, Info, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PageViewStats {
  pageUrl: string;
  totalViews: number | null;
  uniqueVisitors: number | null;
}

interface GeoStats {
  country: string | null;
  region: string | null;
  uniqueVisitors: number | null;
}

export default function MarketingDashboard() {
  const [pageViews, setPageViews] = useState<PageViewStats[]>([]);
  const [geoStats, setGeoStats] = useState<GeoStats[]>([]);
  const [topContent, setTopContent] = useState<PageViewStats[]>([]);

  useEffect(() => {
    fetch('/api/marketing/page-views')
      .then(res => res.json())
      .then(data => setPageViews(data || []))
      .catch(console.error);

    fetch('/api/marketing/geo-stats')
      .then(res => res.json())
      .then(data => setGeoStats(data || []))
      .catch(console.error);

    fetch('/api/marketing/top-content')
      .then(res => res.json())
      .then(data => setTopContent(data || []))
      .catch(console.error);
  }, []);

  // Safely calculate totals
  const totalViews = pageViews.reduce((sum, page) => sum + (page.totalViews ?? 0), 0);
  const totalUniqueVisitors = pageViews.reduce((sum, page) => sum + (page.uniqueVisitors ?? 0), 0);
  const totalCountries = new Set(geoStats.map(g => g.country ?? '')).size;

  const handleDownload = async (type: 'excel' | 'pdf') => {
    try {
      const res = await fetch(`/api/marketing/export/${type}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'excel' ? 'page_views.xlsx' : 'page_views.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download file. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Website Performance Overview</h1>
            <p className="text-gray-600 text-lg">Monitor your website’s traffic and engagement at a glance.</p>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleDownload('excel')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              <Download className="w-4 h-4" /> Excel
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard
            title="Total Page Views"
            value={totalViews.toLocaleString()}
            description="The number of times all pages on your site were viewed."
            icon={<Eye className="w-8 h-8 text-blue-600" />}
            color="blue"
          />
          <InfoCard
            title="Unique Visitors"
            value={totalUniqueVisitors.toLocaleString()}
            description="The number of distinct users visiting your site."
            icon={<Users className="w-8 h-8 text-green-600" />}
            color="green"
          />
          <InfoCard
            title="Countries Reached"
            value={totalCountries}
            description="Shows which countries your visitors come from."
            icon={<Globe className="w-8 h-8 text-purple-600" />}
            color="purple"
          />
        </div>

        {/* Top Performing Pages */}
        <Box
          title="Most Popular Pages"
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          description="The top pages on your site by total views and unique visitors."
        >
          <div className="space-y-4">
            {topContent.slice(0, 5).map((page, idx) => (
              <div
                key={page.pageUrl}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {idx + 1}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{page.pageUrl ?? 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{page.uniqueVisitors ?? 0} unique visitors</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{(page.totalViews ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>

          {topContent.some(p => p.totalViews != null) && (
            <div className="mt-6">
              <Chart
                type="bar"
                height={300}
                series={[{ name: 'Views', data: topContent.slice(0, 5).map(p => p.totalViews ?? 0) }]}
                options={{
                  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
                  colors: ['#3b82f6'],
                  plotOptions: { bar: { borderRadius: 8, horizontal: true } },
                  dataLabels: { enabled: true, style: { fontSize: '14px', fontWeight: 'bold' } },
                  xaxis: { categories: topContent.slice(0, 5).map(p => p.pageUrl ?? 'Unknown'), labels: { style: { fontSize: '12px' } } },
                  yaxis: { labels: { style: { fontSize: '12px' } } },
                  grid: { borderColor: '#f3f4f6' }
                }}
              />
            </div>
          )}
        </Box>

        {/* Visitor Locations */}
        <Box
          title="Visitor Locations"
          icon={<MapPin className="w-6 h-6 text-green-600" />}
          description="Shows where your website visitors are coming from."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {geoStats.slice(0, 5).map((geo, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 mb-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{geo.country ?? 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{geo.region ?? '-'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{geo.uniqueVisitors ?? 0}</p>
                    <p className="text-xs text-gray-500">visitors</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              {geoStats.some(g => g.uniqueVisitors != null) && (
                <Chart
                  type="donut"
                  height={350}
                  series={geoStats.slice(0, 5).map(g => g.uniqueVisitors ?? 0)}
                  options={{
                    labels: geoStats.slice(0, 5).map(g => g.country ?? 'Unknown'),
                    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                    legend: { position: 'bottom', fontSize: '14px' },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '70%',
                          labels: { show: true, total: { show: true, label: 'Total Visitors', fontSize: '16px', fontWeight: 'bold' } }
                        }
                      }
                    },
                    dataLabels: { enabled: true, style: { fontSize: '14px', fontWeight: 'bold' } }
                  }}
                />
              )}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}

function InfoCard({ title, value, description, icon, color }: { title: string, value: string | number, description: string, icon: React.ReactNode, color: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 border-${color}-500 hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
            <Info className="w-3 h-3"/> {description}
          </p>
        </div>
        <div className={`bg-${color}-100 p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Box({ title, icon, description, children }: { title: string, icon: React.ReactNode, description: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
