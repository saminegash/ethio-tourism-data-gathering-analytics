"use client";

import { useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

export function ThemeDemo() {
  const [activeTab, setActiveTab] = useState("colors");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-foreground">
          Ethiopian Tourism Theme Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Explore the Ethiopian flag-inspired color palette and design system
        </p>
        <div className="flex justify-center">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-surface-secondary rounded-lg p-1">
        {["colors", "components", "gradients"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md transition-all capitalize ${
              activeTab === tab
                ? "bg-surface-primary text-primary-600 shadow-soft"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Colors Tab */}
      {activeTab === "colors" && (
        <div className="space-y-8">
          {/* Ethiopian Flag Colors */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Ethiopian Flag Colors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Green */}
              <div className="card p-6">
                <h3 className="font-semibold mb-4 text-foreground">
                  Primary (Green)
                </h3>
                <div className="space-y-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (shade) => (
                      <div
                        key={shade}
                        className={`h-8 rounded flex items-center px-3 text-sm font-medium bg-primary-${shade} ${
                          shade >= 500 ? "text-white" : "text-gray-900"
                        }`}
                      >
                        primary-{shade}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Yellow */}
              <div className="card p-6">
                <h3 className="font-semibold mb-4 text-foreground">
                  Secondary (Yellow)
                </h3>
                <div className="space-y-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (shade) => (
                      <div
                        key={shade}
                        className={`h-8 rounded flex items-center px-3 text-sm font-medium bg-secondary-${shade} ${
                          shade >= 500 ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        secondary-{shade}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Red */}
              <div className="card p-6">
                <h3 className="font-semibold mb-4 text-foreground">
                  Accent (Red)
                </h3>
                <div className="space-y-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (shade) => (
                      <div
                        key={shade}
                        className={`h-8 rounded flex items-center px-3 text-sm font-medium bg-accent-${shade} ${
                          shade >= 500 ? "text-white" : "text-gray-900"
                        }`}
                      >
                        accent-{shade}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Surface Colors */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Surface Colors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-primary border border-border-primary rounded-lg p-6">
                <h3 className="font-semibold text-foreground">
                  Surface Primary
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Main background color
                </p>
              </div>
              <div className="bg-surface-secondary border border-border-primary rounded-lg p-6">
                <h3 className="font-semibold text-foreground">
                  Surface Secondary
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Secondary background
                </p>
              </div>
              <div className="bg-surface-tertiary border border-border-primary rounded-lg p-6">
                <h3 className="font-semibold text-foreground">
                  Surface Tertiary
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Tertiary background
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Components Tab */}
      {activeTab === "components" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Component Examples
            </h2>

            {/* Buttons */}
            <div className="card p-6 mb-6">
              <h3 className="font-semibold mb-4 text-foreground">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
                <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg transition-all">
                  Accent Button
                </button>
                <button className="bg-surface-primary hover:bg-surface-secondary border border-border-primary text-foreground px-6 py-3 rounded-lg transition-all">
                  Outline Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2 text-foreground">
                  Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Comprehensive tourism analytics and insights
                </p>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl flex items-center justify-center mb-4">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Reports</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Generate detailed tourism reports
                </p>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-xl flex items-center justify-center mb-4">
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Reviews</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Customer satisfaction and feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gradients Tab */}
      {activeTab === "gradients" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Ethiopian Gradients
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-ethiopia-gradient rounded-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Ethiopia Flag Gradient
                </h3>
                <p className="opacity-90">Green → Yellow → Red</p>
                <code className="text-sm opacity-75">bg-ethiopia-gradient</code>
              </div>

              <div className="bg-ethiopia-subtle rounded-xl p-8 border border-border-primary">
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  Subtle Gradient
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Light version for backgrounds
                </p>
                <code className="text-sm text-gray-500">
                  bg-ethiopia-subtle
                </code>
              </div>

              <div className="bg-ethiopia-dark rounded-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">Dark Gradient</h3>
                <p className="opacity-90">Dark version for night mode</p>
                <code className="text-sm opacity-75">bg-ethiopia-dark</code>
              </div>

              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">Custom Gradient</h3>
                <p className="opacity-90">Primary to Secondary</p>
                <code className="text-sm opacity-75">
                  from-primary-500 to-secondary-500
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
