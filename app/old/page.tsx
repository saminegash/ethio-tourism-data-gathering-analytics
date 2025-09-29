import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="px-6 py-20 text-center bg-white rounded-xl shadow-lg mx-6 mt-8">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="text-lg">🇪🇹</span>
            <span>Ethiopia Tourism Analytics</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Ethiopia Tourism Analytics
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Comprehensive data analytics platform for tourism insights in
            Ethiopia. Upload CSV data and get real-time analytics on arrivals,
            occupancy, visits, and customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              🚀 Launch Platform
            </Link>
            <Link
              href="/dashboard/insights"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              📊 View Dashboards
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Analytics Dashboards
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive tourism data through our interactive
              dashboards designed specifically for Ethiopian tourism insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Arrivals Card */}
            <Link href="/dashboard/arrivals" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Flight Arrivals
                </h3>
                <p className="text-gray-600">
                  Track flight arrivals, passenger volumes, airline performance,
                  and origin patterns.
                </p>
              </div>
            </Link>

            {/* Occupancy Card */}
            <Link href="/dashboard/occupancy" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Hotel Occupancy
                </h3>
                <p className="text-gray-600">
                  Monitor hotel occupancy rates, regional performance, and
                  revenue trends.
                </p>
              </div>
            </Link>

            {/* Visits Card */}
            <Link href="/dashboard/visits" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-600"
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Tourist Visits
                </h3>
                <p className="text-gray-600">
                  Analyze attraction visits, dwell times, and visitor
                  demographics.
                </p>
              </div>
            </Link>

            {/* Surveys Card */}
            <Link href="/dashboard/surveys" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-orange-600"
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Customer Surveys
                </h3>
                <p className="text-gray-600">
                  Track customer satisfaction, ratings, and sentiment analysis.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Features List */}
        <div className="px-6 py-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Platform Features
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Built with modern analytics and forecasting tools to drive
                data-led decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* CSV Data Upload */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    CSV Data Upload
                  </h3>
                  <p className="text-gray-600">
                    Drag-and-drop CSV files with automatic schema validation and
                    preprocessing.
                  </p>
                </div>
              </div>

              {/* Real-time Analytics */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m16 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    Real-time Processing
                  </h3>
                  <p className="text-gray-600">
                    In-memory analytics engine for instant KPI updates as data
                    streams in.
                  </p>
                </div>
              </div>

              {/* Interactive Dashboards */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3v18h18M3 9h18M9 3v18"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    Interactive Dashboards
                  </h3>
                  <p className="text-gray-600">
                    Responsive charts & maps with Chart.js, customizable per
                    user role.
                  </p>
                </div>
              </div>

              {/* Forecasting Engine */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-4-4m0 0l4-4m-4 4h12"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    Forecasting Engine
                  </h3>
                  <p className="text-gray-600">
                    Time-series models for visitor, revenue, and occupancy
                    projections.
                  </p>
                </div>
              </div>

              {/* Custom Report Builder */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5v14h14V5H5zm4 4h6v6H9V9z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    Custom Report Builder
                  </h3>
                  <p className="text-gray-600">
                    Design, schedule, and export branded reports in PDF or CSV
                    formats.
                  </p>
                </div>
              </div>

              {/* Admin & Access Control */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 10-8 0v4m8 0H8"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    Admin & Access Control
                  </h3>
                  <p className="text-gray-600">
                    Role-based permissions, audit logs, and user management UI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
