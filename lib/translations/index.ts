// Translation system for Ethiopia Tourism Platform
export type Language = 'en' | 'am' | 'or';

export interface Translations {
  // Navigation & Common
  navigation: {
    dashboard: string;
    tourists: string;
    destinations: string;
    analytics: string;
    wristbands: string;
    settings: string;
    logout: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    todayStats: string;
    visitors: string;
    revenue: string;
    satisfaction: string;
    occupancy: string;
    quickActions: string;
    recentActivity: string;
    alerts: string;
    popularDestinations: string;
  };
  
  // Tourist Management
  tourists: {
    title: string;
    register: string;
    search: string;
    active: string;
    completed: string;
    totalSpent: string;
    wristbandLinked: string;
    viewProfile: string;
    nationality: string;
    groupSize: string;
    purpose: string;
    checkinTime: string;
  };
  
  // Wristband System
  wristband: {
    title: string;
    link: string;
    balance: string;
    transactions: string;
    topUp: string;
    suspend: string;
    activate: string;
    dailyLimit: string;
    spentToday: string;
    lastTransaction: string;
    paymentMethod: string;
    tapToPay: string;
  };
  
  // Destinations
  destinations: {
    title: string;
    explore: string;
    featured: string;
    categories: string;
    entryFee: string;
    currentOccupancy: string;
    rating: string;
    estimatedDuration: string;
    amenities: string;
    getDirections: string;
    bookTicket: string;
    viewDetails: string;
  };
  
  // Payments & Transactions
  payments: {
    title: string;
    amount: string;
    merchant: string;
    timestamp: string;
    status: string;
    method: string;
    receipt: string;
    refund: string;
    pending: string;
    completed: string;
    failed: string;
  };
  
  // Analytics & Reports
  analytics: {
    title: string;
    overview: string;
    detailed: string;
    export: string;
    dateRange: string;
    filter: string;
    insights: string;
    trends: string;
    forecasts: string;
    performance: string;
  };
  
  // Recommendations
  recommendations: {
    title: string;
    forYou: string;
    nearby: string;
    popular: string;
    similar: string;
    basedOn: string;
    confidence: string;
    distance: string;
    estimatedCost: string;
    viewMore: string;
  };
  
  // Forms & Actions
  forms: {
    submit: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    confirm: string;
    search: string;
    filter: string;
    reset: string;
    back: string;
    next: string;
    finish: string;
  };
  
