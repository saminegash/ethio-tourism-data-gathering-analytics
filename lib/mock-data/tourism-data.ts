// Mock Tourism Data for Ethiopia Tourism AI Platform Demo
export interface Tourist {
  id: string;
  name: string;
  nationality: string;
  purpose: string;
  groupSize: number;
  checkinDate: string;
  wristbandId?: string;
  totalSpent: number;
  currency: 'ETB';
  status: 'active' | 'completed' | 'registered';
  preferences: string[];
  avatar?: string;
}

export interface Destination {
  id: string;
  name: string;
  nameAm: string; // Amharic
  nameOr: string; // Oromo
  location: string;
  category: string;
  currentOccupancy: number;
  maxCapacity: number;
  avgRating: number;
  totalVisitsToday: number;
  revenue: number;
  currency: 'ETB';
  coordinates: [number, number];
  description: string;
  descriptionAm: string;
  descriptionOr: string;
  entryFee: number;
  estimatedDuration: number;
  amenities: string[];
  images: string[];
}

export interface WristbandTransaction {
  id: string;
  touristId: string;
  touristName: string;
  amount: number;
  currency: 'ETB';
  merchantName: string;
  merchantNameAm: string;
  merchantNameOr: string;
  category: string;
  timestamp: string;
  location: string;
  paymentMethod: 'wristband_nfc';
  status: 'completed' | 'pending' | 'failed';
}

export interface Recommendation {
  id: string;
  touristId: string;
  type: 'destination' | 'restaurant' | 'activity' | 'route';
  title: string;
  titleAm: string;
  titleOr: string;
  description: string;
  descriptionAm: string;
  descriptionOr: string;
  confidence: number;
  estimatedPrice: number;
  currency: 'ETB';
  distance: number;
  duration: number;
  image: string;
  tags: string[];
}

// Ethiopian Tourist Names for realistic mock data
const ethiopianNames = [
  'Abebe Bikila', 'Almaz Ayana', 'Berhane Adere', 'Chaltu Gina', 'Dawit Fikre',
  'Eyob Tadesse', 'Fantaye Worku', 'Genet Zelalem', 'Hanan Mohamed', 'Iyasu Berhe',
  'Kalkidan Fenta', 'Lidya Tafere', 'Meron Getnet', 'Naod Alemayehu', 'Rahel Gidey'
];

// Generate mock tourists
export const mockTourists: Tourist[] = [
  {
    id: '1',
    name: 'John Smith',
    nationality: 'USA',
    purpose: 'Cultural Tourism',
    groupSize: 2,
    checkinDate: '2024-12-27T08:30:00Z',
    wristbandId: 'WB001',
    totalSpent: 2450,
    currency: 'ETB',
    status: 'active',
    preferences: ['Historical Sites', 'Photography', 'Local Cuisine'],
    avatar: '🇺🇸'
  },
  {
    id: '2',
    name: 'Marie Dubois',
    nationality: 'France',
    purpose: 'Adventure Tourism',
    groupSize: 1,
    checkinDate: '2024-12-27T09:15:00Z',
    wristbandId: 'WB002',
    totalSpent: 1850,
    currency: 'ETB',
    status: 'active',
    preferences: ['Hiking', 'Nature', 'Wildlife'],
    avatar: '🇫🇷'
  },
  {
    id: '3',
    name: 'Hiroshi Tanaka',
    nationality: 'Japan',
    purpose: 'Religious Tourism',
    groupSize: 4,
    checkinDate: '2024-12-27T07:45:00Z',
    wristbandId: 'WB003',
    totalSpent: 3200,
    currency: 'ETB',
    status: 'active',
    preferences: ['Churches', 'Meditation', 'Spiritual Journey'],
    avatar: '🇯🇵'
  },
  {
    id: '4',
    name: 'Abebe Bikila',
    nationality: 'Ethiopia',
    purpose: 'Leisure',
    groupSize: 3,
    checkinDate: '2024-12-27T10:00:00Z',
    wristbandId: 'WB004',
    totalSpent: 980,
    currency: 'ETB',
    status: 'active',
    preferences: ['Family Time', 'Local Culture', 'Traditional Food'],
    avatar: '🇪🇹'
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    nationality: 'Canada',
    purpose: 'Business',
    groupSize: 1,
    checkinDate: '2024-12-26T14:30:00Z',
    wristbandId: 'WB005',
    totalSpent: 1650,
    currency: 'ETB',
    status: 'completed',
    preferences: ['Conferences', 'Networking', 'City Tours'],
    avatar: '🇨🇦'
  }
];

