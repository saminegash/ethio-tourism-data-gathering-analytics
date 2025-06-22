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
  console.log(setError);
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

  // Ethiopian-themed chart colors
  const chartColors = {
    primary: [
      "#3a9d4f", // Ethiopian Green
      "#f2a814", // Ethiopian Yellow
      "#ef4444", // Ethiopian Red
      "#3b82f6", // Blue
      "#8b5cf6", // Purple
      "#ec4899", // Pink
      "#22d3ee", // Cyan
    ],
    gradients: isDark
      ? [
          "rgba(58, 157, 79, 0.8)",
          "rgba(242, 168, 20, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(34, 211, 238, 0.8)",
        ]
      : [
          "rgba(58, 157, 79, 0.7)",
          "rgba(242, 168, 20, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(59, 130, 246, 0.7)",
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
          color: isDark ? "#e4e4e7" : "#3f3f46",
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#27272a" : "#ffffff",
        titleColor: isDark ? "#fafafa" : "#18181b",
        bodyColor: isDark ? "#e4e4e7" : "#3f3f46",
        borderColor: isDark ? "#3f3f46" : "#e4e4e7",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? "#3f3f46" : "#f4f4f5",
          borderColor: isDark ? "#52525b" : "#d4d4d8",
        },
        ticks: {
          color: isDark ? "#a1a1aa" : "#71717a",
        },
      },
      y: {
        grid: {
          color: isDark ? "#3f3f46" : "#f4f4f5",
          borderColor: isDark ? "#52525b" : "#d4d4d8",
        },
        ticks: {
          color: isDark ? "#a1a1aa" : "#71717a",
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
          color: isDark ? "#e4e4e7" : "#3f3f46",
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
        backgroundColor: isDark ? "#27272a" : "#ffffff",
        titleColor: isDark ? "#fafafa" : "#18181b",
        bodyColor: isDark ? "#e4e4e7" : "#3f3f46",
        borderColor: isDark ? "#3f3f46" : "#e4e4e7",
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
        borderColor: "#f2a814", // Ethiopian Yellow
        backgroundColor: isDark
          ? "rgba(242, 168, 20, 0.1)"
          : "rgba(242, 168, 20, 0.05)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#f2a814",
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
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Hotel Occupancy Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analytics and insights for hotel occupancy across Ethiopia
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400">
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
              <p className="text-2xl font-semibold text-foreground">
                {data?.average_occupancy_rate}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
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
              <p className="text-2xl font-semibold text-foreground">
                {data?.peak_occupancy_rate}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400">
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
              <p className="text-2xl font-semibold text-foreground">
                {data?.total_room_capacity?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
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
              <p className="text-2xl font-semibold text-foreground">
                ${data?.total_revenue?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Occupancy by Region
          </h3>
          <div className="h-80">
            <Bar data={regionalChartData} options={baseChartOptions} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Weekly Occupancy Pattern
          </h3>
          <div className="h-80">
            <Doughnut data={weeklyChartData} options={doughnutChartOptions} />
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Monthly Occupancy Trends
          </h3>
          <div className="h-80">
            <Line data={monthlyChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.insights?.map((insight, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-surface-secondary rounded-xl"
            >
              <div className="w-6 h-6 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-secondary-600 dark:text-secondary-400"
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
              <p className="text-sm text-foreground leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
