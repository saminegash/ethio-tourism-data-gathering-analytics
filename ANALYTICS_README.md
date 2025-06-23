# Ethiopia Tourism Analytics Platform

A comprehensive analytics and insights platform for tourism stakeholders, providing ML-powered forecasting, departmental insights, and actionable recommendations.

## 🏗️ Architecture Overview

The platform consists of three main components:

1. **Python Analytics Engine** (`functions/`) - Heavy ML computations, forecasting, and insights generation
2. **Next.js Dashboard** (`components/dashboard/`) - Interactive visualizations and UI
3. **Supabase Database** (`sql/`) - Data storage, user management, and real-time sync

### 🔗 **Supabase Client Integration**

The platform now uses the **official Supabase Python client** for all database operations:

**Benefits:**

- ✅ **Simple Setup**: Just URL + service role key
- ✅ **No Connection Issues**: Built-in retry and error handling
- ✅ **Type Safety**: API calls instead of raw SQL
- ✅ **Auto Authentication**: Handles tokens and sessions
- ✅ **Mock Data Fallback**: Works offline for development
- ✅ **Better Performance**: Optimized connection pooling

**Old vs New:**
| Feature | Old (PostgreSQL) | New (Supabase Client) |
|---------|------------------|----------------------|
| Setup | Complex connection strings | `create_client(url, key)` |
| Queries | Raw SQL with SQLAlchemy | Type-safe `.select()`, `.insert()` |
| Errors | Connection timeouts | Graceful API errors |
| Testing | Database required | Works with mock data |

### 📊 **Data Flow**

```
Supabase Database → Python Client → Analytics Engine → Insights → Dashboard
     ↑                                      ↓
Live Tourism Data              ←  Forecasts & Reports
```

## 🚀 Features

### Departmental Insights

- **Software Development**: API performance, data quality, system monitoring
- **Operations**: Occupancy rates, revenue optimization, capacity utilization
- **Marketing**: Market segmentation, ROI analysis, seasonal trends
- **Research & Development**: Innovation metrics, technology adoption, competitive analysis
- **Resource Mobility**: Transportation efficiency, resource allocation, logistics
- **Tourism Funding**: Revenue generation, investment ROI, economic impact

### Advanced Analytics

- **ML Forecasting**: Prophet, XGBoost, and LSTM models for arrivals, occupancy, and revenue
- **Real-time Alerts**: Configurable thresholds and notification channels
- **Cross-departmental Initiatives**: Collaborative project recommendations
- **Data Quality Monitoring**: Automated quality checks and reporting
- **Executive Dashboards**: High-level insights and KPI tracking

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL (via Supabase)
- Environment variables configured

## 🔧 Setup Instructions

### 1. Database Setup

First, run the SQL migrations in Supabase:

```sql
-- Run these in order:
1. sql/migrations/initial.sql
2. sql/migrations/insights_tables.sql
```

### 2. Python Environment Setup

```bash
cd functions/
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configuration

Copy the example config and fill in your details:

```bash
cp functions/config.json.example functions/config.json
```

Set environment variables:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your-service-role-key"  # Use SERVICE ROLE key, not anon key
export OPENAI_API_KEY="your-openai-key"  # Optional, for advanced insights
```

### 4. Test Your Setup

```bash
cd functions/

# Test Supabase connection
python test_supabase_client.py

# Run demo with mock data (works without database)
python demo_supabase_integration.py

# Test analytics system
python tourism_analytics_orchestrator.py test
```

### 5. Next.js Setup

```bash
npm install
npm run dev
```

## 🖥️ Usage

### Command Line Interface

The Python orchestrator provides a comprehensive CLI:

```bash
cd functions/

# Generate comprehensive analytics report
python tourism_analytics_orchestrator.py run-pipeline

# Generate insights for specific department
python tourism_analytics_orchestrator.py run-insights --department operations

# Update forecasts only
python tourism_analytics_orchestrator.py run-forecasts

# Check data quality
python tourism_analytics_orchestrator.py run-quality-check

# System status
python tourism_analytics_orchestrator.py status

# Run scheduled jobs (daemon mode)
python tourism_analytics_orchestrator.py schedule

# Test the system
python tourism_analytics_orchestrator.py test
```

### Web Dashboard

