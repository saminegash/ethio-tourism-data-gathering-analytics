"use client";

import { useState } from "react";

// Simple SVG icons
const XIcon = ({ className }: { className?: string }) => (
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
      d="M6 18L18 6M6 6l12 12"
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

const CheckCircleIcon = ({ className }: { className?: string }) => (
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
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface Tourist {
  id: string;
  passport_number?: string;
  national_id?: string;
  document_type: string;
  full_name: string;
  nationality: string;
  phone_number?: string;
  email?: string;
  purpose_of_visit: string;
  intended_stay_duration: number;
  group_size: number;
  registration_source: string;
  registration_location?: string;
  verification_status: string;
  is_active: boolean;
  data_collection_consent: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

interface Props {
  tourist: Tourist | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TouristDetailModal({ tourist, isOpen, onClose }: Props) {
  if (!isOpen || !tourist) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "expired":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case "leisure":
        return "text-blue-600 bg-blue-100";
      case "business":
        return "text-purple-600 bg-purple-100";
      case "cultural":
        return "text-orange-600 bg-orange-100";
      case "adventure":
        return "text-green-600 bg-green-100";
      case "religious":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tourist Details
                </h3>
                <p className="text-sm text-gray-500">ID: {tourist.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-sm text-gray-900">{tourist.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Nationality
                  </label>
                  <p className="text-sm text-gray-900">{tourist.nationality}</p>
                </div>
                {tourist.passport_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Passport Number
                    </label>
                    <p className="text-sm text-gray-900">
                      {tourist.passport_number}
                    </p>
                  </div>
                )}
                {tourist.national_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      National ID
                    </label>
                    <p className="text-sm text-gray-900">
                      {tourist.national_id}
                    </p>
                  </div>
                )}
                {tourist.phone_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <p className="text-sm text-gray-900">
                      {tourist.phone_number}
                    </p>
                  </div>
                )}
                {tourist.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">{tourist.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Travel Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Purpose of Visit
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPurposeColor(
                      tourist.purpose_of_visit
                    )}`}
                  >
                    {tourist.purpose_of_visit}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Group Size
                  </label>
                  <p className="text-sm text-gray-900">
                    {tourist.group_size}{" "}
                    {tourist.group_size === 1 ? "person" : "people"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Intended Stay
                  </label>
                  <p className="text-sm text-gray-900">
                    {tourist.intended_stay_duration} days
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Registration Source
                  </label>
                  <p className="text-sm text-gray-900 capitalize">
                    {tourist.registration_source.replace("_", " ")}
                  </p>
                </div>
                {tourist.registration_location && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      Registration Location
                    </label>
                    <p className="text-sm text-gray-900">
                      {tourist.registration_location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Dates */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Status & Dates</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Verification Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      tourist.verification_status
                    )}`}
                  >
                    {tourist.verification_status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Active Status
                  </label>
                  <div className="flex items-center space-x-1">
                    {tourist.is_active ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">Active</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Inactive</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Registered
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(tourist.created_at)}
                  </p>
                </div>
                {tourist.expires_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Expires
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(tourist.expires_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Consent Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Privacy & Consent
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {tourist.data_collection_consent ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        Consented to external data collection
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No consent for external data collection
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
