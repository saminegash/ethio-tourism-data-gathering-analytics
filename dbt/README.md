# Ethiopia Tourism dbt Project

This dbt project transforms raw tourism data into analytics-ready models for the Ethiopia Tourism AI Platform.

## Project Structure

```
dbt/
├── models/
│   ├── staging/        # Raw data cleaning and standardization
│   ├── intermediate/   # Business logic transformations
│   └── marts/         # Final analytics models
├── macros/            # Reusable SQL functions
├── tests/             # Data quality tests
└── docs/              # Documentation
```

## Models Overview

### Staging Models (`models/staging/`)
- Clean and standardize raw data from various sources
- Apply consistent naming conventions
- Handle data type conversions
- Basic data quality checks

### Intermediate Models (`models/intermediate/`)
- Apply business logic transformations
- Create derived metrics
- Join related entities
- Prepare data for final marts

### Marts Models (`models/marts/`)
- Final analytics-ready tables
- Optimized for dashboard queries
- Aggregated metrics and KPIs
- Machine learning feature tables

## Key Models

### Core Analytics
- `dim_tourists` - Tourist dimension table
- `dim_destinations` - Destination and POI information
- `fact_visits` - Tourist visits and interactions
- `fact_transactions` - Payment and purchase data
- `fact_events` - All telemetry events

### Business Intelligence
- `tourist_journey` - Complete tourist journey analysis
- `destination_performance` - Destination metrics and KPIs
- `revenue_analysis` - Financial performance metrics
- `operational_metrics` - Operational efficiency indicators

### Machine Learning
- `ml_tourist_features` - Tourist behavior features
- `ml_destination_features` - Destination characteristics
- `ml_recommendation_training` - Training data for recommender
- `ml_forecasting_features` - Time series forecasting features

## Running dbt

### Prerequisites
```bash
pip install dbt-clickhouse
# or
pip install dbt-postgres
```

### Setup
```bash
# Initialize profiles
dbt init

# Test connection
dbt debug

# Install dependencies
dbt deps
```

### Development
```bash
# Run all models
dbt run

# Run specific model
dbt run --select tourist_journey

# Run tests
dbt test

# Generate documentation
dbt docs generate
dbt docs serve
```

### Production
```bash
# Full refresh
dbt run --full-refresh

# Run with specific target
dbt run --target prod
```

## Data Quality

### Tests
- Uniqueness constraints
- Not null checks
- Referential integrity
- Business rule validation
- Data freshness monitoring

### Monitoring
- Model run times
- Row count changes
- Data quality scores
- Freshness alerts

## Configuration

### profiles.yml
```yaml
tourism_analytics:
  target: dev
  outputs:
    dev:
      type: clickhouse
      host: localhost
      port: 9000
      user: default
      password: ""
      database: tourism_analytics
      schema: dbt_dev
    prod:
      type: clickhouse
      host: clickhouse-prod
      port: 9000
      user: dbt_user
      password: "{{ env_var('CLICKHOUSE_PASSWORD') }}"
      database: tourism_analytics
      schema: analytics
```

### dbt_project.yml
```yaml
name: 'tourism_analytics'
version: '1.0.0'
config-version: 2

model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]
seed-paths: ["seeds"]
macro-paths: ["macros"]
snapshot-paths: ["snapshots"]

target-path: "target"
clean-targets:
  - "target"
  - "dbt_packages"

models:
  tourism_analytics:
    staging:
      +materialized: view
      +schema: staging
    intermediate:
      +materialized: table
      +schema: intermediate
    marts:
      +materialized: table
      +schema: marts
      +indexes:
        - columns: ['date']
          type: 'btree'
```

## Best Practices

### Naming Conventions
- `stg_` prefix for staging models
- `int_` prefix for intermediate models
- `dim_` prefix for dimension tables
- `fact_` prefix for fact tables
- `ml_` prefix for ML feature tables

### Performance
- Use appropriate materializations
- Add indexes for frequently queried columns
- Partition large tables by date
- Use incremental models for large datasets

### Documentation
- Document all models and columns
- Include business logic explanations
- Add data lineage information
- Maintain up-to-date README files

## Deployment

### CI/CD Pipeline
```yaml
# .github/workflows/dbt.yml
name: dbt CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - run: pip install dbt-clickhouse
      - run: dbt deps
      - run: dbt run --target ci
      - run: dbt test --target ci
  
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - run: pip install dbt-clickhouse
      - run: dbt deps
      - run: dbt run --target prod
      - run: dbt test --target prod
```

### Monitoring
- Set up data quality alerts
- Monitor model run times
- Track data freshness
- Alert on test failures

## Support

For questions or issues:
1. Check the dbt documentation
2. Review model documentation
3. Contact the data team
4. Create an issue in the repository
