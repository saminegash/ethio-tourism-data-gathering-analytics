"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResults(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Upload Tourism Data
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="csvFile"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select CSV File
            </label>
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 dark:hover:file:bg-blue-900/50 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Processing..." : "Upload and Analyze"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {results && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Analysis Results
          </h2>

          {results.metadata && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">
                Analysis Summary
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Records Processed:</strong>{" "}
                {results.metadata.records_processed}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Analysis Type:</strong> {results.metadata.analysis_type}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Timestamp:</strong>{" "}
                {new Date(results.metadata.timestamp).toLocaleString()}
              </p>
            </div>
          )}

          {results.insights && results.insights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                Key Insights
              </h3>
              <ul className="space-y-2">
                {results.insights.map((insight: string, index: number) => (
                  <li
                    key={index}
                    className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-300"
                  >
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Raw Analysis Data
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto text-sm text-gray-800 dark:text-gray-200">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="/dashboard/arrivals"
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              View Arrivals Dashboard
            </a>
            <a
              href="/dashboard/occupancy"
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              View Occupancy Dashboard
            </a>
            <a
              href="/dashboard/surveys"
              className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              View Surveys Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