// Generate mock destinations
export const mockDestinations: Destination[] = [
  {
    id: 'dest_1',
    name: 'Lalibela Rock Churches',
    nameAm: 'የላሊበላ ዐብያተ ክርስቲያናት',
    nameOr: 'Mana Kadhimaa Lalibela',
    location: 'Lalibela, Amhara Region',
    category: 'Religious Site',
    currentOccupancy: 145,
    maxCapacity: 300,
    avgRating: 4.8,
    totalVisitsToday: 89,
    revenue: 35600,
    currency: 'ETB',
    coordinates: [39.0473, 12.0332],
    description: 'UNESCO World Heritage site featuring 11 medieval churches carved from solid rock.',
    descriptionAm: 'በዩኔስኮ የተመዘገበ የዓለም ቅርስ ቦታ በድንጋይ ላይ የተቆረጡ ፷፩ የመካከለኛው ዘመን ዐብያተ ክርስቲያናት።',
    descriptionOr: 'Bakka Dhaalota Addunyaa UNESCOn galmeesse kan qabu, manneen sagadaa 11 bara kittileessa dhagaa irraa qoramanii ijaarame.',
    entryFee: 400,
    estimatedDuration: 240,
    amenities: ['Guided Tours', 'Prayer Areas', 'Museum', 'Gift Shop'],
    images: ['/images/lalibela-1.jpg', '/images/lalibela-2.jpg']
  },
  {
    id: 'dest_2',
    name: 'Entoto Park',
    nameAm: 'እንጦጦ ፓርክ',
    nameOr: 'Paarkii Entoto',
    location: 'Addis Ababa',
    category: 'Natural Park',
    currentOccupancy: 89,
    maxCapacity: 500,
    avgRating: 4.3,
    totalVisitsToday: 156,
    revenue: 22400,
    currency: 'ETB',
    coordinates: [38.7578, 9.0884],
    description: 'Beautiful natural park offering panoramic views of Addis Ababa with eucalyptus forests.',
    descriptionAm: 'የአዲስ አበባን ሰፊ እይታ የሚሰጥ ከባሕር ዛፍ ጫካ ጋር የተዋበ ቆንጆ የተፈጥሮ ፓርክ።',
    descriptionOr: 'Paarkii uumamaa bareedaa mul\'ata bal\'aa Finfinnee kan kennu, bosona baargamoo waliin.',
    entryFee: 150,
    estimatedDuration: 180,
    amenities: ['Hiking Trails', 'Viewpoints', 'Picnic Areas', 'Cafe'],
    images: ['/images/entoto-1.jpg', '/images/entoto-2.jpg']
  },
  {
    id: 'dest_3',
    name: 'Lake Hora Arsedi',
    nameAm: 'የሆራ አርሰዲ ሀይቅ',
    nameOr: 'Haroo Hora Arsedii',
    location: 'Debre Zeit, Oromia',
    category: 'Natural Attraction',
    currentOccupancy: 67,
    maxCapacity: 200,
    avgRating: 4.5,
    totalVisitsToday: 45,
    revenue: 8950,
    currency: 'ETB',
    coordinates: [38.9813, 8.7319],
    description: 'Crater lake perfect for boating, fishing, and bird watching with resort facilities.',
    descriptionAm: 'ለጀልባ፣ ለዓሣ ማጥመድ እና ለወፍ መመልከት ተስማሚ የመፈንጠቅ ሀይቅ በሪዞርት ተቋማት።',
    descriptionOr: 'Haroo crater kan bidiruu, qurxummii fi shimbirroota ilaaluuf mijatu, dhaabbilee boqonnaa waliin.',
    entryFee: 200,
    estimatedDuration: 300,
    amenities: ['Boating', 'Fishing', 'Bird Watching', 'Resort', 'Restaurant'],
    images: ['/images/hora-1.jpg', '/images/hora-2.jpg']
  },
  {
    id: 'dest_4',
    name: 'National Museum of Ethiopia',
    nameAm: 'የኢትዮጵያ ብሔራዊ ሙዚየም',
    nameOr: 'Muuziyeemii Biyya Itoophiyaa',
    location: 'Addis Ababa',
    category: 'Museum',
    currentOccupancy: 32,
    maxCapacity: 150,
    avgRating: 4.2,
    totalVisitsToday: 78,
    revenue: 15600,
    currency: 'ETB',
    coordinates: [38.7578, 9.0334],
    description: 'Home to Lucy fossil and rich Ethiopian cultural artifacts spanning millennia.',
    descriptionAm: 'የሉሲ ቅሪት እና ለሺዎች ዓመታት የሚዘረጋ ሀብታም የኢትዮጵያ ባህላዊ ቅርሶች መኖሪያ።',
    descriptionOr: 'Mana miʼa seenaa Lucy fi miʼoota aadaa Itoophiyaa humna guddaa waggoota kumaatamaaf diriirse.',
    entryFee: 200,
    estimatedDuration: 120,
    amenities: ['Audio Guide', 'Gift Shop', 'Research Library', 'Cafe'],
    images: ['/images/museum-1.jpg', '/images/museum-2.jpg']
  },
  {
    id: 'dest_5',
    name: 'Merkato',
    nameAm: 'መርካቶ',
    nameOr: 'Merkato',
    location: 'Addis Ababa',
    category: 'Market',
    currentOccupancy: 234,
    maxCapacity: 1000,
    avgRating: 4.0,
    totalVisitsToday: 456,
    revenue: 67800,
    currency: 'ETB',
    coordinates: [38.7245, 9.0145],
    description: 'One of Africa\'s largest open-air markets offering traditional crafts, spices, and textiles.',
    descriptionAm: 'ባህላዊ እደ ጥበቦችን፣ ቅመማቅመሞችን እና ጨርቆችን የሚያቀርብ በአፍሪካ ካሉት ትልልቅ የቁጥር ገበያዎች አንዱ።',
    descriptionOr: 'Gabaa bantii guddaa Afrikaa keessaa tokko kan hojii harkaa aadaa, urgooftuu fi quncee bilisummaa dhiheessu.',
    entryFee: 0,
    estimatedDuration: 180,
    amenities: ['Shopping', 'Traditional Crafts', 'Food Court', 'Currency Exchange'],
    images: ['/images/merkato-1.jpg', '/images/merkato-2.jpg']
  },
  {
    id: 'dest_6',
    name: 'Aksum Obelisks',
    nameAm: 'የአክሱም ሐውልቶች',
    nameOr: 'Siidaawwan Aksuum',
    location: 'Aksum, Tigray Region',
    category: 'Historical Site',
    currentOccupancy: 78,
    maxCapacity: 400,
    avgRating: 4.7,
    totalVisitsToday: 112,
    revenue: 44800,
    currency: 'ETB',
    coordinates: [38.7230, 14.1280],
    description: 'Ancient granite stelae, some over 20 meters tall, marking royal graves from the Kingdom of Aksum.',
    descriptionAm: 'ከአክሱም መንግሥት ዘመን የመንግሥት መቃብሮችን የሚያመለክቱ ከ20 ሜትር በላይ ቁመት ያላቸው ጥንታዊ የግራናይት ሐውልቶች።',
    descriptionOr: 'Siidaawwan gaara garaa dheeraan kan meetira 20 ol ta\'an, awwaala mootummaa Mootummaa Aksuum agarsiisan.',
    entryFee: 400,
    estimatedDuration: 180,
    amenities: ['Museum', 'Guided Tours', 'Archaeological Site', 'Gift Shop'],
    images: ['/images/aksum-1.jpg', '/images/aksum-2.jpg']
  },
  {
    id: 'dest_7',
    name: 'Simien Mountains National Park',
    nameAm: 'የስሜን ተራሮች ብሔራዊ ፓርክ',
    nameOr: 'Paarkii Biyyaa Tulluuwwan Simien',
    location: 'Amhara Region',
    category: 'National Park',
    currentOccupancy: 156,
    maxCapacity: 800,
    avgRating: 4.9,
    totalVisitsToday: 89,
    revenue: 35600,
    currency: 'ETB',
    coordinates: [38.0000, 13.2500],
    description: 'UNESCO World Heritage site with dramatic landscapes, endemic wildlife including Gelada baboons.',
    descriptionAm: 'በዩኔስኮ የተመዘገበ የዓለም ቅርస ቦታ አስደናቂ የተፈጥሮ ገጽታዎች እና ጌላዳ ዝንጀሮዎችን ጨምሮ የተለዩ የዱር እንስሳት።',
    descriptionOr: 'Bakka dhaalota addunyaa UNESCO kan mul\'ata uumamaa ajaa\'ibaa fi bineensota addaa kan akka raayota Gelada of keessaa qabu.',
    entryFee: 500,
    estimatedDuration: 480,
    amenities: ['Trekking', 'Wildlife Viewing', 'Camping', 'Guide Services'],
    images: ['/images/simien-1.jpg', '/images/simien-2.jpg']
  },
  {
    id: 'dest_8',
    name: 'Danakil Depression',
    nameAm: 'የዳናክል ምድረ በዳ',
    nameOr: 'Boolla Danakil',
    location: 'Afar Region',
    category: 'Geological Wonder',
    currentOccupancy: 45,
    maxCapacity: 120,
    avgRating: 4.6,
    totalVisitsToday: 23,
    revenue: 11500,
    currency: 'ETB',
    coordinates: [40.3000, 14.2417],
    description: 'One of the hottest and lowest places on Earth, featuring active volcanoes, salt formations, and colorful mineral deposits.',
    descriptionAm: 'በምድር ላይ ካሉት በጣም ሞቃታማ እና ዝቅተኛ ቦታዎች አንዱ፣ ንቁ እሳተ ገሞራዎች፣ የጨው ዋጣዎች እና ባለ ቀለም ማዕድን ክምችቶች ያሉት።',
    descriptionOr: 'Iddoowwan lafarra jiran keessaa kan ho\'aa fi gadi aanaa ta\'e tokko, kan tulluuwwan ibiddaa ka\'umoo, midhaan soogiddaa fi kuusaa albuudaa halluu garaagaraa qabu.',
    entryFee: 800,
    estimatedDuration: 720,
    amenities: ['Expedition Tours', 'Geological Tours', 'Photography', 'Expert Guides'],
    images: ['/images/danakil-1.jpg', '/images/danakil-2.jpg']
  },
  {
    id: 'dest_9',
    name: 'Harar Jugol',
    nameAm: 'የሐረር ጁጎል',
    nameOr: 'Jugol Hararii',
    location: 'Harari Region',
    category: 'Historic City',
    currentOccupancy: 234,
    maxCapacity: 600,
    avgRating: 4.4,
    totalVisitsToday: 178,
    revenue: 71200,
    currency: 'ETB',
    coordinates: [42.1286, 9.3111],
    description: 'UNESCO World Heritage fortified historic town, considered the fourth holiest city in Islam.',
    descriptionAm: 'በዩኔስኮ የተመዘገበ በግንብ የተከበበ ታሪካዊ ከተማ፣ በእስልምና አራተኛው ቅዱስ ከተማ ተብሎ ይታሰባል።',
    descriptionOr: 'Magaalaa seenaa dallaa ittiin marsame kan UNESCO galmeesse, magaalaa qulqulluu Islaamaa afuraffaa jedhamee yaadama.',
    entryFee: 300,
    estimatedDuration: 240,
    amenities: ['Cultural Tours', 'Traditional Markets', 'Mosques', 'Coffee Ceremony'],
    images: ['/images/harar-1.jpg', '/images/harar-2.jpg']
  },
  {
    id: 'dest_10',
    name: 'Omo Valley',
    nameAm: 'የኦሞ ሸለቆ',
    nameOr: 'Sulula Omo',
    location: 'Southern Nations Region',
    category: 'Cultural Heritage',
    currentOccupancy: 67,
    maxCapacity: 300,
    avgRating: 4.5,
    totalVisitsToday: 45,
    revenue: 18000,
    currency: 'ETB',
    coordinates: [36.0000, 5.5000],
    description: 'Home to diverse indigenous tribes with unique cultures, traditions, and ceremonial practices.',
    descriptionAm: 'ልዩ ባህሎች፣ ወጎች እና ሥነ ሥርዓተ ድርጊቶች ያላቸው የተለያዩ የአገር ውስጥ ጎሳዎች መኖሪያ።',
    descriptionOr: 'Balbala saboota dhalootaa garaagaraa aadaa, duudhaa fi mallattoowwan sirna addaa qaban.',
    entryFee: 450,
    estimatedDuration: 360,
    amenities: ['Cultural Tours', 'Photography', 'Local Guides', 'Traditional Ceremonies'],
    images: ['/images/omo-1.jpg', '/images/omo-2.jpg']
  },
  {
    id: 'dest_11',
    name: 'Blue Nile Falls',
    nameAm: 'የአባይ ፏፏቴ',
    nameOr: 'Lolaa Abbayyaa',
    location: 'Amhara Region',
    category: 'Natural Wonder',
    currentOccupancy: 123,
    maxCapacity: 500,
    avgRating: 4.3,
    totalVisitsToday: 87,
    revenue: 26100,
    currency: 'ETB',
    coordinates: [37.5833, 11.5000],
    description: 'Spectacular waterfall on the Blue Nile River, locally known as Tis Issat meaning "smoking water".',
    descriptionAm: 'በአባይ ወንዝ ላይ የሚገኝ አስደናቂ ፏፏቴ፣ በአካባቢው "ትስ እሳት" ማለት "የሚያጨስ ውሃ" በሚል ይታወቃል።',
    descriptionOr: 'Lolaa ajaa\'ibaa laga Abbayyaa irratti argamu, naannoo sanatti "Tis Issat" jedhame kan "bishaan dheebu" jechuudha.',
    entryFee: 300,
    estimatedDuration: 150,
    amenities: ['Boat Tours', 'Hiking Trails', 'Photography', 'Picnic Areas'],
    images: ['/images/bluenile-1.jpg', '/images/bluenile-2.jpg']
  },
  {
    id: 'dest_12',
    name: 'Bale Mountains National Park',
    nameAm: 'የባሌ ተራሮች ብሔራዊ ፓርክ',
    nameOr: 'Paarkii Biyyaa Tulluuwwan Baalee',
    location: 'Oromia Region',
    category: 'National Park',
    currentOccupancy: 89,
    maxCapacity: 400,
    avgRating: 4.6,
    totalVisitsToday: 56,
    revenue: 22400,
    currency: 'ETB',
    coordinates: [39.7500, 7.0000],
    description: 'High-altitude plateau with endemic species including Ethiopian wolves and unique alpine vegetation.',
    descriptionAm: 'የኢትዮጵያ ተኩላዎችን እና ልዩ የተራራ ተክሎችን ጨምሮ የተለዩ ዝርያዎች ያሉት ከፍተኛ ቦታ።',
    descriptionOr: 'Lafti ol\'aanaa kan jala nama hin seenne kan yeekoota addaa akka yeekota Itoophiyaa fi biqiltoota tulluu addaa of keessaa qabu.',
    entryFee: 400,
    estimatedDuration: 300,
    amenities: ['Wildlife Viewing', 'Hiking', 'Bird Watching', 'Research Center'],
    images: ['/images/bale-1.jpg', '/images/bale-2.jpg']
  },
  {
    id: 'dest_13',
    name: 'Awash National Park',
    nameAm: 'የአዋሽ ብሔራዊ ፓርክ',
    nameOr: 'Paarkii Biyyaa Awaash',
    location: 'Afar/Oromia Region',
    category: 'National Park',
    currentOccupancy: 167,
    maxCapacity: 600,
    avgRating: 4.2,
    totalVisitsToday: 134,
    revenue: 40200,
    currency: 'ETB',
    coordinates: [40.0000, 8.8333],
    description: 'Diverse wildlife sanctuary with hot springs, grasslands, and the spectacular Awash Falls.',
    descriptionAm: 'ሞቃታማ ምንጮች፣ የሳር ሜዳዎች እና አስደናቂው የአዋሽ ፏፏቴ ያሉት የተለያዩ የዱር እንስሳት መጠጊያ።',
    descriptionOr: 'Daangaa bineensotaa garaagaraa kan burqaawwan ho\'aa, dirreewwan margaa fi lolaa Awaash ajaa\'ibaa qabu.',
    entryFee: 350,
    estimatedDuration: 240,
    amenities: ['Safari Tours', 'Hot Springs', 'Bird Watching', 'Camping'],
    images: ['/images/awash-1.jpg', '/images/awash-2.jpg']
  },
  {
    id: 'dest_14',
    name: 'Gheralta Mountains',
    nameAm: 'የገራልታ ተራሮች',
    nameOr: 'Tulluuwwan Geralta',
    location: 'Tigray Region',
    category: 'Religious/Adventure',
    currentOccupancy: 56,
    maxCapacity: 200,
    avgRating: 4.8,
    totalVisitsToday: 34,
    revenue: 13600,
    currency: 'ETB',
    coordinates: [39.4833, 14.1000],
    description: 'Rock-hewn churches built into cliff faces, offering spectacular views and spiritual experiences.',
    descriptionAm: 'በተራራ ገፆች ላይ የተቆረጡ ዐብያተ ክርስቲያናት፣ አስደናቂ እይታዎች እና መንፈሳዊ ተሞክሮዎች የሚሰጡ።',
    descriptionOr: 'Manneen sagadaa dhagaa keessaa qoramanii ijaaraman, mul\'ata ajaa\'ibaa fi muuxannoo hafuuraa kennan.',
    entryFee: 450,
    estimatedDuration: 300,
    amenities: ['Rock Climbing', 'Church Tours', 'Photography', 'Cultural Heritage'],
    images: ['/images/gheralta-1.jpg', '/images/gheralta-2.jpg']
  },
  {
    id: 'dest_15',
    name: 'Sof Omar Caves',
    nameAm: 'የሶፍ ኦማር ዋሻዎች',
    nameOr: 'Holqoota Sof Umar',
    location: 'Oromia Region',
    category: 'Natural Wonder',
    currentOccupancy: 78,
    maxCapacity: 250,
    avgRating: 4.4,
    totalVisitsToday: 67,
    revenue: 20100,
    currency: 'ETB',
    coordinates: [40.8500, 7.4500],
    description: 'Spectacular limestone cave system, one of the longest in Africa, with underground rivers and chambers.',
    descriptionAm: 'በአፍሪካ ካሉት ረጅሞች አንዱ የሆነ አስደናቂ የኖራ ሸንጎ ዋሻ ስርዓት፣ የከርሰ ምድር ወንዞች እና ክፍሎች ያሉት።',
    descriptionOr: 'Sirni holqaa dhagaa nooraa ajaa\'ibaa, Afrikaa keessatti dheeraa ta\'e tokko, kan lageen fi kutaawwan lafa jalaa qabu.',
    entryFee: 350,
    estimatedDuration: 180,
    amenities: ['Cave Tours', 'Underground Rivers', 'Photography', 'Speleology'],
    images: ['/images/sofomar-1.jpg', '/images/sofomar-2.jpg']
  }
];

