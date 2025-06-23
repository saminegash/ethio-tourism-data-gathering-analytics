"use client";

import { useState } from "react";
import { TouristRegistration } from "../../components/tourist/TouristRegistration";

// Simple SVG icons
const UserPlusIcon = ({ className }: { className?: string }) => (
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
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
);

export default function RegisterPage() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registeredTourist, setRegisteredTourist] = useState<any>(null);

  const handleRegistrationComplete = (tourist: any) => {
    setRegisteredTourist(tourist);
    setShowRegistration(false);
  };

  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Tourist Registration System
        </h1>
        <p className="text-xl text-gray-600">
          Welcome to Ethiopia Tourism Platform
        </p>
      </div>

      {/* Registration Success Message */}
      {registeredTourist && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
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
            <div>
              <h3 className="font-semibold text-green-800 mb-2">
                Registration Successful!
              </h3>
              <p className="text-sm text-green-700">
                <strong>{registeredTourist.full_name}</strong> from{" "}
                <strong>{registeredTourist.nationality}</strong> has been
                successfully registered.
              </p>
              <p className="text-xs text-green-600 mt-1">
                Tourist ID: {registeredTourist.id}
              </p>
              <p className="text-xs text-green-600">
                Verified: {registeredTourist.verification_status}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
        {/* Tourist Registration */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <UserPlusIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Register Tourist
            </h2>
            <p className="text-gray-600 mb-6">
              Quick registration for tourists visiting Ethiopian destinations.
              Complete registration in under 1 minute using passport or national
              ID with optional external data integration.
            </p>
            <button
              onClick={() => setShowRegistration(true)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Registration
            </button>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-12 bg-gray-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Registration Features
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Quick Registration
            </h4>
            <p className="text-sm text-gray-600">
              Complete tourist registration in under 1 minute with document
              scanning or manual entry
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Privacy Focused
            </h4>
            <p className="text-sm text-gray-600">
              Consent-based data collection with full transparency and user
              control over external integrations
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              External Integration
            </h4>
            <p className="text-sm text-gray-600">
              Optional integration with Immigration office and Fayda platform
              for streamlined data collection
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegistration = () => (
    <div>
      <TouristRegistration
        onRegistrationComplete={handleRegistrationComplete}
        onCancel={() => setShowRegistration(false)}
        destinationId="wonchi-crater-lake"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {!showRegistration && renderWelcome()}
        {showRegistration && renderRegistration()}
      </div>
    </div>
  );
}
