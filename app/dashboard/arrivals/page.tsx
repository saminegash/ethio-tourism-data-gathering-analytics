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

// Configure Chart.js defaults for Ethiopian theme
ChartJS.defaults.backgroundColor = "transparent";
ChartJS.defaults.borderColor = "transparent";
ChartJS.defaults.color = "#71717a";

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
        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl p-4">
          <p className="text-accent-600 dark:text-accent-400">Error: {error}</p>
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
    ],
    gradients: isDark
      ? [
          "rgba(58, 157, 79, 0.8)",
          "rgba(242, 168, 20, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ]
      : [
          "rgba(58, 157, 79, 0.7)",
          "rgba(242, 168, 20, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(59, 130, 246, 0.7)",
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
  };

  // Bar chart options
  const barChartOptions = {
    ...baseChartOptions,
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
      },
    },
  };

  // Line chart options
  const lineChartOptions = {
    ...baseChartOptions,
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
      },
    },
  };

  // Doughnut chart options
  const doughnutChartOptions = {
    ...baseChartOptions,
    cutout: "60%",
  };

  // Chart data configurations
  const airlineChartData = {
    labels: Object.keys(data?.arrivals_by_airline || {}),
    datasets: [
      {
        data: Object.values(data?.arrivals_by_airline || {}),
        backgroundColor: chartColors.gradients,
        borderColor: chartColors.primary,
        borderWidth: 2,
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
    labels: Object.keys(data?.arrivals_by_hour || {}),
    datasets: [
      {
        label: "Arrivals",
        data: Object.values(data?.arrivals_by_hour || {}),
        backgroundColor: chartColors.gradients[0],
        borderColor: chartColors.primary[0],
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Flight Arrivals Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analytics and insights for flight arrivals to Ethiopia
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Passengers
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {data?.total_passengers?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

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
                Avg Passengers/Flight
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {data?.average_passengers_per_flight}
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Growth
              </p>
              <p className="text-2xl font-semibold text-foreground">
                +{data?.monthly_growth_rate_percent}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
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
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Top Airlines
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {Object.keys(data?.arrivals_by_airline || {}).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Airlines Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Arrivals by Airline
          </h3>
          <div className="h-80">
            <Bar data={airlineChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Origins Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Arrivals by Origin
          </h3>
          <div className="h-80">
            <Doughnut data={originChartData} options={doughnutChartOptions} />
          </div>
        </div>

        {/* Hourly Pattern Chart */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Daily Arrival Pattern
          </h3>
          <div className="h-80">
            <Line data={hourlyChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Insights Section */}
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
              <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
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