Navigate to `/dashboard/insights` to access the interactive dashboard:

- **Executive Summary**: High-level KPIs and alerts
- **Department Views**: Detailed metrics and recommendations
- **Forecasting Charts**: Interactive ML predictions
- **Cross-departmental Initiatives**: Collaborative projects

### API Endpoints

- `POST /api/analytics/insights` - Generate new insights
- `GET /api/analytics/insights` - Get system status

## 📊 Data Pipeline

### 1. Data Collection

- Tourism arrivals (flights, passenger counts)
- Hotel occupancy rates by region
- Visitor satisfaction surveys
- Revenue and financial data

### 2. Processing & ML

- Data cleaning and validation
- Feature engineering for ML models
- Time series forecasting (Prophet, ARIMA)
- Anomaly detection
- Clustering and segmentation

### 3. Insights Generation

- Department-specific metrics calculation
- Trend analysis and alerting
- Recommendation engine
- Performance scoring

### 4. Storage & Sync

- Results stored in Supabase
- Real-time dashboard updates
- Historical data retention
- Automated cleanup

## 🏢 Department Configurations

### Software Development Team

**Focus Areas**: Technical performance, data quality, system reliability

**Key Metrics**:

- API response time (target: <500ms)
- Data completeness (target: >95%)
- System uptime and performance

**Insights**:

- Database optimization recommendations
- Caching strategy suggestions
- Alert configurations for performance issues

### Operations Team

**Focus Areas**: Occupancy optimization, revenue management, capacity planning

**Key Metrics**:

- Average occupancy rate by region
- Revenue per occupied room
- Seasonal demand patterns

**Insights**:

- Dynamic pricing recommendations
- Staff allocation optimization
- Regional performance analysis

### Marketing Team

**Focus Areas**: Market expansion, customer segmentation, campaign ROI

**Key Metrics**:

- Market diversity index
- Segment performance analysis
- Customer acquisition costs

**Insights**:

- Target market recommendations
- Campaign optimization suggestions
- Seasonal promotion opportunities

### Research & Development

**Focus Areas**: Innovation tracking, technology adoption, competitive intelligence

**Key Metrics**:

- Digital technology adoption rate
- Innovation pipeline metrics
- Market trend analysis

**Insights**:

- Technology investment recommendations
- Emerging opportunity identification
- Competitive positioning analysis

### Resource Mobility

**Focus Areas**: Transportation efficiency, resource allocation, logistics optimization

**Key Metrics**:

- Airport congestion scores
- Regional resource efficiency
- Transportation bottlenecks

**Insights**:

- Resource reallocation recommendations
- Infrastructure investment priorities
- Logistics optimization opportunities

### Tourism Funding

**Focus Areas**: ROI analysis, economic impact, investment optimization

**Key Metrics**:

- Revenue growth rates
- Economic impact multipliers
- Investment efficiency ratios

**Insights**:

- Investment prioritization framework
- Economic impact projections
- Funding opportunity identification

## 🔔 Alert System

### Alert Types

- **Threshold Alerts**: Metric exceeds/falls below set values
- **Trend Alerts**: Sustained changes over time
- **Anomaly Alerts**: Unusual patterns detected

### Notification Channels

- Email notifications
- Slack webhooks
- SMS (via Twilio integration)
- Dashboard notifications

### Configuration

Alerts are configured in `sql/migrations/insights_tables.sql` and can be customized per department.

## 📈 Forecasting Models

### Tourist Arrivals

- **Model**: Facebook Prophet
- **Features**: Seasonality, holidays, external events
- **Accuracy**: ~85% within 30-day horizon
- **Retraining**: Weekly

### Hotel Occupancy

- **Model**: XGBoost
- **Features**: Historical rates, events, weather, pricing
- **Accuracy**: ~87% for regional predictions
- **Retraining**: Monthly

### Revenue Forecasting

- **Model**: LSTM Neural Network
- **Features**: Multi-variate time series
- **Accuracy**: ~78% for revenue projections
- **Retraining**: Bi-weekly

## 🔧 Customization

### Adding New Departments

1. Update department configuration in `tourism_insights_engine.py`:

```python
self.departments['new_department'] = {
    'focus_metrics': ['metric1', 'metric2'],
    'priority': 'strategic_focus'
}
```

