"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface VisitsData {
  total_visits?: number;
  average_dwell_time?: number;
  visits_by_attraction?: { [key: string]: number };
  visits_by_month?: { [key: string]: number };
  visitor_demographics?: { [key: string]: number };
  duration_distribution?: { [key: string]: number };
  peak_visiting_hours?: { [key: string]: number };
  insights?: string[];
}

export default function VisitsPage() {
  const [data, setData] = useState<VisitsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for demonstration
    const mockData: VisitsData = {
      total_visits: 185400,
      average_dwell_time: 4.5,
      visits_by_attraction: {
        "Lalibela Churches": 45200,
        "Simien Mountains": 38500,
        "Axum Obelisks": 32100,
        "Harar Old City": 28700,
        "Danakil Depression": 22300,
        "Bale Mountains": 18600,
      },
      visits_by_month: {
        "1": 12500,
        "2": 14200,
        "3": 16800,
        "4": 18500,
        "5": 19200,
        "6": 21300,
        "7": 22100,
        "8": 23400,
        "9": 20800,
        "10": 18900,
        "11": 16200,
        "12": 13500,
      },
      visitor_demographics: {
        International: 62,
        Domestic: 38,
      },
      duration_distribution: {
        "1-2 days": 25,
        "3-5 days": 35,
        "6-10 days": 28,
        "11+ days": 12,
      },
      peak_visiting_hours: {
        "8": 5,
        "9": 12,
        "10": 18,
        "11": 22,
        "12": 15,
        "13": 10,
        "14": 20,
        "15": 25,
        "16": 18,
        "17": 12,
        "18": 8,
      },
      insights: [
        "Lalibela Churches are the most visited attraction with 45,200 visits, highlighting cultural tourism importance.",
        "Peak visiting season is July-August with over 22,000 monthly visits.",
        "International visitors comprise 62% of total visits, showing strong global appeal.",
        "Average dwell time of 4.5 days indicates quality tourism experiences.",
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Chart configurations
  const attractionChartData = {
    labels: Object.keys(data?.visits_by_attraction || {}),
    datasets: [
      {
        label: "Number of Visits",
        data: Object.values(data?.visits_by_attraction || {}),
        backgroundColor: [
          "rgba(244, 63, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgba(244, 63, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: Object.keys(data?.visits_by_month || {}).map((m) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months[parseInt(m) - 1];
    }),
    datasets: [
      {
        label: "Monthly Visits",
        data: Object.values(data?.visits_by_month || {}),
        borderColor: "rgba(244, 63, 94, 1)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const demographicsChartData = {
    labels: Object.keys(data?.visitor_demographics || {}),
    datasets: [
      {
        data: Object.values(data?.visitor_demographics || {}),
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderColor: ["rgba(59, 130, 246, 1)", "rgba(16, 185, 129, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const durationChartData = {
    labels: Object.keys(data?.duration_distribution || {}),
    datasets: [
      {
        label: "Percentage of Visitors",
        data: Object.values(data?.duration_distribution || {}),
        backgroundColor: [
          "rgba(168, 85, 247, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tourism Visits Dashboard
        </h1>
        <p className="text-gray-600">
          Analytics and insights for tourist visits and attractions
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Visits</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.total_visits?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Avg Dwell Time
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.average_dwell_time} days
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                International Visitors
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.visitor_demographics?.International}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Top Attractions
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.keys(data?.visits_by_attraction || {}).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Top Attractions by Visits
          </h2>
          <Bar data={attractionChartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Visitor Demographics</h2>
          <Doughnut
            data={demographicsChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom" as const,
                },
              },
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Visit Duration Distribution
          </h2>
          <Bar data={durationChartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Visit Trends</h2>
          <Line data={monthlyChartData} options={chartOptions} />
        </div>
      </div>

      {/* Insights */}
      {data?.insights && data.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
          <div className="space-y-3">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-red-50 border-l-4 border-red-400 text-red-800"
              >
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
