"use client";

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from "chart.js";
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

interface InsightMetric {
  name: string;
  current_value: number;
  predicted_value?: number;
  trend: "increasing" | "decreasing" | "stable";
  confidence: number;
  impact_level: "high" | "medium" | "low";
  recommendation: string;
}

interface DepartmentInsight {
  department: string;
  alert_level: "critical" | "warning" | "normal" | "positive";
  key_metrics: InsightMetric[];
  recommendations: string[];
  action_items: string[];
}

interface ExecutiveSummary {
  overall_status: string;
  alert_distribution: Record<string, number>;
  high_impact_metrics: Array<{
    department: string;
    metric: string;
    value: number;
    trend: string;
  }>;
  forecast_summary: Record<string, number>;
  key_opportunities: string[];
}

interface InsightsReport {
  report_metadata: {
    generated_at: string;
    data_period: string;
    forecast_period: string;
    confidence_level: number;
  };
  executive_summary: ExecutiveSummary;
  departmental_insights: Record<string, DepartmentInsight>;
  forecasts: Record<string, any>;
  cross_departmental_initiatives: Array<{
    title: string;
    departments: string[];
    description: string;
    priority: string;
    timeline: string;
  }>;
}

const DEPARTMENT_COLORS = {
  software_development: "#3B82F6",
  operations: "#10B981",
  marketing: "#F59E0B",
  research_development: "#8B5CF6",
  resource_mobility: "#06B6D4",
  tourism_funding: "#EF4444",
};

const DEPARTMENT_NAMES = {
  software_development: "Software Development",
  operations: "Operations",
  marketing: "Marketing",
  research_development: "Research & Development",
  resource_mobility: "Resource Mobility",
  tourism_funding: "Tourism Funding",
};

