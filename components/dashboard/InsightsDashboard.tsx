"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  RadialLinearScale,
} from "chart.js";
import { Line, Bar, Doughnut, Radar, Pie } from "react-chartjs-2";
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
  TimeScale,
  RadialLinearScale
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
  dimensional_analysis?: {
    regions?: {
      top_performers: Array<{
        name: string;
        value: number;
        percentage: number;
      }>;
    };
    destinations?: {
      top_performers: Array<{
        name: string;
        value: number;
        percentage: number;
      }>;
    };
    nationalities?: {
      top_performers: Array<{
        name: string;
        value: number;
        percentage: number;
      }>;
    };
    demographics?: {
      top_performers: Array<{
        name: string;
        value: number;
        percentage: number;
      }>;
    };
    sectors?: {
      top_performers: Array<{
        name: string;
        value: number;
        percentage: number;
      }>;
    };
    age_groups?: {
      top_performers: Array<{
        name: string;
        value: number;
        percentage: number;
      }>;
    };
    package_types?: {
      top_performers: Array<{
        name: string;
        value: number;
        percentage: number;
      }>;
    };
  };
  performance_indicators?: {
    market_diversity_index?: number;
    monthly_growth_rate?: number;
    forecast_confidence?: number;
  };
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

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#EF4444",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#F43F5E",
];

