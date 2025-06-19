# Ethiopia Tourism Analytics Platform 🇪🇹

> **Hackathon MVP**: A comprehensive tourism analytics platform providing real-time insights into Ethiopia's tourism industry through data analysis, API integrations, and scalable cloud infrastructure.

## 🚀 Overview

This platform provides tourism stakeholders with actionable insights by analyzing:

- Flight arrival patterns and tourist influx
- Hotel occupancy rates and revenue optimization
- Tourist satisfaction and sentiment analysis
- Regional tourism trends and comparative analytics
- Predictive insights for capacity planning

### Key Features

- **🔐 Multi-tenant Architecture**: Role-based access control with organization-level data isolation
- **📊 Real-time Analytics**: Serverless data processing with sub-second response times
- **🌍 API-First Design**: RESTful APIs for seamless third-party integrations
- **💰 Usage-Based Pricing**: Flexible pricing tiers for different organizational needs
- **🔍 Advanced Analytics**: Trend analysis, regional comparisons, and predictive insights

## 📁 Directory Structure

```
.
├── sql/
│   └── migrations/
│       └── initial.sql          # Database schema with RLS policies
├── functions/
│   ├── data_analyzer.py         # Serverless analytics engine
│   └── requirements.txt         # Python dependencies
├── app/                         # Next.js frontend (existing)
├── package.json                 # Node.js dependencies
└── README.md                    # This file
```

## 🗄️ Database Setup

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- PostgreSQL 14+ (if using local setup)
- Valid Supabase project credentials

### Apply Database Migration

#### Option 1: Using Supabase CLI (Recommended)

```bash
# Initialize Supabase in your project
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push

# Or apply specific migration file
supabase db push sql/migrations/initial.sql
```

#### Option 2: Direct PostgreSQL Connection

```bash
# Connect to your database and apply migration
psql -h your-db-host -U your-username -d your-database -f sql/migrations/initial.sql

# Or using environment variables
export DATABASE_URL="postgresql://user:password@host:port/database"
psql $DATABASE_URL -f sql/migrations/initial.sql
```

#### Option 3: Supabase Dashboard

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to the SQL Editor
3. Copy and paste the contents of `sql/migrations/initial.sql`
4. Execute the migration

### Database Features

- **UUID Primary Keys**: All tables use UUID for globally unique identifiers
- **Row Level Security (RLS)**: Multi-tenant data isolation with role-based access
- **Foreign Key Constraints**: Data integrity across related tables
- **Performance Indexes**: Optimized for time-series and analytical queries
- **Audit Trail**: Automatic timestamp tracking for all records
- **Billing Integration**: Built-in API usage tracking for monetization

## ⚡ Serverless Analytics Engine

### Local Development

```bash
# Navigate to functions directory
cd functions

# Install dependencies
pip install -r requirements.txt

# Test locally
python data_analyzer.py
```

### AWS Lambda Deployment

#### Option 1: AWS CLI Deployment

```bash
# Create deployment package
cd functions
zip -r ../analytics-function.zip . -x "*.pyc" "__pycache__/*"

# Create Lambda function
aws lambda create-function \
  --function-name ethiopia-tourism-analytics \
  --runtime python3.9 \
  --role arn:aws:iam::your-account:role/lambda-execution-role \
  --handler data_analyzer.handler \
  --zip-file fileb://../analytics-function.zip \
  --timeout 30 \
  --memory-size 512

# Update function code (for updates)
aws lambda update-function-code \
  --function-name ethiopia-tourism-analytics \
  --zip-file fileb://../analytics-function.zip
```

#### Option 2: Serverless Framework

```bash
# Install Serverless Framework
npm install -g serverless

# Deploy function
serverless deploy --function data_analyzer
```

#### Option 3: AWS SAM

```bash
# Build and deploy using SAM
sam build
sam deploy --guided
```

### API Gateway Integration

```bash
# Create API Gateway integration
aws apigateway create-rest-api \
  --name ethiopia-tourism-api \
  --description "Tourism Analytics API"

# Configure Lambda proxy integration
aws apigateway put-integration \
  --rest-api-id your-api-id \
  --resource-id your-resource-id \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:region:lambda:path/2015-03-31/functions/arn:aws:lambda:region:account:function:ethiopia-tourism-analytics/invocations
```

## 🔌 API Usage Examples

### 1. Flight Arrivals Analysis

```bash
curl -X POST https://your-api-gateway-url/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "analysis_type": "arrivals_analysis",
    "format": "csv",
    "insights": true,
    "body": "flight_number,origin,timestamp,passenger_count,airline\nET301,London,2024-01-15 08:30:00,245,Ethiopian\nLH564,Frankfurt,2024-01-15 14:20:00,189,Lufthansa"
  }'
```

### 2. Hotel Occupancy Analysis

```bash
curl -X POST https://your-api-gateway-url/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "analysis_type": "occupancy_analysis",
    "format": "json",
    "insights": true,
    "body": {
      "data": [
        {"hotel_id": "hotel-123", "date": "2024-01-15", "total_rooms": 100, "occupied_rooms": 85, "region": "Addis Ababa"},
        {"hotel_id": "hotel-456", "date": "2024-01-15", "total_rooms": 50, "occupied_rooms": 42, "region": "Lalibela"}
      ]
    }
  }'
```

### 3. Regional Comparison

