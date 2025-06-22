import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeSwitcher } from "../components/theme-switcher";
import { ReduxProvider } from "../components/providers/ReduxProvider";
import { AuthProvider } from "../components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ethiopia Tourism Analytics",
  description: "Tourism data analytics and insights for Ethiopia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}
      >
        <ReduxProvider>
          <AuthProvider>
            <ThemeProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                  <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-16">
                      <div className="flex items-center space-x-8">
                        <Link
                          href="/"
                          className="text-xl font-bold text-gray-900 dark:text-white"
                        >
                          🇪🇹 Ethiopia Tourism
                        </Link>

                        <div className="hidden md:flex space-x-6">
                          <Link
                            href="/upload"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            Upload Data
                          </Link>
                          <Link
                            href="/dashboard/arrivals"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            Arrivals
                          </Link>
                          <Link
                            href="/dashboard/occupancy"
                            className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          >
                            Occupancy
                          </Link>
                          <Link
                            href="/dashboard/visits"
                            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            Visits
                          </Link>
                          <Link
                            href="/dashboard/surveys"
                            className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                          >
                            Surveys
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <ThemeSwitcher />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Tourism Analytics Platform
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>

                <main className="bg-gray-50 dark:bg-gray-900">{children}</main>
              </div>
            </ThemeProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