export default function InsightsDashboard() {
  const [report, setReport] = useState<InsightsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedAnalytic, setSelectedAnalytic] = useState<string>("overview");
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchInsightsReport = useCallback(async () => {
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

      const apiData = await response.json();

      // Transform API response to match component expectations
      const transformedData: InsightsReport = {
        report_metadata: {
          generated_at: apiData.timestamp || new Date().toISOString(),
          data_period: `Last ${timeRange.replace("d", " days")}`,
          forecast_period: "30 days",
          confidence_level: 0.85,
        },
        executive_summary: {
          overall_status: apiData.summary?.overall_status || "normal",
          alert_distribution: apiData.summary?.alert_distribution || {
            critical: 0,
            warning: 2,
            normal: 4,
            positive: 0,
          },
          high_impact_metrics: apiData.summary?.high_impact_metrics || [],
          forecast_summary: apiData.summary?.forecast_summary || {
            arrivals: 514714,
            revenue: 2890000,
          },
          key_opportunities: apiData.summary?.key_opportunities || [],
          dimensional_analysis:
            apiData.summary?.dimensional_analysis ||
            getMockDimensionalAnalysis(),
          performance_indicators: apiData.summary?.performance_indicators || {
            market_diversity_index: 12.5,
            monthly_growth_rate: 8.3,
            forecast_confidence: 0.85,
          },
        },
        departmental_insights: getMockDepartmentalInsights(),
        forecasts: getMockForecasts(apiData.summary?.forecast_summary),
        cross_departmental_initiatives: getMockCrossDepartmentalInitiatives(),
      };

      setReport(transformedData);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Failed to load insights report");
      // For demo purposes, use mock data
      setReport(getMockReport());
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchInsightsReport();
  }, [fetchInsightsReport]);

  const getMockDimensionalAnalysis = () => ({
    regions: {
      top_performers: [
        { name: "Addis Ababa", value: 125000, percentage: 35.2 },
        { name: "Oromia", value: 89000, percentage: 25.1 },
        { name: "Amhara", value: 67000, percentage: 18.9 },
        { name: "SNNP", value: 45000, percentage: 12.7 },
        { name: "Tigray", value: 29000, percentage: 8.1 },
      ],
    },
    destinations: {
      top_performers: [
        { name: "Harar Old City", value: 156000, percentage: 44.0 },
        { name: "Danakil Depression", value: 53000, percentage: 15.0 },
        { name: "Simien Mountains", value: 42000, percentage: 11.9 },
        { name: "Lalibela", value: 38000, percentage: 10.7 },
        { name: "Axum", value: 34000, percentage: 9.6 },
      ],
    },
    nationalities: {
      top_performers: [
        { name: "Australia", value: 89000, percentage: 17.8 },
        { name: "Morocco", value: 76000, percentage: 15.2 },
        { name: "Algeria", value: 67000, percentage: 13.4 },
        { name: "Canada", value: 58000, percentage: 11.6 },
        { name: "Germany", value: 52000, percentage: 10.4 },
        { name: "United States", value: 45000, percentage: 9.0 },
        { name: "United Kingdom", value: 38000, percentage: 7.6 },
        { name: "France", value: 32000, percentage: 6.4 },
        { name: "Italy", value: 28000, percentage: 5.6 },
        { name: "Japan", value: 25000, percentage: 5.0 },
      ],
    },
    demographics: {
      top_performers: [
        { name: "Female", value: 250450, percentage: 50.09 },
        { name: "Male", value: 249550, percentage: 49.91 },
      ],
    },
    sectors: {
      top_performers: [
        { name: "Airlines", value: 180000, percentage: 36.0 },
        { name: "Hotels", value: 165000, percentage: 33.0 },
        { name: "Regional Tourism", value: 98000, percentage: 19.6 },
        { name: "Tour Operators", value: 57000, percentage: 11.4 },
      ],
    },
    age_groups: {
      top_performers: [
        { name: "26-35", value: 145000, percentage: 29.0 },
        { name: "36-50", value: 125000, percentage: 25.0 },
        { name: "18-25", value: 110000, percentage: 22.0 },
        { name: "51-65", value: 95000, percentage: 19.0 },
        { name: "65+", value: 25000, percentage: 5.0 },
      ],
    },
    package_types: {
      top_performers: [
        { name: "Standard", value: 187500, percentage: 37.5 },
        { name: "Premium", value: 162500, percentage: 32.5 },
        { name: "Budget", value: 125000, percentage: 25.0 },
        { name: "Luxury", value: 25000, percentage: 5.0 },
      ],
    },
  });

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
          metric: "Average Hotel Nights per Visitor",
          value: 3.2,
          trend: "increasing",
        },
        {
          department: "marketing",
          metric: "Average Spending per Visitor",
          value: 1250,
          trend: "increasing",
        },
        {
          department: "tourism_funding",
          metric: "Total Tourism Revenue",
          value: 2890000,
          trend: "increasing",
        },
      ],
      forecast_summary: { arrivals: 514714, revenue: 2890000 },
      key_opportunities: [
        "Leverage success of Harar Old City for marketing other destinations",
        "Strengthen partnerships in Australia market (top source)",
        "Optimize pricing strategies based on demand forecasts",
        "Develop age-specific packages for 26-35 demographic",
        "Focus on high-value Australian visitors",
      ],
      dimensional_analysis: getMockDimensionalAnalysis(),
      performance_indicators: {
        market_diversity_index: 12.5,
        monthly_growth_rate: 8.3,
        forecast_confidence: 0.85,
      },
    },
    departmental_insights: getMockDepartmentalInsights(),
    forecasts: getMockForecasts(),
    cross_departmental_initiatives: getMockCrossDepartmentalInitiatives(),
  });

  const getMockDepartmentalInsights = () => ({
    operations: {
      department: "operations",
      alert_level: "normal" as const,
      key_metrics: [
        {
          name: "Average Hotel Nights per Visitor",
          current_value: 3.2,
          trend: "increasing" as const,
          confidence: 0.9,
          impact_level: "high" as const,
          recommendation: "Optimize pricing to increase average stay duration",
        },
        {
          name: "Average Hotel Rating",
          current_value: 4.2,
          trend: "stable" as const,
          confidence: 0.85,
          impact_level: "high" as const,
          recommendation:
            "Focus on improving service quality for lower-rated properties",
        },
        {
          name: "Infrastructure Satisfaction",
          current_value: 3.8,
          trend: "increasing" as const,
          confidence: 0.8,
          impact_level: "medium" as const,
          recommendation: "Continue infrastructure improvements",
        },
      ],
      recommendations: [
        "Implement dynamic pricing based on occupancy patterns",
        "Develop capacity management systems for peak periods",
        "Expand hotel capacity in top regions: Addis Ababa, Oromia, Amhara",
        "Optimize pricing for peak day (Friday) and promote off-peak day (Tuesday)",
      ],
      action_items: [
        "Conduct quarterly service quality audits",
        "Implement guest feedback collection systems",
        "Analyze competitor pricing and service offerings",
      ],
    },
    marketing: {
      department: "marketing",
      alert_level: "normal" as const,
      key_metrics: [
        {
          name: "Top Source Market Share (Australia)",
          current_value: 17.8,
          trend: "stable" as const,
          confidence: 0.85,
          impact_level: "high" as const,
          recommendation: "Strengthen partnerships in Australia market",
        },
        {
          name: "Average Spending per Visitor",
          current_value: 1250,
          trend: "increasing" as const,
          confidence: 0.9,
          impact_level: "high" as const,
          recommendation:
            "Develop premium packages to increase average spending",
        },
        {
          name: "Overall Satisfaction Score",
          current_value: 4.3,
          trend: "stable" as const,
          confidence: 0.9,
          impact_level: "high" as const,
          recommendation: "Focus on experience improvement initiatives",
        },
      ],
      recommendations: [
        "Target Australia market (17.8% share) with localized campaigns",
        "Target Morocco market (15.2% share) with localized campaigns",
        "Focus on high-value Australian visitors (avg $1580)",
        "Promote Harar Old City in targeted campaigns (44.0% of visits)",
      ],
      action_items: [
        "Launch targeted campaigns for top nationality markets",
        "Develop premium experience packages for high-spending segments",
        "Create seasonal marketing calendar with targeted promotions",
      ],
    },
    tourism_funding: {
      department: "tourism_funding",
      alert_level: "positive" as const,
      key_metrics: [
        {
          name: "Total Tourism Revenue",
          current_value: 2890000,
          predicted_value: 3125000,
          trend: "increasing" as const,
          confidence: 0.85,
          impact_level: "high" as const,
          recommendation: "Focus investment on high-ROI segments and regions",
        },
        {
          name: "Revenue per Visitor",
          current_value: 578,
          trend: "increasing" as const,
          confidence: 0.8,
          impact_level: "high" as const,
          recommendation:
            "Increase average spending through premium experiences",
        },
      ],
      recommendations: [
        "Consider expanding investment in Addis Ababa (high efficiency)",
        "Develop investment prioritization framework based on ROI analysis",
        "Explore public-private partnership opportunities",
      ],
      action_items: [
        "Conduct detailed ROI analysis for each tourism sector",
        "Prepare investment reports for stakeholders",
        "Identify funding gaps and opportunities",
      ],
    },
  });

  const getMockForecasts = (forecastSummary?: any) => ({
    arrivals: {
      method: "statistical",
      forecast_values: Array.from({ length: 30 }, (_, i) =>
        Math.floor(16000 + Math.sin(i / 7) * 2000 + Math.random() * 1000)
      ),
      forecast_dates: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return date.toISOString().split("T")[0];
      }),
      total_predicted_arrivals: forecastSummary?.arrivals || 514714,
      average_daily_arrivals: 17157,
      note: "Forecast based on statistical analysis of visitor patterns",
    },
    revenue: {
      method: "enhanced_trend",
      forecast_values: Array.from({ length: 30 }, (_, i) =>
        Math.floor(95000 + Math.sin(i / 7) * 15000 + Math.random() * 5000)
      ),
      total_predicted_revenue: forecastSummary?.revenue || 2890000,
      daily_average_revenue: 96333,
      growth_rate_daily: 2.1,
    },
  });

  const getMockCrossDepartmentalInitiatives = () => [
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
  ];

  // Chart generation functions
  const getNationalityChartData = () => {
    const nationalities =
      report?.executive_summary?.dimensional_analysis?.nationalities
        ?.top_performers || [];
    return {
      labels: nationalities.map((n) => n.name),
      datasets: [
        {
          label: "Visitors by Nationality",
          data: nationalities.map((n) => n.value),
          backgroundColor: CHART_COLORS.slice(0, nationalities.length),
          borderWidth: 2,
        },
      ],
    };
  };

  const getDestinationChartData = () => {
    const destinations =
      report?.executive_summary?.dimensional_analysis?.destinations
        ?.top_performers || [];
    return {
      labels: destinations.map((d) => d.name),
      datasets: [
        {
          label: "Visitors by Destination",
          data: destinations.map((d) => d.percentage),
          backgroundColor: CHART_COLORS.slice(0, destinations.length),
          borderWidth: 2,
        },
      ],
    };
  };

  const getRegionalChartData = () => {
    const regions =
      report?.executive_summary?.dimensional_analysis?.regions
        ?.top_performers || [];
    return {
      labels: regions.map((r) => r.name),
      datasets: [
        {
          label: "Visitors by Region",
          data: regions.map((r) => r.value),
          backgroundColor: "#10B981",
          borderColor: "#059669",
          borderWidth: 2,
        },
      ],
    };
  };

  const getAgeGroupChartData = () => {
    const ageGroups =
      report?.executive_summary?.dimensional_analysis?.age_groups
        ?.top_performers || [];
    return {
      labels: ageGroups.map((a) => a.name),
      datasets: [
        {
          label: "Visitors by Age Group (%)",
          data: ageGroups.map((a) => a.percentage),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "#3B82F6",
          borderWidth: 2,
        },
      ],
    };
  };

  const getSectorChartData = () => {
    const sectors =
      report?.executive_summary?.dimensional_analysis?.sectors
        ?.top_performers || [];
    return {
      labels: sectors.map((s) => s.name),
      datasets: [
        {
          label: "Tourism Sector Performance",
          data: sectors.map((s) => s.value),
          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
          borderWidth: 2,
        },
      ],
    };
  };

  const getForecastChartData = () => {
    const arrivals = report?.forecasts?.arrivals;
    if (!arrivals) return null;

    return {
      labels: arrivals.forecast_dates?.slice(0, 14) || [],
      datasets: [
        {
          label: "Predicted Arrivals",
          data: arrivals.forecast_values?.slice(0, 14) || [],
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const getSpendingAnalysisData = () => {
    const packageTypes =
      report?.executive_summary?.dimensional_analysis?.package_types
        ?.top_performers || [];
    return {
      labels: packageTypes.map((p) => p.name),
      datasets: [
        {
          label: "Spending by Package Type",
          data: packageTypes.map((p) => p.percentage),
          backgroundColor: ["#F59E0B", "#10B981", "#EF4444", "#8B5CF6"],
          borderWidth: 2,
        },
      ],
    };
  };

  const getPerformanceIndicatorsData = () => {
    const indicators = report?.executive_summary?.performance_indicators;
    if (!indicators) return null;

    return {
      labels: ["Market Diversity", "Growth Rate", "Forecast Confidence"],
      datasets: [
        {
          label: "Performance Indicators",
          data: [
            indicators.market_diversity_index || 0,
            indicators.monthly_growth_rate || 0,
            (indicators.forecast_confidence || 0) * 100,
          ],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "#3B82F6",
          pointBackgroundColor: "#3B82F6",
          pointBorderColor: "#1D4ED8",
          pointHoverBackgroundColor: "#1D4ED8",
          pointHoverBorderColor: "#3B82F6",
        },
      ],
    };
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-700 bg-red-100";
      case "warning":
        return "text-yellow-700 bg-yellow-100";
      case "positive":
        return "text-green-700 bg-green-100";
      default:
        return "text-blue-700 bg-blue-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "📈";
      case "decreasing":
        return "📉";
      default:
        return "➖";
    }
  };

  const getAlertDistributionData = () => {
    if (!report?.executive_summary?.alert_distribution) return null;

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

  const getMetricsChartData = (department: string) => {
    const dept = report?.departmental_insights[department];
    if (!dept) return null;

    return {
      labels: dept.key_metrics.map((m: InsightMetric) => m.name),
      datasets: [
        {
          label: "Current Value",
          data: dept.key_metrics.map((m: InsightMetric) => m.current_value),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comprehensive analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">
              <h3 className="text-lg font-medium">Error Loading Dashboard</h3>
              <p className="mt-2 text-sm">{error}</p>
              <button
                onClick={fetchInsightsReport}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="text-yellow-800">
              <h3 className="text-lg font-medium">No Data Available</h3>
              <p className="mt-2 text-sm">Unable to load analytics report.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedDeptData =
    selectedDepartment !== "all"
      ? report.departmental_insights[selectedDepartment]
      : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Tourism Analytics Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Generated:{" "}
                {new Date(report.report_metadata.generated_at).toLocaleString()}
                | Data Period: {report.report_metadata.data_period}| Confidence:{" "}
                {(report.report_metadata.confidence_level * 100).toFixed(0)}%
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="mr-3 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <select
                value={selectedAnalytic}
                onChange={(e) => setSelectedAnalytic(e.target.value)}
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="overview">Overview</option>
                <option value="arrivals">Arrivals Analysis</option>
                <option value="occupancy">Occupancy & Revenue</option>
                <option value="demographics">Demographics</option>
                <option value="forecasts">Forecasts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-lg">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Predicted Arrivals
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {report.executive_summary.forecast_summary.arrivals?.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-lg">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Predicted Revenue
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      $
                      {report.executive_summary.forecast_summary.revenue?.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-lg">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Market Diversity
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {report.executive_summary.performance_indicators?.market_diversity_index?.toFixed(
                        2
                      )}
                      %
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-lg">📈</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Growth Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {report.executive_summary.performance_indicators?.monthly_growth_rate?.toFixed(
                        3
                      )}
                      %
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Content Based on Selection */}
        {selectedAnalytic === "overview" && (
          <>
            {/* High Impact Metrics */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  High Impact Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.executive_summary.high_impact_metrics.map(
                    (metric: any, idx: number) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              {
                                DEPARTMENT_NAMES[
                                  metric.department as keyof typeof DEPARTMENT_NAMES
                                ]
                              }
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {metric.metric}
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {typeof metric.value === "number" &&
                              metric.value > 1000
                                ? metric.value.toLocaleString()
                                : metric.value}
                            </p>
                          </div>
                          <div className="text-2xl">
                            {getTrendIcon(metric.trend)}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Alert Distribution and Performance Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
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
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Performance Indicators
                  </h3>
                  <div className="h-64">
                    {getPerformanceIndicatorsData() && (
                      <Radar
                        data={getPerformanceIndicatorsData()!}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedAnalytic === "arrivals" && (
          <>
            {/* Nationality and Destination Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Top Source Markets
                  </h3>
                  <div className="h-80">
                    <Bar
                      data={getNationalityChartData()}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Popular Destinations
                  </h3>
                  <div className="h-80">
                    <Pie
                      data={getDestinationChartData()}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Performance */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Regional Performance
                </h3>
                <div className="h-64">
                  <Bar
                    data={getRegionalChartData()}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {selectedAnalytic === "demographics" && (
          <>
            {/* Age Groups and Sectors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Age Group Distribution
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={getAgeGroupChartData()}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Tourism Sectors
                  </h3>
                  <div className="h-64">
                    <Doughnut
                      data={getSectorChartData()}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Analysis */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Spending by Package Type
                </h3>
                <div className="h-64">
                  <Pie
                    data={getSpendingAnalysisData()}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {selectedAnalytic === "forecasts" && (
          <>
            {/* Forecast Charts */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Arrivals Forecast (Next 14 Days)
                </h3>
                <div className="h-64">
                  {getForecastChartData() && (
                    <Line
                      data={getForecastChartData()!}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Department Selector */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedDepartment("all")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedDepartment === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Departments
              </button>
              {Object.entries(DEPARTMENT_NAMES).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDepartment(key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedDepartment === key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Department Insights */}
        {selectedDepartment === "all" ? (
          <div className="space-y-6">
            {Object.entries(report.departmental_insights).map(
              ([deptKey, dept]) => (
                <div key={deptKey} className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {
                          DEPARTMENT_NAMES[
                            deptKey as keyof typeof DEPARTMENT_NAMES
                          ]
                        }
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAlertLevelColor(
                          dept.alert_level
                        )}`}
                      >
                        {dept.alert_level}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Key Metrics
                        </h4>
                        <div className="space-y-3">
                          {dept.key_metrics
                            .slice(0, 3)
                            .map((metric: InsightMetric, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {metric.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Impact: {metric.impact_level} | Confidence:{" "}
                                    {(metric.confidence * 100).toFixed(0)}%
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-gray-900">
                                    {typeof metric.current_value === "number" &&
                                    metric.current_value > 1000
                                      ? metric.current_value.toLocaleString()
                                      : metric.current_value.toFixed(1)}
                                  </p>
                                  <span className="text-sm">
                                    {getTrendIcon(metric.trend)}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Department Chart
                        </h4>
                        <div className="h-48">
                          {getMetricsChartData(deptKey) && (
                            <Bar
                              data={getMetricsChartData(deptKey)!}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Top Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {dept.recommendations
                          .slice(0, 3)
                          .map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></span>
                              <span className="text-sm text-gray-700">
                                {rec}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          selectedDeptData && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {
                      DEPARTMENT_NAMES[
                        selectedDepartment as keyof typeof DEPARTMENT_NAMES
                      ]
                    }{" "}
                    - Detailed Analysis
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAlertLevelColor(
                      selectedDeptData.alert_level
                    )}`}
                  >
                    {selectedDeptData.alert_level}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Key Metrics
                    </h4>
                    <div className="space-y-4">
                      {selectedDeptData.key_metrics.map(
                        (metric: InsightMetric, idx: number) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-gray-900">
                                {metric.name}
                              </h5>
                              <span className="text-lg">
                                {getTrendIcon(metric.trend)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl font-bold text-blue-600">
                                {typeof metric.current_value === "number" &&
                                metric.current_value > 1000
                                  ? metric.current_value.toLocaleString()
                                  : metric.current_value.toFixed(1)}
                              </span>
                              {metric.predicted_value && (
                                <span className="text-sm text-gray-500">
                                  Predicted: {metric.predicted_value.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              Impact: {metric.impact_level} | Confidence:{" "}
                              {(metric.confidence * 100).toFixed(0)}%
                            </div>
                            <p className="text-sm text-gray-700">
                              {metric.recommendation}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Metrics Visualization
                    </h4>
                    <div className="h-64 mb-6">
                      {getMetricsChartData(selectedDepartment) && (
                        <Bar
                          data={getMetricsChartData(selectedDepartment)!}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Recommendations
                    </h4>
                    <ul className="space-y-3">
                      {selectedDeptData.recommendations.map(
                        (rec: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 mt-2 mr-3"></span>
                            <span className="text-sm text-gray-700">{rec}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Action Items
                    </h4>
                    <ul className="space-y-3">
                      {selectedDeptData.action_items.map(
                        (action: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="flex-shrink-0 h-2 w-2 rounded-full bg-orange-500 mt-2 mr-3"></span>
                            <span className="text-sm text-gray-700">
                              {action}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Key Opportunities */}
        <div className="bg-white shadow rounded-lg mt-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Key Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.executive_summary.key_opportunities.map(
                (opportunity: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3">
                        💡
                      </span>
                      <p className="text-sm text-blue-800">{opportunity}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Cross-Departmental Initiatives */}
        <div className="bg-white shadow rounded-lg mt-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Cross-Departmental Initiatives
            </h3>
            <div className="space-y-4">
              {report.cross_departmental_initiatives.map((initiative, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {initiative.title}
                    </h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        initiative.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {initiative.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {initiative.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Departments:{" "}
                      {initiative.departments
                        .map(
                          (d) =>
                            DEPARTMENT_NAMES[d as keyof typeof DEPARTMENT_NAMES]
                        )
                        .join(", ")}
                    </span>
                    <span>Timeline: {initiative.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
