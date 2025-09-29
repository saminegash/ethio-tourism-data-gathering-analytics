'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation, formatCurrency, Language } from '@/lib/translations';
import { mockDestinations } from '@/lib/mock-data/tourism-data';

interface DestinationDetailProps {
  params: {
    id: string;
  };
}

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('en');
  const { t } = useTranslation(language);
  
  const destination = mockDestinations.find(d => d.id === params.id);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const name = language === 'am' ? destination.nameAm : 
               language === 'or' ? destination.nameOr : 
               destination.name;
  
  const description = language === 'am' ? destination.descriptionAm : 
                     language === 'or' ? destination.descriptionOr : 
                     destination.description;

  const occupancyPercentage = Math.round((destination.currentOccupancy / destination.maxCapacity) * 100);

  // Generate some additional mock data for detailed view
  const mockWeather = { temp: 24, condition: 'Sunny', humidity: 65 };
  const mockNearbyRestaurants = [
    { name: 'Traditional Ethiopian Cuisine', nameAm: 'ባህላዊ የኢትዮጵያ ምግብ', nameOr: 'Nyaata Aadaa Itoophiyaa', distance: 0.5, rating: 4.6 },
    { name: 'Coffee House', nameAm: 'ቡና ቤት', nameOr: 'Mana Buna', distance: 0.8, rating: 4.3 },
    { name: 'Local Market Eatery', nameAm: 'የአካባቢ ገበያ ምግብ ቤት', nameOr: 'Mana Nyaataa Gabaa Naannoo', distance: 1.2, rating: 4.4 }
  ];
  
  const mockReviews = [
    { author: 'John D.', rating: 5, comment: 'Absolutely breathtaking! A must-visit destination in Ethiopia.', date: '2024-12-25' },
    { author: 'Sarah M.', rating: 4, comment: 'Beautiful place with rich history. The guided tour was very informative.', date: '2024-12-24' },
    { author: 'Ahmed H.', rating: 5, comment: 'Amazing experience! The local guides were knowledgeable and friendly.', date: '2024-12-23' }
  ];

  const mockItinerary = [
    { time: '09:00', activity: 'Arrival and ticket purchase', activityAm: 'መድረስ እና ቲኬት ግዢ', activityOr: 'Ga\'uu fi bittaa tiikeetii' },
    { time: '09:30', activity: 'Guided tour begins', activityAm: 'የመመሪያ ጉብኝት ይጀመራል', activityOr: 'Daawwannaan qajeelchaa jalqaba' },
    { time: '11:00', activity: 'Photography and exploration', activityAm: 'ፎቶግራፍ እና ዳሰሳ', activityOr: 'Suuraa fi qorannoo' },
    { time: '12:30', activity: 'Traditional lunch break', activityAm: 'ባህላዊ የምሳ እረፍት', activityOr: 'Boqonnaa nyaata gidduugaleessaa aadaa' },
    { time: '14:00', activity: 'Cultural demonstrations', activityAm: 'ባህላዊ ማሳያዎች', activityOr: 'Agarsiisa aadaa' },
    { time: '15:30', activity: 'Souvenir shopping', activityAm: 'የመታሰቢያ ዕቃዎች ግዢ', activityOr: 'Bittaa miʼa yaadachiisaa' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                ← {t.forms.back}
              </button>
              <div className="text-2xl">🇪🇹</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {destination.location}
                </p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex gap-2">
              {['en', 'am', 'or'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as Language)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {lang === 'en' ? '🇺🇸 English' : 
                   lang === 'am' ? '🇪🇹 አማርኛ' : 
                   '🇪🇹 Afaan Oromoo'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative text-center text-white z-10">
          <span className="text-9xl mb-4 block">🏛️</span>
          <h2 className="text-4xl font-bold mb-2">{name}</h2>
          <p className="text-xl opacity-90">{destination.category}</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center">
              <span className="text-yellow-400">{'★'.repeat(Math.floor(destination.avgRating))}</span>
              <span className="ml-2">{destination.avgRating}/5.0</span>
            </div>
            <div className="text-sm opacity-80">
              {destination.totalVisitsToday} {t.dashboard.visitors} today
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <h3 className="text-xl font-bold mb-4">{t.analytics.overview}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(destination.entryFee, language)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.destinations.entryFee}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(destination.estimatedDuration / 60)}h {destination.estimatedDuration % 60}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.destinations.estimatedDuration}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {occupancyPercentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.destinations.currentOccupancy}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(destination.revenue, language)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Today's {t.dashboard.revenue}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <h3 className="text-xl font-bold mb-4">About {name}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <h3 className="text-xl font-bold mb-4">{t.destinations.amenities}</h3>
              <div className="flex flex-wrap gap-2">
                {destination.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Itinerary */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <h3 className="text-xl font-bold mb-4">Suggested Itinerary</h3>
              <div className="space-y-4">
                {mockItinerary.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold min-w-[60px] text-center">
                      {item.time}
                    </div>
                    <div>
                      <p className="font-medium">
                        {language === 'am' ? item.activityAm : 
                         language === 'or' ? item.activityOr : 
                         item.activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <h3 className="text-xl font-bold mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {mockReviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{review.author}</div>
                        <div className="flex items-center">
                          <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Live Status */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <h3 className="text-lg font-bold mb-4">Live Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Occupancy</span>
                    <span className="font-semibold">{destination.currentOccupancy}/{destination.maxCapacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        occupancyPercentage > 80 ? 'bg-red-500' : 
                        occupancyPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {occupancyPercentage > 80 ? 'Very Busy' : 
                     occupancyPercentage > 60 ? 'Moderately Busy' : 'Available'}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weather</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">☀️</span>
                    <div>
                      <div className="font-semibold">{mockWeather.temp}°C</div>
                      <div className="text-xs">{mockWeather.condition}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Restaurants */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <h3 className="text-lg font-bold mb-4">Nearby Restaurants</h3>
              <div className="space-y-3">
                {mockNearbyRestaurants.map((restaurant, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">
                        {language === 'am' ? restaurant.nameAm : 
                         language === 'or' ? restaurant.nameOr : 
                         restaurant.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {restaurant.distance}km • ★{restaurant.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold">
                  🎫 {t.destinations.bookTicket}
                </button>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold">
                  🧭 {t.destinations.getDirections}
                </button>
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-semibold">
                  📱 Add to Itinerary
                </button>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-gray-100">
              <h3 className="text-lg font-bold mb-4">Share This Destination</h3>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600">
                  📘 Facebook
                </button>
                <button className="flex-1 bg-blue-400 text-white py-2 px-3 rounded text-sm hover:bg-blue-500">
                  🐦 Twitter
                </button>
                <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600">
                  📱 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
