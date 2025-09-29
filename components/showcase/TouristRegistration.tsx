'use client';

import React, { useState } from 'react';
import { useTranslation, Language } from '@/lib/translations';

interface TouristRegistrationProps {
  language: Language;
  onRegistrationComplete: (tourist: any) => void;
}

export default function TouristRegistration({ language, onRegistrationComplete }: TouristRegistrationProps) {
  const { t } = useTranslation(language);
  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    email: '',
    phone: '',
    purpose: '',
    groupSize: 1,
    arrivalDate: '',
    departureDate: '',
    interests: [] as string[],
    accommodationType: '',
    budget: '',
    emergencyContact: '',
    dietaryRestrictions: '',
    languagePreference: language
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const purposes = [
    { value: 'leisure', label: 'Leisure', labelAm: 'መዝናኛ', labelOr: 'Boqonnaa' },
    { value: 'business', label: 'Business', labelAm: 'ንግድ', labelOr: 'Daldalaa' },
    { value: 'cultural', label: 'Cultural Tourism', labelAm: 'ባህላዊ ቱሪዝም', labelOr: 'Turizimii Aadaa' },
    { value: 'religious', label: 'Religious Tourism', labelAm: 'ሃይማኖታዊ ቱሪዝም', labelOr: 'Turizimii Amantaa' },
    { value: 'adventure', label: 'Adventure', labelAm: 'ጀብዱ', labelOr: 'Adventure' },
    { value: 'education', label: 'Educational', labelAm: 'ትምህርታዊ', labelOr: 'Barumsa' }
  ];

  const interests = [
    { value: 'historical_sites', label: 'Historical Sites', labelAm: 'ታሪካዊ ቦታዎች', labelOr: 'Bakkoota Seenaa' },
    { value: 'nature', label: 'Nature & Wildlife', labelAm: 'ተፈጥሮ እና የዱር እንስሳት', labelOr: 'Uumamaa fi Bineensa' },
    { value: 'culture', label: 'Local Culture', labelAm: 'የአካባቢ ባህል', labelOr: 'Aadaa Naannoo' },
    { value: 'food', label: 'Traditional Food', labelAm: 'ባህላዊ ምግብ', labelOr: 'Nyaata Aadaa' },
    { value: 'festivals', label: 'Festivals & Events', labelAm: 'በዓላት እና ዝግጅቶች', labelOr: 'Ayyaanota fi Taateewwan' },
    { value: 'shopping', label: 'Shopping', labelAm: 'ግብይት', labelOr: 'Bittaa' },
    { value: 'nightlife', label: 'Nightlife', labelAm: 'የሌሊት ህይወት', labelOr: 'Jiraannoo Halkanaa' },
    { value: 'photography', label: 'Photography', labelAm: 'ፎቶግራፍ', labelOr: 'Suuraa' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTourist = {
      id: `tourist_${Date.now()}`,
      ...formData,
      wristbandId: `WB_${Date.now()}`,
      totalSpent: 0,
      currency: 'ETB',
      status: 'active',
      checkinDate: new Date().toISOString()
    };

    onRegistrationComplete(newTourist);
    setSuccess(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        name: '',
        nationality: '',
        email: '',
        phone: '',
        purpose: '',
        groupSize: 1,
        arrivalDate: '',
        departureDate: '',
        interests: [],
        accommodationType: '',
        budget: '',
        emergencyContact: '',
        dietaryRestrictions: '',
        languagePreference: language
      });
    }, 3000);
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          {language === 'am' ? 'ምዝገባ ተሳክቷል!' : 
           language === 'or' ? 'Galmeen milkaa\'e!' : 
           'Registration Successful!'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {language === 'am' ? 'የእርስዎ የጉዞ መታወቂያ መሳሪያ ተዘጋጅቷል እና የNFC ክፍያ ተቀባይ ተጀምሯል።' :
           language === 'or' ? 'Mallattoon imala keessanii qophaa\'eera, kaffaltiin NFC ges jalqabeera.' :
           'Your travel profile has been created and NFC payment is activated.'}
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Wristband ID:</strong> WB_{Date.now()}<br/>
            <strong>Initial Balance:</strong> 2,000 ETB<br/>
            <strong>Status:</strong> Active
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 text-gray-100 rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-6">
        {language === 'am' ? 'አዲስ ቱሪስት ምዝገባ' : 
         language === 'or' ? 'Galmeessa Turizimiitotaa Haaraa' : 
         'New Tourist Registration'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-100">
        {/* Personal Information */}
        <div className="text-gray-100">
          <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'ሙሉ ስም' : language === 'or' ? 'Maqaa Guutuu' : 'Full Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder={language === 'am' ? 'ስም ያስገቡ' : language === 'or' ? 'Maqaa galchi' : 'Enter your name'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'ዜግነት' : language === 'or' ? 'Lammummaa' : 'Nationality'} *
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder={language === 'am' ? 'ዜግነት' : language === 'or' ? 'Lammummaa' : 'Country'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'ኢሜይል' : language === 'or' ? 'Imeylii' : 'Email'} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'ስልክ ቁጥር' : language === 'or' ? 'Lakkoofsa Bilbilaa' : 'Phone Number'} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="+251..."
              />
            </div>
          </div>
        </div>

        {/* Travel Information */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Travel Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'የጉዞ ዓላማ' : language === 'or' ? 'Kaayyoo Imala' : 'Purpose of Visit'} *
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select purpose</option>
                {purposes.map(purpose => (
                  <option key={purpose.value} value={purpose.value}>
                    {language === 'am' ? purpose.labelAm : 
                     language === 'or' ? purpose.labelOr : 
                     purpose.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'የቡድን መጠን' : language === 'or' ? 'Bal\'ina Garee' : 'Group Size'}
              </label>
              <input
                type="number"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleInputChange}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'የመግቢያ ቀን' : language === 'or' ? 'Guyyaa Galuu' : 'Arrival Date'}
              </label>
              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'የመውጫ ቀን' : language === 'or' ? 'Guyyaa Ba\'uu' : 'Departure Date'}
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <h4 className="text-lg font-semibold mb-4">
            {language === 'am' ? 'ፍላጎቶች' : language === 'or' ? 'Fedhii' : 'Interests & Preferences'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {interests.map(interest => (
              <label key={interest.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest.value)}
                  onChange={() => handleInterestToggle(interest.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">
                  {language === 'am' ? interest.labelAm : 
                   language === 'or' ? interest.labelOr : 
                   interest.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Additional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'የባጀት ክልል (ETB)' : language === 'or' ? 'Hangii Baajataa (ETB)' : 'Budget Range (ETB)'}
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select budget</option>
                <option value="low">Under 5,000 ETB</option>
                <option value="medium">5,000 - 15,000 ETB</option>
                <option value="high">15,000 - 30,000 ETB</option>
                <option value="luxury">30,000+ ETB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'am' ? 'የአደጋ ጊዜ ስልክ' : language === 'or' ? 'Bilbila Yeroo Rakkoo' : 'Emergency Contact'}
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="+251..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                {language === 'am' ? 'በመስራት ላይ...' : 
                 language === 'or' ? 'Hojjechaa jira...' : 
                 'Processing...'}
              </>
            ) : (
              <>
                🎫 {language === 'am' ? 'ምዝገባ ይጨርሱ' : 
                     language === 'or' ? 'Galmeessa Xumurii' : 
                     'Complete Registration'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