// Generate mock wristband transactions
export const mockTransactions: WristbandTransaction[] = [
  {
    id: 'tx_1',
    touristId: '1',
    touristName: 'John Smith',
    amount: 150,
    currency: 'ETB',
    merchantName: 'Lalibela Souvenir Shop',
    merchantNameAm: 'የላሊበላ መታሰቢያ ሱቅ',
    merchantNameOr: 'Suuqa Yaadachiisaa Lalibela',
    category: 'Souvenirs',
    timestamp: '2024-12-27T11:30:00Z',
    location: 'Lalibela Rock Churches',
    paymentMethod: 'wristband_nfc',
    status: 'completed'
  },
  {
    id: 'tx_2',
    touristId: '1',
    touristName: 'John Smith',
    amount: 85,
    currency: 'ETB',
    merchantName: 'Traditional Coffee House',
    merchantNameAm: 'ባህላዊ ቡና ቤት',
    merchantNameOr: 'Mana Buna Aadaa',
    category: 'Food & Beverage',
    timestamp: '2024-12-27T13:15:00Z',
    location: 'Lalibela Town Center',
    paymentMethod: 'wristband_nfc',
    status: 'completed'
  },
  {
    id: 'tx_3',
    touristId: '2',
    touristName: 'Marie Dubois',
    amount: 200,
    currency: 'ETB',
    merchantName: 'Mountain Gear Rental',
    merchantNameAm: 'የተራራ መሳሪያ ኪራይ',
    merchantNameOr: 'Kiraa Meeshaa Tulluu',
    category: 'Equipment Rental',
    timestamp: '2024-12-27T09:45:00Z',
    location: 'Entoto Park',
    paymentMethod: 'wristband_nfc',
    status: 'completed'
  },
  {
    id: 'tx_4',
    touristId: '3',
    touristName: 'Hiroshi Tanaka',
    amount: 300,
    currency: 'ETB',
    merchantName: 'Spiritual Books & Artifacts',
    merchantNameAm: 'መንፈሳዊ መጻሕፍት እና ቅርሶች',
    merchantNameOr: 'Kitaabotaa fi Miʼa Hafuura',
    category: 'Religious Items',
    timestamp: '2024-12-27T14:20:00Z',
    location: 'Lalibela Rock Churches',
    paymentMethod: 'wristband_nfc',
    status: 'completed'
  },
  {
    id: 'tx_5',
    touristId: '4',
    touristName: 'Abebe Bikila',
    amount: 120,
    currency: 'ETB',
    merchantName: 'Family Restaurant',
    merchantNameAm: 'የቤተሰብ ምግብ ቤት',
    merchantNameOr: 'Mana Nyaataa Maatii',
    category: 'Food & Beverage',
    timestamp: '2024-12-27T12:00:00Z',
    location: 'Entoto Park',
    paymentMethod: 'wristband_nfc',
    status: 'completed'
  }
];