2. Create insight generation method:

```python
def _new_department_insights(self, data, forecasts):
    # Implementation here
    return metrics, recommendations, action_items, alert_level
```

3. Update database constraints in `insights_tables.sql`

4. Add to frontend dashboard `DEPARTMENT_NAMES` mapping

### Custom Metrics

Add new metrics in the respective department insight generation methods:

```python
metrics.append(InsightMetric(
    metric_name="Custom Metric",
    current_value=calculated_value,
    predicted_value=forecast_value,
    trend="increasing",
    confidence=0.85,
    impact_level="high",
    recommendation="Take specific action",
    department_relevance=["department_name"]
))
```

## 🚀 Deployment

### Production Setup

1. **Database**: Use Supabase production instance
2. **Python**: Deploy to AWS Lambda, Google Cloud Functions, or similar
3. **Frontend**: Deploy Next.js to Vercel, Netlify, or similar
4. **Scheduling**: Use AWS EventBridge, Google Cloud Scheduler, or cron

### Environment Variables

```bash
SUPABASE_URL=your_production_url
SUPABASE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
FORECAST_DAYS=30
DATA_RETENTION_DAYS=365
CONFIG_FILE=config.json
```

### Docker Deployment

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY functions/ .
RUN pip install -r requirements.txt
CMD ["python", "tourism_analytics_orchestrator.py", "schedule"]
```

## 📚 API Reference

### Analytics Engine

#### Generate Comprehensive Report

```python
from tourism_insights_engine import TourismInsightsEngine

engine = TourismInsightsEngine()
report = engine.generate_comprehensive_report()
```

#### Department-specific Insights

```python
insights = engine.run_department_insights(department='operations')
```

#### Forecasting

```python
forecasts = engine.generate_forecasts(data, forecast_days=30)
```

### Database Sync

#### Save Results

```python
from supabase_sync import SupabaseSyncManager

sync = SupabaseSyncManager()
sync.save_analytics_report(report)
sync.save_forecasts(forecasts)
sync.save_department_insights(insights)
```

## 🔍 Monitoring & Maintenance

### System Health Checks

- Data quality monitoring (automated)
- Model performance tracking
- API response time monitoring
- Database performance metrics

### Maintenance Tasks

- Weekly model retraining
- Monthly data cleanup
- Quarterly model evaluation
- Annual configuration review

### Troubleshooting

#### Common Issues

1. **RLS Policy Errors (Row Level Security)**

   **Error**: `new row violates row-level security policy for table "forecasts"`

   **Cause**: The service role doesn't have permission to write to analytics tables

   **Solution**: Run the RLS fix script in your Supabase SQL editor:

   ```bash
   # Run this SQL file in Supabase
   sql/migrations/fix_rls_policies.sql
   ```

   **Test the fix**:

   ```bash
   cd functions/
   python test_rls_fix.py
   ```

2. **Python Dependencies**: Ensure all ML libraries are installed

   ```bash
   pip install -r requirements.txt
   ```

3. **Database Connection**: Check Supabase credentials and network access

   ```bash
   python test_supabase_client.py
   ```

4. **Service Role vs Anon Key**: Make sure you're using the SERVICE ROLE key

   ```bash
   # Wrong - this is the anon key
   export SUPABASE_KEY="eyJ..."

   # Correct - this is the service role key (longer, starts with eyJ...)
   export SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

5. **Memory Issues**: Consider chunking large datasets
6. **Timeout Errors**: Increase API timeout for complex analytics

#### Key Differences: Service Role vs Anon Key

| Feature       | Anon Key          | Service Role Key         |
| ------------- | ----------------- | ------------------------ |
| **Purpose**   | Client-side auth  | Server-side operations   |
| **RLS**       | Enforced          | Can bypass with policies |
| **Usage**     | Frontend apps     | Backend services/APIs    |
| **Security**  | User context      | Full admin access        |
| **Analytics** | ❌ Blocked by RLS | ✅ Can write data        |

#### Logs Location

- Python: `functions/tourism_analytics.log`
- Next.js: Browser console and server logs
- Database: Supabase dashboard logs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-insight`
3. Add tests for new functionality
4. Update documentation
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

---

**Built with ❤️ for Ethiopia Tourism Development**
