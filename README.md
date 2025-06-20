# Ethiopia Tourism Analytics

A comprehensive data analytics platform for tourism insights in Ethiopia. Upload CSV data and get real-time analytics on arrivals, occupancy, visits, and customer satisfaction.

## Features

- **CSV Data Upload**: Easy drag-and-drop CSV file upload with automatic data processing
- **Real-time Analytics**: Instant data processing with Python analytics engine
- **Interactive Dashboards**: Beautiful, responsive charts using Chart.js
- **Theme Support**: Light, dark, and system theme modes with persistent preference
- **AI-Powered Insights**: Automated insights generation with trend detection
- **Multiple Analytics Types**: Arrivals, occupancy, visits, and customer satisfaction analysis

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js API routes, Python analytics engine
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Charts**: Chart.js with react-chartjs-2
- **Themes**: next-themes with automatic system detection
- **Package Manager**: pnpm

## Theme System

The application supports three theme modes:

- **Light Theme**: Traditional light interface with bright backgrounds
- **Dark Theme**: Modern dark interface optimized for low-light environments
- **System Theme**: Automatically follows your device's theme preference

### Theme Features

- **Persistent Preference**: Your theme choice is saved in local storage
- **System Detection**: Automatically detects and follows system theme changes
- **Smooth Transitions**: Elegant transitions between theme modes
- **Chart Integration**: Charts automatically adapt to the selected theme
- **Accessibility**: Optimized color contrast for both light and dark modes

The theme switcher is located in the top navigation bar and allows you to quickly switch between all three theme modes.

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- Python 3.8+
- pnpm
- Supabase account

### 2. Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# Install Python dependencies
pip install -r functions/requirements.txt
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Supabase Setup

1. Create a new Supabase project
2. Create a storage bucket named `tourism-data`
3. Create a table for analysis results:

```sql
CREATE TABLE analysis_results (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### 1. Upload CSV Data

Navigate to `/upload` and upload a CSV file with tourism data. Supported formats:

**Flight Arrivals Data:**

```csv
flight_number,origin,timestamp,passenger_count,airline
ET301,London,2024-01-15 08:30:00,245,Ethiopian Airlines
```

**Hotel Occupancy Data:**

```csv
hotel_id,date,total_rooms,occupied_rooms,region,revenue
HTL001,2024-01-15,100,85,Addis Ababa,12500
```

**Tourism Visits Data:**

```csv
attraction,visits,date,visitor_type,duration_days
Lalibela Churches,150,2024-01-15,International,3
```

**Customer Surveys Data:**

```csv
rating,sentiment,comments,visit_id
5,positive,Amazing experience!,VST001
```

### 2. View Analytics

After uploading, navigate to the respective dashboards:

- **Arrivals Dashboard** (`/dashboard/arrivals`): Flight arrivals, passenger volumes, airline performance
- **Occupancy Dashboard** (`/dashboard/occupancy`): Hotel occupancy rates, regional performance, revenue trends
- **Visits Dashboard** (`/dashboard/visits`): Attraction visits, dwell times, visitor demographics
- **Surveys Dashboard** (`/dashboard/surveys`): Customer satisfaction, ratings, sentiment analysis

### 3. Theme Switching

Use the theme switcher in the navigation bar to toggle between:

- ☀️ **Light mode**: Bright, traditional interface
- 🌙 **Dark mode**: Dark interface for low-light conditions
- 💻 **System mode**: Follows your device's theme preference

### 4. API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/upload-csv`: Upload and analyze CSV data

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── health/route.ts          # Health check endpoint
│   │   └── upload-csv/route.ts      # CSV upload and processing
│   │   └── dashboard/
│   │       ├── arrivals/page.tsx        # Flight arrivals dashboard
│   │       ├── occupancy/page.tsx       # Hotel occupancy dashboard
│   │       ├── visits/page.tsx          # Tourism visits dashboard
│   │       └── surveys/page.tsx         # Customer surveys dashboard
│   ├── upload/page.tsx              # CSV upload interface
│   ├── layout.tsx                   # Main layout with navigation
│   └── page.tsx                     # Landing page
├── components/
│   ├── theme-provider.tsx           # Theme provider component
│   └── theme-switcher.tsx           # Theme switcher UI component
├── functions/
│   ├── data_analyzer.py             # Python analytics engine
│   └── requirements.txt             # Python dependencies
├── sql/
│   └── migrations/initial.sql       # Database schema
└── package.json                     # Node.js dependencies
```

## Analytics Engine

The Python analytics engine (`functions/data_analyzer.py`) provides:

- **Data Processing**: Pandas-based CSV parsing and normalization
- **Multiple Analysis Types**: Arrivals, occupancy, satisfaction, trends, predictions
- **Insight Generation**: Automated actionable insights
- **AWS Lambda Compatible**: Can be deployed as serverless function

### Analysis Types

1. **Arrivals Analysis**: Flight patterns, passenger volumes, airline performance
2. **Occupancy Analysis**: Hotel occupancy rates, regional trends, revenue analysis
3. **Satisfaction Analysis**: Rating distributions, sentiment analysis, satisfaction scores
4. **Trend Analysis**: Time-based patterns, seasonality detection, growth trends
5. **Predictive Insights**: Combined analysis with forecasting capabilities

## Theme Configuration

The theme system is built using `next-themes` and Tailwind CSS:

### Tailwind Configuration

```javascript
// tailwind.config.ts
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  // ... other config
};
```

### Theme Provider Setup

```tsx
// app/layout.tsx
import { ThemeProvider } from "../components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Set environment variables in Vercel dashboard

### Supabase Setup

1. Enable Row Level Security on tables
2. Set up storage policies for file uploads
3. Configure database schemas using the SQL migrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.