// Generate mock recommendations
export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec_1',
    touristId: '1',
    type: 'destination',
    title: 'Visit Axum Obelisks',
    titleAm: 'የአክሱም ሐውልቶችን ጎብኙ',
    titleOr: 'Siidaa Aksuum daawwadha',
    description: 'Ancient stelae and archaeological wonders in the historic city of Axum.',
    descriptionAm: 'በአክሱም ታሪካዊ ከተማ ውስጥ ጥንታዊ ሐውልቶች እና የአርኪዮሎጂ ድንቆች።',
    descriptionOr: 'Siidaawwan durii fi dinqiiwwan qorannoo seenaa magaalaa Aksuum keessatti.',
    confidence: 0.92,
    estimatedPrice: 450,
    currency: 'ETB',
    distance: 2.3,
    duration: 180,
    image: '/images/axum.jpg',
    tags: ['Historical', 'UNESCO', 'Ancient']
  },
  {
    id: 'rec_2',
    touristId: '2',
    type: 'activity',
    title: 'Simien Mountains Trekking',
    titleAm: 'የስሜን ተራሮች ጉዞ',
    titleOr: 'Deemsa Tulluuwwan Simien',
    description: 'Multi-day trekking adventure in the UNESCO World Heritage Simien Mountains.',
    descriptionAm: 'በዩኔስኮ የዓለም ቅርስ ስሜን ተራሮች ውስጥ ባለብዙ ቀን ጉዞ ጀብዱ።',
    descriptionOr: 'Adeemsa guyyoota hedduuf itti fufu Tulluuwwan Simien DHQ UNESCO keessatti.',
    confidence: 0.88,
    estimatedPrice: 1200,
    currency: 'ETB',
    distance: 15.7,
    duration: 480,
    image: '/images/simien.jpg',
    tags: ['Adventure', 'Nature', 'Wildlife', 'Trekking']
  },
  {
    id: 'rec_3',
    touristId: '3',
    type: 'destination',
    title: 'Debre Damo Monastery',
    titleAm: 'የደብረ ዳሞ ገዳም',
    nameOr: 'Gadaamoo Dabre Damoo',
    description: 'Ancient monastery accessible only by rope climb, offering spiritual experience.',
    descriptionAm: 'በሐብል መውጣት ብቻ የሚደረስበት ጥንታዊ ገዳም፣ መንፈሳዊ ተሞክሮ የሚሰጥ።',
    descriptionOr: 'Gadaamoo durii funyoo qofaan ol bahuu dandaʼamu, muuxannoo hafuuraa kennu.',
    confidence: 0.85,
    estimatedPrice: 350,
    currency: 'ETB',
    distance: 8.2,
    duration: 300,
    image: '/images/debre-damo.jpg',
    tags: ['Religious', 'Adventure', 'Historical', 'Monastery']
  }
];

