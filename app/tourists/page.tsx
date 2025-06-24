"use client";

import { TouristList } from "../../components/tourist/TouristList";

export default function TouristsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tourist Management
          </h1>
          <p className="text-gray-600">
            View and manage all registered tourists in the system
          </p>
        </div>

        <TouristList />
      </div>
    </div>
  );
}