export default function InsightsDashboard() {
  const [report, setReport] = useState<InsightsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsightsReport();
  }, [timeRange]);

  const fetchInsightsReport = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call your Python analytics API
      const response = await fetch("/api/analytics/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time_range: timeRange }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insights report");
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Failed to load insights report");
      // For demo purposes, use mock data
      setReport(getMockReport());
    } finally {
      setLoading(false);
    }
  };

  const getMockReport = (): InsightsReport => ({
    report_metadata: {
      generated_at: new Date().toISOString(),
      data_period: "Last 30 days",
      forecast_period: "30 days",
      confidence_level: 0.85,
    },
    executive_summary: {
      overall_status: "normal",
      alert_distribution: { critical: 0, warning: 2, normal: 4, positive: 0 },
      high_impact_metrics: [
        {
          department: "operations",
          metric: "Occupancy Rate",
          value: 72.5,
          trend: "increasing",
        },
        {
          department: "marketing",
          metric: "Market Diversity",
          value: 8.2,
          trend: "stable",
        },
        {
          department: "tourism_funding",
          metric: "Revenue Growth",
          value: 15.3,
          trend: "increasing",
        },
      ],
      forecast_summary: { arrivals: 45000, revenue: 2500000 },
      key_opportunities: [
        "Optimize pricing strategies based on demand forecasts",
        "Invest in digital transformation initiatives",
        "Strengthen international market partnerships",
      ],
    },
    departmental_insights: {
      software_development: {
        department: "software_development",
        alert_level: "normal",
        key_metrics: [
          {
            name: "API Response Time",
            current_value: 245,
            predicted_value: 270,
            trend: "increasing",
            confidence: 0.8,
            impact_level: "medium",
            recommendation: "Optimize database queries and implement caching",
          },
          {
            name: "Data Completeness",
            current_value: 96.5,
            trend: "stable",
            confidence: 0.95,
            impact_level: "high",
            recommendation: "Maintain data validation pipelines",
          },
        ],
        recommendations: [
          "Implement real-time data validation",
          "Add automated testing for data pipelines",
          "Set up monitoring alerts for system performance",
        ],
        action_items: [
          "Review database indexing strategy",
          "Implement Redis caching layer",
          "Set up comprehensive logging and monitoring",
        ],
      },
      operations: {
        department: "operations",
        alert_level: "normal",
        key_metrics: [
          {
            name: "Average Occupancy Rate",
            current_value: 72.5,
            predicted_value: 78.2,
            trend: "increasing",
            confidence: 0.85,
            impact_level: "high",
            recommendation:
              "Optimize pricing strategies based on demand patterns",
          },
          {
            name: "Revenue per Room",
            current_value: 145.2,
            trend: "stable",
            confidence: 0.9,
            impact_level: "high",
            recommendation: "Focus on high-value guest segments",
          },
        ],
        recommendations: [
          "Implement dynamic pricing based on demand forecasts",
          "Develop region-specific marketing strategies",
          "Optimize staff allocation based on occupancy patterns",
        ],
        action_items: [
          "Review pricing strategy for peak seasons",
          "Analyze competitor pricing in key markets",
          "Implement revenue management system",
        ],
      },
      marketing: {
        department: "marketing",
        alert_level: "warning",
        key_metrics: [
          {
            name: "Market Diversity Index",
            current_value: 8.2,
            trend: "stable",
            confidence: 0.7,
            impact_level: "medium",
            recommendation: "Explore emerging markets to increase diversity",
          },
          {
            name: "Leisure Segment Share",
            current_value: 45.3,
            trend: "increasing",
            confidence: 0.8,
            impact_level: "medium",
            recommendation: "Develop targeted campaigns for leisure travelers",
          },
        ],
        recommendations: [
          "Strengthen partnerships in London (top market)",
          "Explore expansion opportunities in Dubai and Frankfurt",
          "Develop market-specific promotional materials",
        ],
        action_items: [
          "Launch digital marketing campaigns for underperforming segments",
          "Develop influencer partnerships in key markets",
          "Implement visitor feedback collection system",
        ],
      },
      research_development: {
        department: "research_development",
        alert_level: "normal",
        key_metrics: [
          {
            name: "Digital Technology Adoption",
            current_value: 75.4,
            predicted_value: 86.7,
            trend: "increasing",
            confidence: 0.8,
            impact_level: "high",
            recommendation: "Accelerate digital transformation initiatives",
          },
        ],
        recommendations: [
          "Investigate AI/ML applications for personalized tourism experiences",
          "Research sustainable tourism practices and their impact",
          "Study emerging tourism technologies (VR/AR, IoT)",
        ],
        action_items: [
          "Conduct visitor behavior analysis using advanced analytics",
          "Prototype smart tourism applications",
          "Establish partnerships with tourism research institutions",
        ],
      },
      resource_mobility: {
        department: "resource_mobility",
        alert_level: "normal",
        key_metrics: [
          {
            name: "Airport Congestion Score",
            current_value: 65.0,
            trend: "stable",
            confidence: 0.75,
            impact_level: "medium",
            recommendation: "Optimize flight scheduling and ground services",
          },
          {
            name: "Regional Resource Efficiency",
            current_value: 68.5,
            trend: "stable",
            confidence: 0.8,
            impact_level: "high",
            recommendation: "Redistribute resources to high-demand regions",
          },
        ],
        recommendations: [
          "Implement dynamic resource allocation based on demand forecasts",
          "Develop transportation partnerships for better connectivity",
          "Optimize staff deployment across regions",
        ],
        action_items: [
          "Analyze transportation bottlenecks and propose solutions",
          "Create resource reallocation protocols",
          "Establish real-time resource monitoring systems",
        ],
      },
      tourism_funding: {
        department: "tourism_funding",
        alert_level: "normal",
        key_metrics: [
          {
            name: "Revenue Growth Rate",
            current_value: 15.3,
            predicted_value: 18.7,
            trend: "increasing",
            confidence: 0.85,
            impact_level: "high",
            recommendation: "Focus investment on high-ROI segments and regions",
          },
          {
            name: "Economic Impact Multiplier",
            current_value: 2.5,
            trend: "stable",
            confidence: 0.7,
            impact_level: "high",
            recommendation: "Leverage economic impact data for policy advocacy",
          },
        ],
        recommendations: [
          "Develop investment prioritization framework based on ROI analysis",
          "Create funding proposals highlighting economic impact",
          "Establish performance-based funding metrics",
        ],
        action_items: [
          "Conduct detailed ROI analysis for each tourism sector",
          "Prepare investment reports for stakeholders",
          "Identify funding gaps and opportunities",
        ],
      },
    },
    forecasts: {
      arrivals: {
        method: "prophet",
        forecast_values: [1200, 1250, 1300, 1350, 1400],
        forecast_dates: [
          "2024-01-01",
          "2024-01-02",
          "2024-01-03",
          "2024-01-04",
          "2024-01-05",
        ],
        total_predicted_arrivals: 45000,
        average_daily_arrivals: 1500,
      },
      revenue: {
        forecast_values: [80000, 85000, 90000, 95000, 100000],
        forecast_dates: [
          "2024-01-01",
          "2024-01-02",
          "2024-01-03",
          "2024-01-04",
          "2024-01-05",
        ],
        total_predicted_revenue: 2500000,
        daily_average_revenue: 83333,
      },
    },
    cross_departmental_initiatives: [
      {
        title: "Integrated Revenue Optimization",
        departments: ["operations", "marketing", "tourism_funding"],
        description:
          "Combine operational data, marketing insights, and funding strategies to maximize revenue per visitor",
        priority: "high",
        timeline: "3 months",
      },
      {
        title: "Digital Tourism Platform Development",
        departments: [
          "software_development",
          "marketing",
          "research_development",
        ],
        description:
          "Build comprehensive digital platform for enhanced visitor experience and data collection",
        priority: "high",
        timeline: "6 months",
      },
    ],
  });

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "↗️";
      case "decreasing":
        return "↘️";
      default:
        return "→";
    }
  };

  const getMetricsChartData = (department: string) => {
    const dept = report?.departmental_insights[department];
    if (!dept) return null;

    return {
      labels: dept.key_metrics.map((m) => m.name),
      datasets: [
        {
          label: "Current Value",
          data: dept.key_metrics.map((m) => m.current_value),
          backgroundColor:
            DEPARTMENT_COLORS[department as keyof typeof DEPARTMENT_COLORS] +
            "80",
          borderColor:
            DEPARTMENT_COLORS[department as keyof typeof DEPARTMENT_COLORS],
          borderWidth: 2,
        },
      ],
    };
  };

  const getForecastChartData = () => {
    if (!report?.forecasts.arrivals) return null;

    const arrivals = report.forecasts.arrivals;
    return {
      labels: arrivals.forecast_dates,
      datasets: [
        {
          label: "Predicted Arrivals",
          data: arrivals.forecast_values,
          borderColor: "#3B82F6",
          backgroundColor: "#3B82F680",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const getAlertDistributionData = () => {
    if (!report?.executive_summary.alert_distribution) return null;

    const alerts = report.executive_summary.alert_distribution;
    return {
      labels: ["Critical", "Warning", "Normal", "Positive"],
      datasets: [
        {
          data: [
            alerts.critical,
            alerts.warning,
            alerts.normal,
            alerts.positive,
          ],
          backgroundColor: ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"],
          borderWidth: 2,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-4">Error Loading Insights</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchInsightsReport}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const selectedDeptData =
    selectedDepartment !== "all"
      ? report.departmental_insights[selectedDepartment]
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tourism Analytics Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Generated:{" "}
                  {new Date(
                    report.report_metadata.generated_at
                  ).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value="all">All Departments</option>
                  {Object.keys(report.departmental_insights).map((dept) => (
                    <option key={dept} value={dept}>
                      {DEPARTMENT_NAMES[dept as keyof typeof DEPARTMENT_NAMES]}
                    </option>
                  ))}
                </select>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <button
                  onClick={fetchInsightsReport}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedDepartment === "all" ? (
          // Overview Dashboard
          <>
            {/* Executive Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Executive Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Overall Status
                  </h3>
                  <p
                    className={`text-2xl font-bold capitalize ${
                      report.executive_summary.overall_status === "warning"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {report.executive_summary.overall_status}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Forecasted Arrivals
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {report.executive_summary.forecast_summary.arrivals?.toLocaleString() ||
                      "N/A"}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Forecasted Revenue
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    $
                    {report.executive_summary.forecast_summary.revenue?.toLocaleString() ||
                      "N/A"}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Confidence Level
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(report.report_metadata.confidence_level * 100)}%
                  </p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Alert Distribution
                  </h3>
                  <div className="h-64">
                    {getAlertDistributionData() && (
                      <Doughnut
                        data={getAlertDistributionData()!}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Arrivals Forecast
                  </h3>
                  <div className="h-64">
                    {getForecastChartData() && (
                      <Line
                        data={getForecastChartData()!}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            x: { type: "time", time: { unit: "day" } },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Department Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Department Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(report.departmental_insights).map(
                  ([deptKey, dept]) => (
                    <div
                      key={deptKey}
                      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {
                            DEPARTMENT_NAMES[
                              deptKey as keyof typeof DEPARTMENT_NAMES
                            ]
                          }
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getAlertLevelColor(
                            dept.alert_level
                          )}`}
                        >
                          {dept.alert_level}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {dept.key_metrics.slice(0, 2).map((metric, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm text-gray-600">
                              {metric.name}
                            </span>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium">
                                {metric.current_value.toFixed(1)}
                              </span>
                              <span>{getTrendIcon(metric.trend)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectedDepartment(deptKey)}
                        className="mt-4 w-full bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm hover:bg-blue-100"
                      >
                        View Details
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Cross-Departmental Initiatives */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cross-Departmental Initiatives
              </h2>
              <div className="space-y-4">
                {report.cross_departmental_initiatives.map(
                  (initiative, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {initiative.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            initiative.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {initiative.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {initiative.description}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-gray-500">Departments: </span>
                          <span className="text-gray-700">
                            {initiative.departments
                              .map(
                                (d) =>
                                  DEPARTMENT_NAMES[
                                    d as keyof typeof DEPARTMENT_NAMES
                                  ]
                              )
                              .join(", ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeline: </span>
                          <span className="text-gray-700">
                            {initiative.timeline}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          // Department-specific view
          selectedDeptData && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setSelectedDepartment("all")}
                  className="text-blue-600 hover:text-blue-800 mb-4"
                >
                  ← Back to Overview
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  {
                    DEPARTMENT_NAMES[
                      selectedDepartment as keyof typeof DEPARTMENT_NAMES
                    ]
                  }{" "}
                  Department
                </h2>
              </div>

              {/* Key Metrics */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {selectedDeptData.key_metrics.map((metric, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-medium text-gray-900">
                            {metric.name}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              metric.impact_level === "high"
                                ? "bg-red-100 text-red-800"
                                : metric.impact_level === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {metric.impact_level} impact
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mb-3">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              {metric.current_value.toFixed(1)}
                            </span>
                            {metric.predicted_value && (
                              <span className="text-sm text-gray-500 ml-2">
                                → {metric.predicted_value.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg">
                              {getTrendIcon(metric.trend)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                              {metric.trend}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {metric.recommendation}
                        </p>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Confidence: {Math.round(metric.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Metrics Overview
                    </h4>
                    <div className="h-64">
                      {getMetricsChartData(selectedDepartment) && (
                        <Bar
                          data={getMetricsChartData(selectedDepartment)!}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            indexAxis: "y",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations and Action Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {selectedDeptData.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Action Items
                  </h3>
                  <ul className="space-y-2">
                    {selectedDeptData.action_items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
