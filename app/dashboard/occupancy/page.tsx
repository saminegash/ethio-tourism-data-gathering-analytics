"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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

interface OccupancyData {
  average_occupancy_rate?: number;
  peak_occupancy_rate?: number;
  lowest_occupancy_rate?: number;
  occupancy_by_region?: { [key: string]: number };
  occupancy_by_month?: { [key: string]: number };
  occupancy_by_day_of_week?: { [key: string]: number };
  total_room_capacity?: number;
  average_hotel_size?: number;
  total_revenue?: number;
  insights?: string[];
}

export default function OccupancyPage() {
  const [data, setData] = useState<OccupancyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Mock data for demonstration
    const mockData: OccupancyData = {
      average_occupancy_rate: 72.5,
      peak_occupancy_rate: 95.2,
      lowest_occupancy_rate: 45.8,
      occupancy_by_region: {
        "Addis Ababa": 85.2,
        "Bahir Dar": 78.5,
        Gondar: 68.3,
        Axum: 75.1,
        Lalibela: 82.7,
        Harar: 65.4,
        Jimma: 58.9,
      },
      occupancy_by_month: {
        "1": 65.2,
        "2": 68.5,
        "3": 72.1,
        "4": 75.8,
        "5": 78.2,
        "6": 82.5,
        "7": 85.1,
        "8": 87.3,
        "9": 82.7,
        "10": 79.4,
        "11": 74.6,
        "12": 71.2,
      },
      occupancy_by_day_of_week: {
        Monday: 68.5,
        Tuesday: 70.2,
        Wednesday: 72.1,
        Thursday: 74.8,
        Friday: 78.5,
        Saturday: 82.3,
        Sunday: 79.6,
      },
      total_room_capacity: 12500,
      average_hotel_size: 85.5,
      total_revenue: 2840000,
      insights: [
        "Addis Ababa shows highest occupancy at 85.2%, indicating strong business and leisure demand.",
        "Peak season occurs during July-August with 85-87% occupancy rates.",
        "Weekend occupancy rates are 15% higher than weekdays, suggesting strong leisure tourism.",
        "Current average occupancy of 72.5% is healthy but has room for growth in off-peak periods.",
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  // Chart color schemes
  const chartColors = {
    primary: [
      "#10b981",
      "#3b82f6",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#22d3ee",
    ],
    gradients: isDark
      ? [
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(34, 211, 238, 0.8)",
        ]
      : [
          "rgba(16, 185, 129, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(34, 211, 238, 0.7)",
        ],
  };

  // Common chart options
  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        titleColor: isDark ? "#f9fafb" : "#111827",
        bodyColor: isDark ? "#e5e7eb" : "#374151",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? "#374151" : "#f3f4f6",
          borderColor: isDark ? "#4b5563" : "#d1d5db",
        },
        ticks: {
          color: isDark ? "#d1d5db" : "#6b7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: isDark ? "#374151" : "#f3f4f6",
          borderColor: isDark ? "#4b5563" : "#d1d5db",
        },
        ticks: {
          color: isDark ? "#d1d5db" : "#6b7280",
          font: {
            size: 11,
          },
        },
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Line chart options
  const lineChartOptions = {
    ...baseChartOptions,
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  // Doughnut chart options
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "60%",
    plugins: {
      legend: {
        position: "right" as const,
        align: "center" as const,
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          usePointStyle: true,
          padding: 15,
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        titleColor: isDark ? "#f9fafb" : "#111827",
        bodyColor: isDark ? "#e5e7eb" : "#374151",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
      },
    },
  };

  const regionalChartData = {
    labels: Object.keys(data?.occupancy_by_region || {}),
    datasets: [
      {
        label: "Occupancy Rate (%)",
        data: Object.values(data?.occupancy_by_region || {}),
        backgroundColor: chartColors.gradients,
        borderColor: chartColors.primary,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const monthlyChartData = {
    labels: Object.keys(data?.occupancy_by_month || {}).map((m) => {
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
        label: "Monthly Occupancy Rate (%)",
        data: Object.values(data?.occupancy_by_month || {}),
        borderColor: "#10b981",
        backgroundColor: isDark
          ? "rgba(16, 185, 129, 0.1)"
          : "rgba(16, 185, 129, 0.05)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const weeklyChartData = {
    labels: Object.keys(data?.occupancy_by_day_of_week || {}),
    datasets: [
      {
        data: Object.values(data?.occupancy_by_day_of_week || {}),
        backgroundColor: chartColors.gradients,
        borderColor: chartColors.primary,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Hotel Occupancy Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Analytics and insights for hotel occupancy across Ethiopia
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Occupancy
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data?.average_occupancy_rate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Peak Occupancy
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data?.peak_occupancy_rate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Rooms
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data?.total_room_capacity?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ${data?.total_revenue?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Occupancy by Region
          </h2>
          <div className="h-80">
            <Bar data={regionalChartData} options={baseChartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Weekly Occupancy Pattern
          </h2>
          <div className="h-80 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <Doughnut data={weeklyChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2 transition-colors border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Monthly Occupancy Trends
          </h2>
          <div className="h-80">
            <Line data={monthlyChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Insights */}
      {data?.insights && data.insights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Key Insights
          </h2>
          <div className="grid gap-4">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 text-green-800 dark:text-green-300 rounded-r-lg"
              >
                <p className="leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
