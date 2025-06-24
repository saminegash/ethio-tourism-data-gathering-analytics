"use client";

import { useState } from "react";

// Simple SVG icons
const QrCodeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M4 12h2.01M8 16h.01M8 8h.01M8 4h.01M12 8h.01M16 8h.01M16 4h.01M4 8h2.01M4 4h.01"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

interface RegistrationData {
  passport_number?: string;
  national_id?: string;
  document_type: "passport" | "national_id" | "both";
  full_name: string;
  nationality: string;
  phone_number?: string;
  email?: string;
  purpose_of_visit:
    | "leisure"
    | "business"
    | "cultural"
    | "adventure"
    | "religious"
    | "other";
  intended_stay_duration: number;
  group_size: number;
  data_collection_consent: boolean;
}

interface Props {
  onRegistrationComplete?: (tourist: any) => void;
  onCancel?: () => void;
  destinationId?: string;
}

export function TouristRegistration({
  onRegistrationComplete,
  onCancel,
  destinationId,
}: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    document_type: "passport",
    full_name: "",
    nationality: "",
    purpose_of_visit: "leisure",
    intended_stay_duration: 1,
    group_size: 1,
    data_collection_consent: true,
  });

  const [isScanning, setIsScanning] = useState(false);

  const handleInputChange = (field: keyof RegistrationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const simulateDocumentScan = async () => {
    setIsScanning(true);
    setError(null);

    // Simulate QR/barcode scanning delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock scanned data
    const mockData = {
      passport_number: "ET1234567",
      full_name: "John Doe",
      nationality: "US",
      date_of_birth: "1990-01-01",
    };

    setFormData((prev) => ({
      ...prev,
      ...mockData,
      document_type: "passport" as const,
    }));

    setIsScanning(false);
    setStep(2);
  };

  const handleManualEntry = () => {
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tourists/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          registration_source: "on_site",
          registration_location: destinationId
            ? `Destination: ${destinationId}`
            : "Tourist Office",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      if (onRegistrationComplete) {
        onRegistrationComplete(result.tourist);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tourist Registration
        </h2>
        <p className="text-gray-600">Quick registration in under 1 minute</p>
      </div>

      <div className="space-y-4">
        {/* Scan Option */}
        <button
          onClick={simulateDocumentScan}
          disabled={isScanning}
          className="w-full p-6 border-2 border-dashed border-primary-300 rounded-xl hover:border-primary-400 transition-colors group"
        >
          <div className="flex flex-col items-center space-y-3">
            <QrCodeIcon className="w-12 h-12 text-primary-600" />
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">
                {isScanning ? "Scanning..." : "Scan Passport/ID"}
              </h3>
              <p className="text-sm text-gray-600">
                {isScanning
                  ? "Reading document data..."
                  : "Place your passport or national ID under the scanner"}
              </p>
            </div>
            {isScanning && (
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            )}
          </div>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Manual Entry Option */}
        <button
          onClick={handleManualEntry}
          className="w-full p-6 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
        >
          <div className="flex flex-col items-center space-y-3">
            <UserIcon className="w-12 h-12 text-gray-600" />
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">Manual Entry</h3>
              <p className="text-sm text-gray-600">Type information manually</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Please verify and complete your information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          <select
            value={formData.document_type}
            onChange={(e) => handleInputChange("document_type", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="passport">Passport</option>
            <option value="passport">National ID</option>
          </select>
        </div>

        {/* Passport Number */}
        {(formData.document_type === "passport" ||
          formData.document_type === "both") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Number *
            </label>
            <input
              type="text"
              value={formData.passport_number || ""}
              onChange={(e) =>
                handleInputChange("passport_number", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
              placeholder="ET1234567"
            />
          </div>
        )}

        {/* National ID */}
        {(formData.document_type === "national_id" ||
          formData.document_type === "both") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              National ID *
            </label>
            <input
              type="text"
              value={formData.national_id || ""}
              onChange={(e) => handleInputChange("national_id", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
              placeholder="123456789"
            />
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="John Doe"
          />
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality *
          </label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => handleInputChange("nationality", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="United States"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone_number || ""}
            onChange={(e) => handleInputChange("phone_number", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="+1234567890"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="john@example.com"
          />
        </div>

        {/* Purpose of Visit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose of Visit
          </label>
          <select
            value={formData.purpose_of_visit}
            onChange={(e) =>
              handleInputChange("purpose_of_visit", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="leisure">Leisure</option>
            <option value="business">Business</option>
            <option value="cultural">Cultural</option>
            <option value="adventure">Adventure</option>
            <option value="religious">Religious</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Stay Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stay Duration (days)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={formData.intended_stay_duration}
            onChange={(e) =>
              handleInputChange(
                "intended_stay_duration",
                parseInt(e.target.value)
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Group Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Size
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={formData.group_size}
            onChange={(e) =>
              handleInputChange("group_size", parseInt(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Consent Checkboxes */}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !formData.full_name || !formData.nationality}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Registering..." : "Complete Registration"}
        </button>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel Registration
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
}
