# Tourist Registration System

A streamlined system for quick tourist registration at Ethiopian tourism destinations.

## Overview

This system is designed to:

- ✅ Register tourists in under 1 minute using passport/national ID
- ✅ Integrate with external systems (Immigration, Fayda platform)
- ✅ Maintain privacy and consent-based data collection
- ✅ Provide basic analytics for registration data
- ✅ Support group registration and management

## System Architecture

### Database Schema

The system introduces several new tables to support tourist registration:

#### Core Tables

1. **`destinations`** - Tourist destinations (Wonchi, Lalibela, etc.)
2. **`tourists`** - Main tourist registration table
3. **`tourist_groups`** - Group management for families/tour groups
4. **`tourist_group_members`** - Links tourists to groups
5. **`destination_stats`** - Basic registration statistics

#### Key Features

- **Privacy-first design** with consent management
- **External data integration** (Immigration, Fayda)
- **Group registration support**
- **Role-based access control**
- **Basic analytics and reporting**

### API Endpoints

#### Tourist Registration

- `POST /api/tourists/register` - Register new tourist
- `GET /api/tourists/register?passport=...` - Search tourists

## Quick Start Guide

### 1. Run Database Migrations

```bash
# Apply the tourist registration system migration
psql -d your_database -f sql/migrations/tourist_registration_system.sql
```

### 2. Set Up Environment Variables

Ensure these are configured in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Access the Registration System

Navigate to `/register` in your application to access the tourist registration interface.

## How It Works

### Tourist Registration Process

1. **Document Scanning** (Optional)

   - Tourist presents passport or national ID
   - System scans document and extracts basic information
   - Falls back to manual entry if scanning unavailable

2. **Data Enhancement** (With Consent)

   - Fetches additional data from Immigration office
   - Retrieves information from Fayda platform
   - Merges data to reduce manual input

3. **Consent & Privacy**

   - Clear consent forms for data collection
   - Optional external data integration
   - Transparent privacy practices

4. **Registration Completion**
   - Creates tourist record in database
   - Auto-verification for streamlined process
   - Generates unique tourist ID

## Registration Interface

### Step 1: Document Processing

- **Scan Option**: Camera-based document scanning (simulated)
- **Manual Option**: Type information manually
- **Speed**: Designed for <1 minute completion

### Step 2: Information Verification

- Pre-filled data from scanning/external sources
- Required fields: name, nationality, document ID
- Optional fields for enhanced experience and analytics

### Step 3: Consent & Privacy

- Clear explanations of data usage
- Separate consent for external data fetching
- Transparent privacy practices

## Privacy & Consent

### Data Collection Consent

- Immigration data fetching (optional)
- Fayda platform integration (optional)
- Clear explanation of data sources and usage

### Data Protection

- Role-based access control
- Data retention policies
- GDPR-compliant practices

## Analytics & Insights

### Basic Statistics

- Registration counts by destination
- Tourist demographics (nationality, purpose)
- Group vs individual registrations
- Daily/weekly registration trends

### Reporting Features

- Simple dashboard views
- Export capabilities for further analysis
- Basic demographic breakdowns

## Integration Points

### External Systems

1. **Immigration Office API**

   ```javascript
   // Fetch passport/visa information
   const immigrationData = await fetchImmigrationData(passportNumber);
   ```

2. **Fayda Platform API**

   ```javascript
   // Retrieve Ethiopian national ID data
   const faydaData = await fetchFaydaData(nationalId);
   ```

### Internal Systems

- User authentication and roles
- Existing analytics pipeline
- Dashboard integration

## Deployment Considerations

### Database Performance

- Proper indexing on search fields
- Regular maintenance and optimization

### Security

- Encrypted data transmission
- Access logging and monitoring
- Regular security audits

### Scalability

- Horizontal scaling support
- API rate limiting
- Load balancing considerations

## Troubleshooting

### Common Issues

1. **External Data Not Loading**

   - Check network connectivity
   - Verify API credentials
   - Continue with manual entry if needed

2. **Registration Errors**
   - Ensure required fields are filled
   - Check for duplicate registrations
   - Verify document type consistency

### Debug Information

- Check browser console for API errors
- Review server logs for backend issues
- Use GET endpoints to verify data integrity

## Future Enhancements

### Next Phase Features

- **Activity Tracking System**: QR code-based tracking for tourist activities
- **Mobile App**: Tourist-facing mobile application
- **Advanced Analytics**: ML-powered insights and recommendations
- **Multilingual Support**: Support for multiple languages

### Integration Opportunities

- Real-time capacity management
- Enhanced analytics and reporting
- Integration with more external systems
- Advanced user experience features

## Support & Maintenance

### Regular Tasks

- Database cleanup and archiving
- Analytics data verification
- Performance monitoring

### Monitoring

- API response times
- Database performance
- User adoption metrics
- System reliability

For technical support or questions about the tourist registration system, please refer to the main project documentation or contact the development team.