// Additional mock data for analytics
export const mockAnalytics = {
  dailyVisitors: 342,
  totalRevenue: 156780,
  averageSpending: 458,
  satisfactionScore: 4.3,
  occupancyRate: 67,
  popularDestinations: mockDestinations.slice(0, 3),
  recentTransactions: mockTransactions.slice(0, 5),
  wristbandAdoption: 89, // percentage
  averageStayDuration: 4.2, // hours
  repeatVisitorRate: 23, // percentage
  currency: 'ETB' as const
};

// Language options
export const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
  { code: 'or', name: 'Oromo', native: 'Afaan Oromoo', flag: '🇪🇹' }
];

// Demo scenarios for wristband showcase
export const demoScenarios = [
  {
    id: 'scenario_1',
    title: 'Tourist Registration & Wristband Linking',
    titleAm: 'የቱሪስት ምዝገባ እና መሳሪያ ግንኙነት',
    titleOr: 'Galmee Turizimii fi Walqabsiisa Meeshaa',
    steps: [
      'Tourist arrives at Lalibela',
      'Quick registration (< 2 minutes)',
      'NFC wristband linking',
      'Wallet setup with 2000 ETB',
      'Entry to rock churches'
    ]
  },
  {
    id: 'scenario_2', 
    title: 'Seamless Payments & Recommendations',
    titleAm: 'ቀላል ክፍያዎች እና ምክሮች',
    titleOr: 'Kaffaltii Salphaa fi Gorsaawwan',
    steps: [
      'Buy souvenirs with wristband tap',
      'AI recommends nearby restaurant',
      'Order traditional coffee',
      'Real-time spending tracking',
      'Personalized next destination'
    ]
  },
  {
    id: 'scenario_3',
    title: 'Multi-language Experience',
    titleAm: 'ባለብዙ ቋንቋ ተሞክሮ',
    titleOr: 'Muuxannoo Afaanota Hedduu',
    steps: [
      'Switch to Amharic interface',
      'Audio guide in Oromo',
      'Multilingual recommendations',
      'Local language transactions',
      'Cultural context explanations'
    ]
  }
];
