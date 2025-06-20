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

// Configure Chart.js defaults for better dark mode support
ChartJS.defaults.backgroundColor = "transparent";
ChartJS.defaults.borderColor = "transparent";
ChartJS.defaults.color = "#6b7280";

interface ArrivalsData {
  arrivals_by_airline?: { [key: string]: number };
  arrivals_by_origin?: { [key: string]: number };
  arrivals_by_hour?: { [key: string]: number };
  total_passengers?: number;
  average_passengers_per_flight?: number;
  monthly_growth_rate_percent?: number;
  insights?: string[];
}

export default function ArrivalsPage() {
  const [data, setData] = useState<ArrivalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(setError);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // In a real implementation, this would fetch from your API
    // For now, we'll use mock data
    const mockData: ArrivalsData = {
      arrivals_by_airline: {
        "Ethiopian Airlines": 45,
        Lufthansa: 32,
        Emirates: 28,
        "Turkish Airlines": 25,
        "Qatar Airways": 20,
        KLM: 15,
      },
      arrivals_by_origin: {
        Dubai: 35,
        London: 30,
        Frankfurt: 25,
        Istanbul: 20,
        Paris: 15,
        Amsterdam: 12,
        Cairo: 10,
      },
      arrivals_by_hour: {
        "6": 5,
        "8": 12,
        "10": 18,
        "12": 22,
        "14": 25,
        "16": 20,
        "18": 15,
        "20": 10,
        "22": 8,
      },
      total_passengers: 12500,
      average_passengers_per_flight: 245,
      monthly_growth_rate_percent: 15.3,
      insights: [
        "Ethiopian Airlines dominates arrivals with 45 flights, indicating strong national carrier presence.",
        "Peak arrival times are between 12-16 hours, suggesting optimal scheduling for afternoon arrivals.",
        "Dubai is the top origin destination, highlighting important Middle East connectivity.",
        "15.3% monthly growth rate shows strong tourism recovery and expansion.",
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
    primary: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"],
    gradients: isDark
      ? [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ]
      : [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
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
  };

  // Bar chart options
  const barChartOptions = {
    ...baseChartOptions,
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
      },
    },
  };

  // Line chart options
  const lineChartOptions = {
    ...barChartOptions,
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
    ...baseChartOptions,
    cutout: "60%",
    plugins: {
      ...baseChartOptions.plugins,
      legend: {
        ...baseChartOptions.plugins.legend,
        position: "right" as const,
        align: "center" as const,
        labels: {
          ...baseChartOptions.plugins.legend.labels,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
    },
  };

  const airlineChartData = {
    labels: Object.keys(data?.arrivals_by_airline || {}),
    datasets: [
      {
        label: "Number of Arrivals",
        data: Object.values(data?.arrivals_by_airline || {}),
        backgroundColor: chartColors.gradients,
        borderColor: chartColors.primary,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const originChartData = {
    labels: Object.keys(data?.arrivals_by_origin || {}),
    datasets: [
      {
        data: Object.values(data?.arrivals_by_origin || {}),
        backgroundColor: chartColors.gradients,
        borderColor: chartColors.primary,
        borderWidth: 2,
      },
    ],
  };

  const hourlyChartData = {
    labels: Object.keys(data?.arrivals_by_hour || {}).map((h) => `${h}:00`),
    datasets: [
      {
        label: "Arrivals by Hour",
        data: Object.values(data?.arrivals_by_hour || {}),
        borderColor: "#3b82f6",
        backgroundColor: isDark
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(59, 130, 246, 0.05)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Flight Arrivals Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Analytics and insights for flight arrivals to Ethiopia
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Passengers
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data?.total_passengers?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

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
                Avg Passengers/Flight
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data?.average_passengers_per_flight}
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Growth
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                +{data?.monthly_growth_rate_percent}%
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Origin Countries
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Object.keys(data?.arrivals_by_origin || {}).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Arrivals by Airline
          </h2>
          <div className="h-80">
            <Bar data={airlineChartData} options={barChartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Arrivals by Origin
          </h2>
          <div className="h-80 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <Doughnut data={originChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2 transition-colors border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Hourly Arrival Pattern
          </h2>
          <div className="h-80">
            <Line data={hourlyChartData} options={lineChartOptions} />
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
                className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-300 rounded-r-lg"
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
