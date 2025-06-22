import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="px-6 py-20 text-center bg-ethiopia-subtle rounded-3xl mx-6 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-ethiopia-gradient opacity-5"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="text-lg">🇪🇹</span>
            <span>Ethiopia Tourism Analytics</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Ethiopia Tourism Analytics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Comprehensive data analytics platform for tourism insights in
            Ethiopia. Upload CSV data and get real-time analytics on arrivals,
            occupancy, visits, and customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="btn-primary animate-fadeIn hover:shadow-glow"
            >
              Upload Data
            </Link>
            <Link
              href="/dashboard/arrivals"
              className="bg-surface-primary text-black hover:bg-black dark:bg-surface-tertiary dark:hover:bg-gray-700 text-foreground border border-border-primary px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-soft"
            >
              View Dashboards
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Analytics Dashboards
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore comprehensive tourism data through our interactive
            dashboards designed specifically for Ethiopian tourism insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Arrivals Card */}
          <Link href="/dashboard/arrivals" className="group animate-fadeIn">
            <div className="card p-6 group-hover:border-primary-200 dark:group-hover:border-primary-800">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                <svg
                  className="w-6 h-6 text-primary-600 dark:text-primary-400"
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
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Flight Arrivals
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track flight arrivals, passenger volumes, airline performance,
                and origin patterns.
              </p>
            </div>
          </Link>

          {/* Occupancy Card */}
          <Link
            href="/dashboard/occupancy"
            className="group animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="card p-6 group-hover:border-secondary-200 dark:group-hover:border-secondary-800">
              <div className="w-12 h-12 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary-100 dark:group-hover:bg-secondary-900/40 transition-colors">
                <svg
                  className="w-6 h-6 text-secondary-600 dark:text-secondary-400"
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
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Hotel Occupancy
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor hotel occupancy rates, regional performance, and revenue
                trends.
              </p>
            </div>
          </Link>

          {/* Visits Card */}
          <Link
            href="/dashboard/visits"
            className="group animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="card p-6 group-hover:border-accent-200 dark:group-hover:border-accent-800">
              <div className="w-12 h-12 bg-accent-50 dark:bg-accent-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-100 dark:group-hover:bg-accent-900/40 transition-colors">
                <svg
                  className="w-6 h-6 text-accent-600 dark:text-accent-400"
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
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Tourist Visits
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Analyze attraction visits, dwell times, and visitor
                demographics.
              </p>
            </div>
          </Link>

          {/* Surveys Card */}
          <Link
            href="/dashboard/surveys"
            className="group animate-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="card p-6 group-hover:border-orange-200 dark:group-hover:border-orange-800">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
                <svg
                  className="w-6 h-6 text-orange-600 dark:text-orange-400"
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
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Customer Surveys
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track customer satisfaction, ratings, and sentiment analysis.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Features List */}
      <div className="px-6 py-20 bg-surface-primary border-t border-border-primary">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Platform Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built with modern technology and Ethiopian tourism industry
              insights to provide comprehensive analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4 animate-slideIn">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary-600 dark:text-primary-400"
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
                <h3 className="font-semibold mb-2 text-foreground">
                  CSV Data Upload
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Easy drag-and-drop CSV file upload with automatic data
                  processing and validation.
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-4 animate-slideIn"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-10 h-10 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-secondary-600 dark:text-secondary-400"
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
              <div>
                <h3 className="font-semibold mb-2 text-foreground">
                  Real-time Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Instant data processing with Python analytics engine for
                  immediate insights.
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-4 animate-slideIn"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-10 h-10 bg-accent-50 dark:bg-accent-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-accent-600 dark:text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">
                  Interactive Dashboards
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Beautiful, responsive charts using Chart.js with Ethiopian
                  color themes.
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-4 animate-slideIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">
                  AI-Powered Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Automated insights generation with trend detection for
                  Ethiopian tourism patterns.
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-4 animate-slideIn"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">
                  Light & Dark Themes
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ethiopian flag-inspired color palette with automatic system
                  theme detection.
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-4 animate-slideIn"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">
                  Secure & Scalable
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built with Supabase for secure data storage and real-time
                  collaboration features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