  // Status & Messages
  status: {
    active: string;
    inactive: string;
    pending: string;
    completed: string;
    failed: string;
    loading: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  
  // Demo Specific
  demo: {
    title: string;
    scenario: string;
    step: string;
    showcase: string;
    features: string;
    mockData: string;
    simulation: string;
    realTime: string;
  };
  
  // Currency & Numbers
  currency: {
    symbol: string;
    name: string;
    code: string;
  };
}

// English translations (base)
export const translations: Record<Language, Translations> = {
  en: {
    navigation: {
      dashboard: 'Dashboard',
      tourists: 'Tourists',
      destinations: 'Destinations',
      analytics: 'Analytics',
      wristbands: 'Wristbands',
      settings: 'Settings',
      logout: 'Logout'
    },
    dashboard: {
      title: 'Tourism Dashboard',
      welcome: 'Welcome to Ethiopia Tourism Platform',
      todayStats: 'Today\'s Statistics',
      visitors: 'Visitors',
      revenue: 'Revenue',
      satisfaction: 'Satisfaction',
      occupancy: 'Occupancy',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      alerts: 'Alerts',
      popularDestinations: 'Popular Destinations'
    },
    tourists: {
      title: 'Tourist Management',
      register: 'Register Tourist',
      search: 'Search Tourists',
      active: 'Active',
      completed: 'Completed',
      totalSpent: 'Total Spent',
      wristbandLinked: 'Wristband Linked',
      viewProfile: 'View Profile',
      nationality: 'Nationality',
      groupSize: 'Group Size',
      purpose: 'Purpose',
      checkinTime: 'Check-in Time'
    },
    wristband: {
      title: 'Wristband Management',
      link: 'Link Wristband',
      balance: 'Balance',
      transactions: 'Transactions',
      topUp: 'Top Up',
      suspend: 'Suspend',
      activate: 'Activate',
      dailyLimit: 'Daily Limit',
      spentToday: 'Spent Today',
      lastTransaction: 'Last Transaction',
      paymentMethod: 'Payment Method',
      tapToPay: 'Tap to Pay'
    },
    destinations: {
      title: 'Destinations',
      explore: 'Explore',
      featured: 'Featured',
      categories: 'Categories',
      entryFee: 'Entry Fee',
      currentOccupancy: 'Current Occupancy',
      rating: 'Rating',
      estimatedDuration: 'Estimated Duration',
      amenities: 'Amenities',
      getDirections: 'Get Directions',
      bookTicket: 'Book Ticket',
      viewDetails: 'View Details'
    },
    payments: {
      title: 'Payments',
      amount: 'Amount',
      merchant: 'Merchant',
      timestamp: 'Time',
      status: 'Status',
      method: 'Method',
      receipt: 'Receipt',
      refund: 'Refund',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed'
    },
    analytics: {
      title: 'Analytics',
      overview: 'Overview',
      detailed: 'Detailed',
      export: 'Export',
      dateRange: 'Date Range',
      filter: 'Filter',
      insights: 'Insights',
      trends: 'Trends',
      forecasts: 'Forecasts',
      performance: 'Performance'
    },
    recommendations: {
      title: 'Recommendations',
      forYou: 'For You',
      nearby: 'Nearby',
      popular: 'Popular',
      similar: 'Similar',
      basedOn: 'Based on',
      confidence: 'Confidence',
      distance: 'Distance',
      estimatedCost: 'Estimated Cost',
      viewMore: 'View More'
    },
    forms: {
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      reset: 'Reset',
      back: 'Back',
      next: 'Next',
      finish: 'Finish'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    },
    demo: {
      title: 'Data Reporting Platform',
      scenario: 'Scenario',
      step: 'Step',
      showcase: 'Showcase',
      features: 'Features',
      mockData: 'Mock Data',
      simulation: 'Simulation',
      realTime: 'Real-time'
    },
    currency: {
      symbol: 'ETB',
      name: 'Ethiopian Birr',
      code: 'ETB'
    }
  },
  
  // Amharic translations
  am: {
    navigation: {
      dashboard: 'ዳሽቦርድ',
      tourists: 'ቱሪስቶች',
      destinations: 'መድረሻዎች',
      analytics: 'ትንታኔዎች',
      wristbands: 'መሳሪያዎች',
      settings: 'ቅንብሮች',
      logout: 'ውጣ'
    },
    dashboard: {
      title: 'የቱሪዝም ዳሽቦርድ',
      welcome: 'ወደ ኢትዮጵያ ቱሪዝም መድረክ እንኳን በደህና መጡ',
      todayStats: 'የዛሬ ስታቲስቲክስ',
      visitors: 'ጎብኝዎች',
      revenue: 'ገቢ',
      satisfaction: 'እርካታ',
      occupancy: 'ሲዝም',
      quickActions: 'ፈጣን እርምጃዎች',
      recentActivity: 'የቅርብ ጊዜ እንቅስቃሴ',
      alerts: 'ማንቂያዎች',
      popularDestinations: 'ታዋቂ መድረሻዎች'
    },
    tourists: {
      title: 'የቱሪስት አስተዳደር',
      register: 'ቱሪስት መዝግብ',
      search: 'ቱሪስቶችን ፈልግ',
      active: 'ንቁ',
      completed: 'የተጠናቀቀ',
      totalSpent: 'ጠቅላላ ወጪ',
      wristbandLinked: 'መሳሪያ ተገናኝቷል',
      viewProfile: 'መገለጫ ይመልከቱ',
      nationality: 'ዜግነት',
      groupSize: 'የቡድን መጠን',
      purpose: 'ዓላማ',
      checkinTime: 'የመግቢያ ሰዓት'
    },
    wristband: {
      title: 'የመሳሪያ አስተዳደር',
      link: 'መሳሪያ አገናኝ',
      balance: 'ቀሪ ገንዘብ',
      transactions: 'ግብይቶች',
      topUp: 'ገንዘብ ጨምር',
      suspend: 'አቁም',
      activate: 'አስነሳ',
      dailyLimit: 'የቀን ገደብ',
      spentToday: 'ዛሬ የወጣ',
      lastTransaction: 'የመጨረሻ ግብይት',
      paymentMethod: 'የክፍያ ዘዴ',
      tapToPay: 'ለመክፈል ንካ'
    },
    destinations: {
      title: 'መድረሻዎች',
      explore: 'ዳስስ',
      featured: 'ተመርጦ የቀረበ',
      categories: 'ምድቦች',
      entryFee: 'የመግቢያ ክፍያ',
      currentOccupancy: 'የአሁን ሲዝም',
      rating: 'ደረጃ',
      estimatedDuration: 'የታሰበ ጊዜ',
      amenities: 'አገልግሎቶች',
      getDirections: 'አቅጣጫ ያግኙ',
      bookTicket: 'ቲኬት ያዙ',
      viewDetails: 'ዝርዝር ይመልከቱ'
    },
    payments: {
      title: 'ክፍያዎች',
      amount: 'መጠን',
      merchant: 'ነጋዴ',
      timestamp: 'ሰዓት',
      status: 'ሁኔታ',
      method: 'ዘዴ',
      receipt: 'ደረሰኝ',
      refund: 'መመላለስ',
      pending: 'በመጠባበቅ ላይ',
      completed: 'የተጠናቀቀ',
      failed: 'ያልተሳካ'
    },
    analytics: {
      title: 'ትንታኔዎች',
      overview: 'አጠቃላይ እይታ',
      detailed: 'ዝርዝር',
      export: 'ላክ',
      dateRange: 'የቀን ክልል',
      filter: 'አጣራ',
      insights: 'ግንዛቤዎች',
      trends: 'አዝማሚያዎች',
      forecasts: 'ትንበያዎች',
      performance: 'አፈጻጸም'
    },
    recommendations: {
      title: 'ምክሮች',
      forYou: 'ለእርስዎ',
      nearby: 'በአቅራቢያ',
      popular: 'ታዋቂ',
      similar: 'ተመሳሳይ',
      basedOn: 'በመሠረት',
      confidence: 'መተማመን',
      distance: 'ርቀት',
      estimatedCost: 'የታሰበ ዋጋ',
      viewMore: 'ተጨማሪ ይመልከቅ'
    },
    forms: {
      submit: 'አስገባ',
      cancel: 'ሰርዝ',
      save: 'አስቀምጥ',
      edit: 'አርም',
      delete: 'ሰርዝ',
      confirm: 'አረጋግጥ',
      search: 'ፈልግ',
      filter: 'አጣራ',
      reset: 'ዳግም አስጀምር',
      back: 'ተመለስ',
      next: 'ቀጣይ',
      finish: 'ጨርስ'
    },
    status: {
      active: 'ንቁ',
      inactive: 'ንቁ ያልሆነ',
      pending: 'በመጠባበቅ ላይ',
      completed: 'የተጠናቀቀ',
      failed: 'ያልተሳካ',
      loading: 'በመጫን ላይ...',
      success: 'ተሳክቷል',
      error: 'ስህተት',
      warning: 'ማስጠንቀቂያ',
      info: 'መረጃ'
    },
    demo: {
      title: 'የማሳያ መድረክ',
      scenario: 'ሁኔታ',
      step: 'ደረጃ',
      showcase: 'ማሳያ',
      features: 'ባህሪያት',
      mockData: 'የምሳሌ ውሂብ',
      simulation: 'ኅሊና',
      realTime: 'በቅጽበት'
    },
    currency: {
      symbol: 'ብር',
      name: 'የኢትዮጵያ ብር',
      code: 'ETB'
    }
  },
  
  // Oromo translations
  or: {
    navigation: {
      dashboard: 'Gabatee',
      tourists: 'Turizimtoota',
      destinations: 'Bakkoota',
      analytics: 'Xiinxala',
      wristbands: 'Meeshaalee',
      settings: 'Qindaa\'ina',
      logout: 'Ba\'i'
    },
    dashboard: {
      title: 'Gabatee Turizimii',
      welcome: 'Gara Waltajjii Turizimii Itoophiyaa Baga Nagaan Dhuftan',
      todayStats: 'Istaatiksii Har\'aa',
      visitors: 'Daawwattoota',
      revenue: 'Galii',
      satisfaction: 'Itti Quufinsa',
      occupancy: 'Qubannaa',
      quickActions: 'Gocha Saffisaa',
      recentActivity: 'Sochiiwwan Dhiyoo',
      alerts: 'Ifaamoota',
      popularDestinations: 'Bakkoota Jaallatamoo'
    },
    tourists: {
      title: 'Bulchiinsa Turizimii',
      register: 'Turizimiitota Galmeessi',
      search: 'Turizmiitota Barbaadi',
      active: 'Ka\'umsaa',
      completed: 'Kan Xumure',
      totalSpent: 'Walumaagalaan Kan Bahe',
      wristbandLinked: 'Meeshaan Walqabsiifame',
      viewProfile: 'Seensa Ilaali',
      nationality: 'Lammummaa',
      groupSize: 'Bal\'ina Garee',
      purpose: 'Kaayyoo',
      checkinTime: 'Yeroo Galuu'
    },
    wristband: {
      title: 'Bulchiinsa Meeshaa',
      link: 'Meeshaa Walqabsiisi',
      balance: 'Hafe',
      transactions: 'Daldalawwan',
      topUp: 'Maallaqa Dabali',
      suspend: 'Dhaabbi',
      activate: 'Ka\'umsi',
      dailyLimit: 'Daangaa Guyyaa',
      spentToday: 'Har\'a Kan Bahe',
      lastTransaction: 'Daldala Dhumaa',
      paymentMethod: 'Mala Kaffaltii',
      tapToPay: 'Kaffaluuf Rukuti'
    },
    destinations: {
      title: 'Bakkoota',
      explore: 'Qori',
      featured: 'Filatamoo',
      categories: 'Ramaddii',
      entryFee: 'Kaffaltii Galtee',
      currentOccupancy: 'Qubannaa Ammaa',
      rating: 'Sadarkaa',
      estimatedDuration: 'Yeroo Tilmaamame',
      amenities: 'Tajaajilawwan',
      getDirections: 'Kallattii Argadhu',
      bookTicket: 'Tiikeetii Qabadhu',
      viewDetails: 'Bal\'inaa Ilaali'
    },
    payments: {
      title: 'Kaffaltiiwwan',
      amount: 'Hamma',
      merchant: 'Daldalaa',
      timestamp: 'Yeroo',
      status: 'Haala',
      method: 'Mala',
      receipt: 'Ragaa',
      refund: 'Deebisuu',
      pending: 'Eegannoo Irratti',
      completed: 'Kan Xumure',
      failed: 'Kan Kufee'
    },
    analytics: {
      title: 'Xiinxalawwan',
      overview: 'Ilaalcha Waliigalaa',
      detailed: 'Bal\'inaan',
      export: 'Ergi',
      dateRange: 'Hangii Guyyaa',
      filter: 'Cali',
      insights: 'Hubannoo',
      trends: 'Adeemsa',
      forecasts: 'Tilmaama',
      performance: 'Raawwii'
    },
    recommendations: {
      title: 'Gorsaawwan',
      forYou: 'Sitti',
      nearby: 'Naannoo',
      popular: 'Jaallatamoo',
      similar: 'Walfakkaatoo',
      basedOn: 'Hundee\'uun',
      confidence: 'Amantiinsa',
      distance: 'Fageenya',
      estimatedCost: 'Gatii Tilmaamame',
      viewMore: 'Dabalataa Ilaali'
    },
    forms: {
      submit: 'Dhiheessi',
      cancel: 'Dhiisi',
      save: 'Olkaa\'i',
      edit: 'Fooyyessi',
      delete: 'Haqi',
      confirm: 'Mirkaneessi',
      search: 'Barbaadi',
      filter: 'Cali',
      reset: 'Irra Deebi\'i',
      back: 'Deebi\'i',
      next: 'Itti Aansu',
      finish: 'Xumurii'
    },
    status: {
      active: 'Ka\'umsaa',
      inactive: 'Ka\'umsa Hin Qabne',
      pending: 'Eegannoo Irratti',
      completed: 'Kan Xumure',
      failed: 'Kan Kufee',
      loading: 'Fe\'aa jira...',
      success: 'Milka\'ina',
      error: 'Dogoggora',
      warning: 'Akeekkachiisa',
      info: 'Odeeffannoo'
    },
    demo: {
      title: 'Waltajjii Agarsiisaa',
      scenario: 'Haala',
      step: 'Sadarkaa',
      showcase: 'Agarsiisa',
      features: 'Amaloota',
      mockData: 'Daataa Fakkeenyaa',
      simulation: 'Fakkeessuun',
      realTime: 'Yeroo Dhugaa'
    },
    currency: {
      symbol: 'Birr',
      name: 'Birr Itoophiyaa',
      code: 'ETB'
    }
  }
};

// Translation hook
export function useTranslation(language: Language = 'en') {
  return {
    t: translations[language],
    currentLanguage: language,
    availableLanguages: ['en', 'am', 'or'] as Language[]
  };
}

// Currency formatter
export function formatCurrency(amount: number, language: Language = 'en'): string {
  const { currency } = translations[language];
  
  // Format number with Ethiopian Birr
  if (language === 'am') {
    return `${amount.toLocaleString()} ${currency.symbol}`;
  } else if (language === 'or') {
    return `${currency.symbol} ${amount.toLocaleString()}`;
  } else {
    return `${currency.code} ${amount.toLocaleString()}`;
  }
}

// Language direction helper
export function getLanguageDirection(language: Language): 'ltr' | 'rtl' {
  return 'ltr'; // All supported languages use left-to-right
}

// Language selector options
export const languageOptions = [
  { value: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { value: 'am', label: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
  { value: 'or', label: 'Oromo', native: 'Afaan Oromoo', flag: '🇪🇹' }
] as const;
