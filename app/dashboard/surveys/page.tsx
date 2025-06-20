"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SurveyData {
  average_rating?: number;
  satisfaction_score?: number;
  rating_distribution?: { [key: string]: number };
  sentiment_distribution?: { [key: string]: number };
  positive_sentiment_percentage?: number;
  total_responses?: number;
  insights?: string[];
}

export default function SurveysPage() {
  const [data, setData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mockData: SurveyData = {
      average_rating: 4.2,
      satisfaction_score: 84.0,
      rating_distribution: {
        "1": 45,
        "2": 128,
        "3": 325,
        "4": 542,
        "5": 685,
      },
      sentiment_distribution: {
        positive: 65,
        neutral: 22,
        negative: 13,
      },
      positive_sentiment_percentage: 65.0,
      total_responses: 1725,
      insights: [
        "Overall satisfaction score of 84% indicates strong customer satisfaction.",
        "65% positive sentiment shows good service quality with room for improvement.",
        "Rating distribution skews toward higher ratings (4-5 stars comprise 71% of responses).",
        "Only 13% negative sentiment suggests effective issue resolution processes.",
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

  const ratingChartData = {
    labels: Object.keys(data?.rating_distribution || {}).map(
      (r) => `${r} Star${r !== "1" ? "s" : ""}`
    ),
    datasets: [
      {
        label: "Number of Responses",
        data: Object.values(data?.rating_distribution || {}),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
      },
    ],
  };

  const sentimentChartData = {
    labels: Object.keys(data?.sentiment_distribution || {}).map(
      (s) => s.charAt(0).toUpperCase() + s.slice(1)
    ),
    datasets: [
      {
        data: Object.values(data?.sentiment_distribution || {}),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(156, 163, 175, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Satisfaction Dashboard
        </h1>
        <p className="text-gray-600">
          Analytics and insights from customer surveys and feedback
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Average Rating
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.average_rating}/5.0
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Satisfaction Score
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.satisfaction_score}%
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-1v1h2v-1m2 4h-8a1 1 0 01-1-1V8a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Positive Sentiment
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.positive_sentiment_percentage}%
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Responses
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.total_responses?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <Bar
            data={ratingChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
          <Doughnut
            data={sentimentChartData}
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
      </div>

      {/* Insights */}
      {data?.insights && data.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
          <div className="space-y-3">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-orange-50 border-l-4 border-orange-400 text-orange-800"
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
