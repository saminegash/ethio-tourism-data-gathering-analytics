'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation, formatCurrency, Language } from '@/lib/translations';
import { 
  mockTourists, 
  mockDestinations, 
  mockTransactions, 
  mockRecommendations,
  mockAnalytics 
} from '@/lib/mock-data/tourism-data';

// Dynamically import heavy components
const WristbandDemo = dynamic(() => import('@/components/demo/WristbandDemo'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
});

const TouristRegistration = dynamic(() => import('@/components/showcase/TouristRegistration'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
});

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

function DashboardCard({ title, value, subtitle, color, trend, trendValue }: DashboardCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-blue-300',
    green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-slate-800 text-green-900 dark:text-green-300',
    purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-slate-800 text-purple-900 dark:text-purple-300',
    orange: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-slate-800 text-orange-900 dark:text-orange-300',
    red: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-slate-800 text-red-900 dark:text-red-300'
  };

  const trendIcons = {
    up: '📈',
    down: '📉',
    stable: '➡️'
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
        </div>
        {trend && trendValue && (
          <div className="text-right">
            <span className="text-2xl">{trendIcons[trend]}</span>
            <p className="text-sm font-semibold">{trendValue}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DestinationCardProps {
  destination: typeof mockDestinations[0];
  language: Language;
}

function DestinationCard({ destination, language }: DestinationCardProps) {
  const { t } = useTranslation(language);
  
  const name = language === 'am' ? destination.nameAm : 
               language === 'or' ? destination.nameOr : 
               destination.name;
  
  const description = language === 'am' ? destination.descriptionAm : 
                     language === 'or' ? destination.descriptionOr : 
                     destination.description;

  const occupancyPercentage = Math.round((destination.currentOccupancy / destination.maxCapacity) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <span className="text-6xl">🏛️</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-slate-400">{t.destinations.currentOccupancy}</span>
            <span className="font-semibold text-gray-100">{destination.currentOccupancy}/{destination.maxCapacity}</span>
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
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-slate-400">{t.destinations.entryFee}</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(destination.entryFee, language)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-slate-400">{t.destinations.rating}</span>
            <div className="flex items-center">
              <span className="text-yellow-500">{'★'.repeat(Math.floor(destination.avgRating))}</span>
              <span className="ml-1 text-sm font-semibold text-gray-100">{destination.avgRating}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-slate-400">{t.dashboard.revenue}</span>
            <span className="font-semibold text-blue-600">
              {formatCurrency(destination.revenue, language)}
            </span>
          </div>
        </div>
        
        <a 
          href={`/showcase/destinations/${destination.id}`}
          className="block w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
        >
          {t.destinations.viewDetails}
        </a>
      </div>
    </div>
  );
}

interface TouristCardProps {
  tourist: typeof mockTourists[0];
  language: Language;
}

function TouristCard({ tourist, language }: TouristCardProps) {
  const { t } = useTranslation(language);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
          {tourist.avatar || tourist.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-slate-100">{tourist.name}</h4>
          <p className="text-sm text-gray-600 dark:text-slate-400">{tourist.nationality}</p>
        </div>
        <div className="ml-auto">
          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
            tourist.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {tourist.status === 'active' ? t.status.active : t.status.completed}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600 dark:text-slate-400">{t.tourists.purpose}</span>
          <p className="font-medium text-green-400">{tourist.purpose}</p>
        </div>
        <div>
          <span className="text-gray-600 dark:text-slate-400">{t.tourists.groupSize}</span>
          <p className="font-medium text-blue-400">{tourist.groupSize}</p>
        </div>
        <div>
          <span className="text-gray-600 dark:text-slate-400">{t.tourists.totalSpent}</span>
          <p className="font-medium text-green-600">{formatCurrency(tourist.totalSpent, language)}</p>
        </div>
        <div>
          <span className="text-gray-600 dark:text-slate-400">{t.wristband.title}</span>
          <p className="font-medium text-yellow-300">{tourist.wristbandId ? '✓ Linked' : '✗ Not Linked'}</p>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState('overview');
  const [liveData, setLiveData] = useState(mockAnalytics);
  const [registeredTourists, setRegisteredTourists] = useState(mockTourists);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { t } = useTranslation(language);

  const handleNewRegistration = (newTourist: any) => {
    setRegisteredTourists(prev => [newTourist, ...prev]);
    setShowRegistrationForm(false);
    // Update live data
    setLiveData(prev => ({
      ...prev,
      dailyVisitors: prev.dailyVisitors + 1,
      totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 1000)
    }));
  };

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        dailyVisitors: prev.dailyVisitors + Math.floor(Math.random() * 3),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 500),
        averageSpending: prev.averageSpending + Math.floor(Math.random() * 20 - 10),
        occupancyRate: Math.max(0, Math.min(100, prev.occupancyRate + Math.floor(Math.random() * 6 - 3)))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', label: t.analytics.overview, icon: '📊' },
    { id: 'wristband', label: t.wristband.title, icon: '⌚' },
    { id: 'destinations', label: t.destinations.title, icon: '🏛️' },
    { id: 'tourists', label: t.tourists.title, icon: '👥' },
    { id: 'analytics', label: t.analytics.title, icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🇪🇹</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Ethiopia Tourism Platform Showcase
                </h1>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                Interactive demonstration of Ethiopia's smart tourism ecosystem
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
          
          {/* Navigation Tabs */}
          {/* <div className="bg-blue-50 dark:bg-slate-800 border dark:border-slate-600 rounded-lg p-4 mb-4">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              🎯 <strong>Demo Mode:</strong> This is a fully functional showcase of Ethiopia's Tourism AI Platform with real-time data simulation, multi-language support, and NFC payment demonstrations.
            </p>
          </div> */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Live Statistics */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                {t.dashboard.todayStats} <span className="text-green-500 animate-pulse">●</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                  title={t.dashboard.visitors}
                  value={liveData.dailyVisitors.toLocaleString()}
                  subtitle="Active tourists"
                  color="blue"
                  trend="up"
                  trendValue="+12%"
                />
                <DashboardCard
                  title={t.dashboard.revenue}
                  value={formatCurrency(liveData.totalRevenue, language)}
                  subtitle="Today's earnings"
                  color="green"
                  trend="up"
                  trendValue="+8%"
                />
                <DashboardCard
                  title={t.dashboard.satisfaction}
                  value={`${liveData.satisfactionScore}/5.0`}
                  subtitle="Average rating"
                  color="purple"
                  trend="stable"
                  trendValue="0%"
                />
                <DashboardCard
                  title={t.dashboard.occupancy}
                  value={`${liveData.occupancyRate}%`}
                  subtitle="Current capacity"
                  color="orange"
                  trend="down"
                  trendValue="-3%"
                />
              </div>
            </div>

            {/* Popular Destinations */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                {t.dashboard.popularDestinations}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDestinations.slice(0, 3).map((destination) => (
                  <DestinationCard 
                    key={destination.id} 
                    destination={destination} 
                    language={language}
                  />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                {t.dashboard.recentActivity}
              </h2>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.tourists.title}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.payments.amount}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.payments.merchant}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.payments.timestamp}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700 dark:divide-slate-700">
                      {mockTransactions.slice(0, 5).map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {transaction.touristName}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-green-600">
                              {formatCurrency(transaction.amount, language)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-slate-100">
                              {language === 'am' ? transaction.merchantNameAm : 
                               language === 'or' ? transaction.merchantNameOr : 
                               transaction.merchantName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                            {new Date(transaction.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wristband Demo Tab */}
        {activeTab === 'wristband' && (
          <WristbandDemo language={language} onLanguageChange={setLanguage} />
        )}

        {/* Destinations Tab */}
        {activeTab === 'destinations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {t.destinations.title}
              </h2>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                {mockDestinations.length} destinations available
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDestinations.map((destination) => (
                <DestinationCard 
                  key={destination.id} 
                  destination={destination} 
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tourists Tab */}
        {activeTab === 'tourists' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {t.tourists.title}
              </h2>
              <button 
                onClick={() => setShowRegistrationForm(!showRegistrationForm)}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
              >
                {showRegistrationForm ? t.forms.cancel : `➕ ${t.tourists.register}`}
              </button>
            </div>
            
            {showRegistrationForm && (
              <TouristRegistration 
                language={language}
                onRegistrationComplete={handleNewRegistration}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredTourists.map((tourist) => (
                <TouristCard 
                  key={tourist.id} 
                  tourist={tourist} 
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-slate-100">
              {t.analytics.title} & Intelligence
            </h2>
            
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-100"  >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold mb-4">🔗 Wristband Adoption</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">89%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '89%'}}></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  of tourists use NFC wristbands
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold mb-4">⏱️ Average Stay</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">4.2h</div>
                <div className="text-sm text-green-600 mb-2">+0.3h from last month</div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  per destination visit
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold mb-4">🔄 Repeat Visitors</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">23%</div>
                <div className="text-sm text-purple-600 mb-2">+5% from last month</div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  return within 6 months
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold mb-4">🎯 AI Accuracy</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">94%</div>
                <div className="text-sm text-orange-600 mb-2">Recommendation success</div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  tourists follow AI suggestions
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-100">
              
              {/* Visitor Flow Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold mb-4">📈 Daily Visitor Flow</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 78, 82, 95, 120, 156, 134].map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500 rounded-t-lg w-8 transition-all duration-1000"
                        style={{height: `${(value / 156) * 200}px`}}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </span>
                      <span className="text-xs text-gray-500">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow text-gray-100">
                <h3 className="text-lg font-semibold mb-4">💰 Revenue by Category</h3>
              <div className="space-y-4">
                  {[
                    {name: 'Entry Fees', amount: 89400, color: 'bg-blue-500', percent: 45},
                    {name: 'Food & Beverage', amount: 45200, color: 'bg-green-500', percent: 23},
                    {name: 'Souvenirs', amount: 32100, color: 'bg-purple-500', percent: 16},
                    {name: 'Transportation', amount: 28300, color: 'bg-orange-500', percent: 14},
                    {name: 'Accommodation', amount: 4780, color: 'bg-red-500', percent: 2}
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-4 h-4 rounded ${item.color}`}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{width: `${item.percent}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold min-w-[80px] text-right">
                          {formatCurrency(item.amount, language)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Destination Heatmap */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow text-gray-100">
              <h3 className="text-lg font-semibold mb-4">🗺️ Destination Popularity Heatmap</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {mockDestinations.slice(0, 15).map((dest, index) => {
                  const intensity = Math.round((dest.currentOccupancy / dest.maxCapacity) * 100);
                  const colorClass = intensity > 80 ? 'bg-red-500' : 
                                   intensity > 60 ? 'bg-orange-500' : 
                                   intensity > 40 ? 'bg-yellow-500' : 
                                   intensity > 20 ? 'bg-green-500' : 'bg-blue-500';
                  return (
                    <div 
                      key={dest.id}
                      className={`${colorClass} rounded-lg p-3 text-white text-center cursor-pointer hover:scale-105 transition-transform`}
                      title={`${language === 'am' ? dest.nameAm : language === 'or' ? dest.nameOr : dest.name}: ${intensity}% occupied`}
                    >
                      <div className="text-xs font-semibold">
                        {(language === 'am' ? dest.nameAm : language === 'or' ? dest.nameOr : dest.name).substring(0, 8)}
                      </div>
                      <div className="text-lg font-bold">{intensity}%</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>🟦 Low Traffic</span>
                <span>🟩 Moderate</span>
                <span>🟨 Busy</span>
                <span>🟧 Very Busy</span>
                <span>🟥 At Capacity</span>
              </div>
            </div>

            {/* AI Recommendations Engine */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow text-gray-100">
              <h3 className="text-lg font-semibold mb-4">🤖 AI {t.recommendations.title} Engine</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Real-time Suggestions</h4>
                  <div className="space-y-3">
                {mockRecommendations.map((rec) => (
                      <div key={rec.id} className="border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-sm">
                      {language === 'am' ? rec.titleAm : 
                       language === 'or' ? rec.titleOr : 
                       rec.title}
                          </h5>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {Math.round(rec.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">
                      {language === 'am' ? rec.descriptionAm : 
                       language === 'or' ? rec.descriptionOr : 
                       rec.description}
                    </p>
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span>📍 {rec.distance}km</span>
                          <span>💰 {formatCurrency(rec.estimatedPrice, language)}</span>
                          <span>⏱️ {rec.duration}min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Recommendation Performance</h4>
                  <div className="space-y-4">
                    {[
                      {metric: 'Click-through Rate', value: '34%', trend: '+2.1%'},
                      {metric: 'Conversion Rate', value: '28%', trend: '+4.3%'},
                      {metric: 'User Satisfaction', value: '4.6/5', trend: '+0.2'},
                      {metric: 'Revenue Impact', value: '+15%', trend: '+3.1%'}
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm font-medium">{item.metric}</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{item.value}</div>
                          <div className="text-xs text-green-500">{item.trend}</div>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Analytics */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow text-gray-100">
              <h3 className="text-lg font-semibold mb-4">🔮 Predictive Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-semibold">Tomorrow's Forecast</h4>
                  <div className="text-3xl font-bold text-blue-600 my-2">+23%</div>
                  <p className="text-sm text-gray-600">Expected visitor increase</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💡</div>
                  <h4 className="font-semibold">Peak Hour Prediction</h4>
                  <div className="text-3xl font-bold text-green-600 my-2">2-4 PM</div>
                  <p className="text-sm text-gray-600">Busiest time slot</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold">Revenue Projection</h4>
                  <div className="text-3xl font-bold text-purple-600 my-2">
                    {formatCurrency(185000, language)}
                  </div>
                  <p className="text-sm text-gray-600">Expected daily revenue</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