```bash
curl -X POST https://your-api-gateway-url/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "analysis_type": "regional_comparison",
    "format": "csv",
    "insights": true,
    "body": "region,metric,value,date\nAddis Ababa,arrivals,1250,2024-01-15\nLalibela,arrivals,340,2024-01-15"
  }'
```

## 💰 API Pricing & Business Model

### Pricing Tiers

| Tier           | Monthly Fee | API Calls/Month | Cost per Extra Call | Features                      |
| -------------- | ----------- | --------------- | ------------------- | ----------------------------- |
| **Free**       | $0          | 1,000           | $0.005              | Basic analytics, 1 region     |
| **Basic**      | $99         | 10,000          | $0.003              | All analytics, 3 regions      |
| **Premium**    | $299        | 50,000          | $0.002              | Priority support, all regions |
| **Enterprise** | Custom      | Unlimited       | $0.001              | Custom integrations, SLA      |

### Revenue Streams

1. **API Usage Fees**: Pay-per-call pricing for data analysis
2. **Data Integration**: Premium fees for connecting external data sources
3. **Custom Analytics**: Bespoke analysis and reporting services
4. **White-label Solutions**: Licensed platform for tourism boards
5. **Training & Consulting**: Implementation and optimization services

## 🏗️ Scalability & Architecture

### Horizontal Scaling

- **Serverless Functions**: Auto-scaling based on demand
- **Database Sharding**: Region-based data partitioning
- **CDN Integration**: Global content delivery for dashboards
- **Caching Layer**: Redis for frequently accessed analytics

### Integration Capabilities

#### Supported Data Sources

- **Airlines**: Ethiopian Airlines, Lufthansa, Emirates APIs
- **Hotels**: Booking.com, Expedia, local PMS systems
- **Tourism Boards**: Government tourism statistics
- **Weather Services**: Climate data for correlation analysis
- **Economic Indicators**: World Bank, IMF economic data

#### Partner Integration Examples

```python
# Example: Integrate with airline API
import requests

def fetch_airline_data(api_key, date_range):
    response = requests.get(
        f"https://api.ethiopianairlines.com/arrivals",
        headers={"Authorization": f"Bearer {api_key}"},
        params={"from": date_range[0], "to": date_range[1]}
    )
    return response.json()

# Example: Hotel occupancy from PMS
def fetch_hotel_occupancy(hotel_api_key, property_ids):
    return requests.post(
        "https://api.hotelpms.com/occupancy",
        headers={"API-Key": hotel_api_key},
        json={"properties": property_ids}
    ).json()
```

### Performance Optimization

- **Data Preprocessing**: ETL pipelines for large datasets
- **Parallel Processing**: Multi-threaded analysis for complex queries
- **Result Caching**: 15-minute cache for repetitive queries
- **Compression**: GZIP compression for API responses

## 🔐 Security & Compliance

### Authentication & Authorization

- **JWT Tokens**: Secure API access with expiring tokens
- **Row Level Security**: Database-level data isolation
- **API Rate Limiting**: Protection against abuse
- **Audit Logging**: Complete API usage tracking

### Data Privacy

- **GDPR Compliant**: Data anonymization and deletion capabilities
- **Encryption**: At-rest and in-transit data encryption
- **Backup Strategy**: Daily automated backups with 30-day retention

## 🚦 Getting Started

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ethio-tourism
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Configure your environment variables
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

### 3. Database Setup

```bash
# Apply database migration
supabase db push sql/migrations/initial.sql
```

### 4. Deploy Analytics Function

```bash
# Deploy to AWS Lambda
cd functions
zip -r analytics-function.zip .
aws lambda create-function \
  --function-name ethiopia-tourism-analytics \
  --runtime python3.9 \
  --handler data_analyzer.handler \
  --zip-file fileb://analytics-function.zip \
  --role arn:aws:iam::account:role/lambda-execution-role
```

### 5. Start Development Server

```bash
npm run dev
```

## 📊 Monitoring & Analytics

### Performance Metrics

- **API Response Time**: Target <500ms for 95th percentile
- **Database Query Performance**: Optimized indexes for <100ms queries
- **Error Rate**: Target <0.1% error rate
- **Uptime**: 99.9% availability SLA

### Business Metrics

- **Monthly Recurring Revenue (MRR)**: Track subscription growth
- **API Usage Growth**: Monitor call volume trends
- **Customer Acquisition Cost (CAC)**: Optimize marketing spend
- **Customer Lifetime Value (CLV)**: Maximize revenue per customer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.ethio-tourism-analytics.com](https://docs.ethio-tourism-analytics.com)
- **Support Email**: support@ethio-tourism-analytics.com
- **Discord Community**: [Join our Discord](https://discord.gg/ethio-tourism)
- **GitHub Issues**: Report bugs and request features

## 🎯 Roadmap

### Phase 1 (Current) - MVP

- ✅ Core database schema
- ✅ Serverless analytics engine
- ✅ Basic API endpoints
- 🔄 Web dashboard (Next.js)

### Phase 2 - Enhanced Analytics

- 📅 Machine learning predictions
- 📅 Real-time data streaming
- 📅 Advanced visualization
- 📅 Mobile application

### Phase 3 - Enterprise Features

- 📅 Multi-language support
- 📅 Custom white-label solutions
- 📅 Advanced integrations
- 📅 AI-powered insights

---

**Built with ❤️ for Ethiopia's Tourism Industry**
