'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation, formatCurrency, Language } from '@/lib/translations';
import { mockTourists, mockTransactions, demoScenarios } from '@/lib/mock-data/tourism-data';

interface WristbandDemoProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  data?: any;
}

export default function WristbandDemo({ language = 'en', onLanguageChange }: WristbandDemoProps) {
  const { t } = useTranslation(language);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTourist, setSelectedTourist] = useState(mockTourists[0]);
  const [wristbandBalance, setWristbandBalance] = useState(2000);
  const [recentTransaction, setRecentTransaction] = useState<any>(null);
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([]);

  // Initialize demo steps based on scenario
  useEffect(() => {
    const scenario = demoScenarios[currentScenario];
    const steps: DemoStep[] = scenario.steps.map((step, index) => ({
      id: `step_${index}`,
      title: step,
      description: getStepDescription(currentScenario, index),
      action: getStepAction(currentScenario, index),
      completed: false
    }));
    setDemoSteps(steps);
    setCurrentStep(0);
  }, [currentScenario]);

  function getStepDescription(scenarioIndex: number, stepIndex: number): string {
    const descriptions = [
      // Scenario 1: Registration & Linking
      [
        'Tourist arrives at destination entrance',
        'Quick passport scan and form filling',
        'NFC wristband paired with tourist account',
        'Initial wallet balance loaded',
        'Access granted to destination'
      ],
      // Scenario 2: Payments & Recommendations
      [
        'Seamless payment with wristband tap',
        'AI analyzes preferences and suggests nearby options',
        'Order placed using wristband payment',
        'Real-time balance updates and spending alerts',
        'AI recommends next destination based on behavior'
      ],
      // Scenario 3: Multi-language Experience
      [
        'Interface switches to Amharic',
        'Audio guide plays in Oromo language',
        'Recommendations shown in preferred language',
        'Transaction receipts in local language',
        'Cultural context provided in native language'
      ]
    ];
    return descriptions[scenarioIndex]?.[stepIndex] || '';
  }

  function getStepAction(scenarioIndex: number, stepIndex: number): string {
    const actions = [
      // Scenario 1
      ['Scan QR Code', 'Fill Form', 'Tap Wristband', 'Load Wallet', 'Enter Site'],
      // Scenario 2
      ['Tap to Pay', 'View Recommendation', 'Place Order', 'Check Balance', 'Get Suggestion'],
      // Scenario 3
      ['Switch Language', 'Play Audio', 'View in Amharic', 'Print Receipt', 'Read Context']
    ];
    return actions[scenarioIndex]?.[stepIndex] || 'Next Step';
  }

  function executeRegistrationStep(stepIndex: number) {
    switch (stepIndex) {
      case 2: // Wristband linking
        setSelectedTourist(prev => ({ ...prev, wristbandId: 'WB_DEMO_001' }));
        break;
      case 3: // Wallet setup
        setWristbandBalance(2000);
        break;
    }
  }

  function executePaymentStep(stepIndex: number) {
    switch (stepIndex) {
      case 0: // Payment
        const payment = {
          amount: 150,
          merchant: 'Traditional Coffee House',
          timestamp: new Date().toISOString()
        };
        setRecentTransaction(payment);
        setWristbandBalance(prev => prev - 150);
        break;
      case 3: // Balance check
        // Already handled by payment
        break;
    }
  }

  function executeLanguageStep(stepIndex: number) {
    switch (stepIndex) {
      case 0: // Switch to Amharic
        onLanguageChange?.('am');
        break;
      case 2: // Show in preferred language
        // Language already switched
        break;
    }
  }

  // Define executeStep function before useEffect
  const executeStep = useCallback((stepIndex: number) => {
    const updatedSteps = [...demoSteps];
    updatedSteps[stepIndex].completed = true;
    setDemoSteps(updatedSteps);

    // Execute step-specific actions
    switch (currentScenario) {
      case 0: // Registration scenario
        executeRegistrationStep(stepIndex);
        break;
      case 1: // Payment scenario
        executePaymentStep(stepIndex);
        break;
      case 2: // Language scenario
        executeLanguageStep(stepIndex);
        break;
    }
  }, [demoSteps, currentScenario, onLanguageChange]);

  // Auto-play demo
  useEffect(() => {
    if (isPlaying && currentStep < demoSteps.length) {
      const timer = setTimeout(() => {
        executeStep(currentStep);
        setCurrentStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (currentStep >= demoSteps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, demoSteps.length, executeStep]);

  function startDemo() {
    setIsPlaying(true);
    setCurrentStep(0);
    setDemoSteps(prev => prev.map(step => ({ ...step, completed: false })));
  }

  function stopDemo() {
    setIsPlaying(false);
  }

  function resetDemo() {
    setIsPlaying(false);
    setCurrentStep(0);
    setWristbandBalance(2000);
    setRecentTransaction(null);
    setDemoSteps(prev => prev.map(step => ({ ...step, completed: false })));
    onLanguageChange?.('en');
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.demo.title} - {t.wristband.title}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={startDemo}
              disabled={isPlaying}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isPlaying ? t.status.loading : `${t.forms.submit} ${t.demo.showcase}`}
            </button>
            <button
              onClick={stopDemo}
              disabled={!isPlaying}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Stop
            </button>
            <button
              onClick={resetDemo}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              {t.forms.reset}
            </button>
          </div>
        </div>

        {/* Language Selector */}
        {/* <div className="flex gap-4 mb-4">
          {['en', 'am', 'or'].map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange?.(lang as Language)}
              className={`px-3 py-1 rounded ${
                language === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {lang === 'en' ? '🇺🇸 English' : lang === 'am' ? '🇪🇹 አማርኛ' : '🇪🇹 Afaan Oromoo'}
            </button>
          ))}
        </div> */}

        {/* Scenario Selector */}
        <div className="flex gap-2">
          {demoScenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              onClick={() => setCurrentScenario(index)}
              className={`px-4 py-2 rounded text-sm ${
                currentScenario === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {language === 'am' ? scenario.titleAm : language === 'or' ? scenario.titleOr : scenario.title}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wristband Device Simulation */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⌚</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">NFC {t.wristband.title}</h3>
              <p className="text-sm opacity-80">ID: {selectedTourist.wristbandId || 'Not Linked'}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t.wristband.balance}</span>
                  <span className="font-bold">{formatCurrency(wristbandBalance, language)}</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t.tourists.nationality}</span>
                  <span className="font-semibold">{selectedTourist.nationality}</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t.status.active}</span>
                  <div className={`w-3 h-3 rounded-full ${selectedTourist.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                </div>
              </div>

              {recentTransaction && (
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs opacity-80 mb-1">{t.wristband.lastTransaction}</p>
                  <p className="font-semibold text-sm">
                    {formatCurrency(recentTransaction.amount, language)}
                  </p>
                  <p className="text-xs opacity-80">{recentTransaction.merchant}</p>
                </div>
              )}
            </div>

            {/* NFC Animation */}
            <div className="mt-6 text-center">
              <div className={`inline-block p-3 rounded-full ${isPlaying ? 'animate-pulse bg-white/20' : 'bg-white/10'}`}>
                <span className="text-2xl">📡</span>
              </div>
              <p className="text-xs mt-2 opacity-80">
                {isPlaying ? 'NFC Active' : t.wristband.tapToPay}
              </p>
            </div>
          </div>
        </div>

        {/* Demo Steps */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t.demo.scenario} {currentScenario + 1}: {language === 'am' ? demoScenarios[currentScenario].titleAm : language === 'or' ? demoScenarios[currentScenario].titleOr : demoScenarios[currentScenario].title}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t.demo.step} {currentStep + 1} / {demoSteps.length}
              </div>
            </div>

            <div className="space-y-4">
              {demoSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    step.completed
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : index === currentStep && isPlaying
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 animate-pulse'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : index === currentStep && isPlaying
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => executeStep(index)}
                      disabled={isPlaying || step.completed}
                      className={`px-3 py-1 text-sm rounded ${
                        step.completed
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {step.completed ? t.status.completed : step.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border">
          <div className="text-2xl font-bold text-blue-600">{mockTourists.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t.dashboard.visitors}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(mockTransactions.reduce((sum, t) => sum + t.amount, 0), language)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t.dashboard.revenue}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border">
          <div className="text-2xl font-bold text-purple-600">89%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Wristband Adoption</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border">
          <div className="text-2xl font-bold text-orange-600">4.3</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t.dashboard.satisfaction}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t.dashboard.recentActivity}
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.tourists.title}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.payments.amount}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.payments.merchant}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.payments.timestamp}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.payments.status}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockTransactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {transaction.touristName}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    {formatCurrency(transaction.amount, language)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {language === 'am' ? transaction.merchantNameAm : 
                     language === 'or' ? transaction.merchantNameOr : 
                     transaction.merchantName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? t.status.completed :
                       transaction.status === 'pending' ? t.status.pending :
                       t.status.failed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
