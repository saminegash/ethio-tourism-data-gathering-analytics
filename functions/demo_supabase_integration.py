#!/usr/bin/env python3
"""
Supabase Integration Demo
========================
Demonstrates the new Supabase client integration for tourism analytics
"""

import os
import json
from datetime import datetime, timedelta
from supabase_sync import SupabaseSyncManager
from tourism_insights_engine import TourismInsightsEngine

def demo_without_credentials():
    """Demo using mock data when no Supabase credentials are provided"""
    print("🎭 Demo: Analytics with Mock Data (No Database)")
    print("=" * 60)
    
    # Initialize without credentials - will use mock data
    sync_manager = SupabaseSyncManager()
    insights_engine = TourismInsightsEngine()
    
    # Load mock data
    client = insights_engine.connect_to_supabase()  # Returns None
    data = insights_engine.load_tourism_data(client, days_back=30)
    
    print(f"📊 Mock data loaded:")
    for table_name, df in data.items():
        print(f"   - {table_name}: {len(df)} records")
    
    # Generate insights
    forecasts = insights_engine.generate_forecasts(data, forecast_days=7)
    print(f"\n🔮 Generated forecasts for: {list(forecasts.keys())}")
    
    insights = insights_engine.generate_departmental_insights(data, forecasts)
    print(f"🏢 Generated insights for departments: {list(insights.keys())}")
    
    # Show sample forecast
    if 'arrivals' in forecasts and 'forecast_values' in forecasts['arrivals']:
        arrivals_forecast = forecasts['arrivals']
        print(f"\n✈️  Sample Arrivals Forecast:")
        print(f"   Method: {arrivals_forecast.get('method', 'N/A')}")
        print(f"   7-day total predicted: {arrivals_forecast.get('total_predicted_arrivals', 'N/A')}")
        print(f"   Daily average: {arrivals_forecast.get('average_daily_arrivals', 'N/A')}")
    
    # Show sample department insight
    if 'operations' in insights:
        ops_insight = insights['operations']
        print(f"\n🏭 Sample Operations Insight:")
        print(f"   Alert level: {ops_insight.alert_level}")
        print(f"   Key metrics: {len(ops_insight.key_metrics)}")
        print(f"   Recommendations: {len(ops_insight.recommendations)}")
        if ops_insight.recommendations:
            print(f"   Top recommendation: {ops_insight.recommendations[0]}")
    
    print("\n✅ Mock data demo completed successfully!")
    return True

def demo_with_credentials():
    """Demo using real Supabase connection"""
    print("\n🔗 Demo: Analytics with Real Supabase Data")
    print("=" * 60)
    
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("⚠️  Supabase credentials not found - skipping live demo")
        print("   Set SUPABASE_URL and SUPABASE_KEY to test with real data")
        return False
    
    try:
        # Initialize with credentials
        sync_manager = SupabaseSyncManager(supabase_url, supabase_key)
        insights_engine = TourismInsightsEngine(supabase_url, supabase_key)
        
        if not sync_manager.client:
            print("❌ Failed to connect to Supabase")
            return False
        
        print("✅ Connected to Supabase successfully")
        
        # Test data loading
        print("\n📡 Loading tourism data from Supabase...")
        data = sync_manager.load_tourism_data(days_back=7)
        
        print(f"📊 Real data loaded:")
        total_records = 0
        for table_name, df in data.items():
            record_count = len(df)
            total_records += record_count
            print(f"   - {table_name}: {record_count} records")
        
        if total_records == 0:
            print("📭 No data found in database - this is normal for a new project")
            print("   The system will use mock data for analytics")
            
            # Fall back to mock data for demonstration
            client = insights_engine.connect_to_supabase()
            data = insights_engine.load_tourism_data(None, days_back=30)  # Force mock data
            print(f"   Using mock data instead: {sum(len(df) for df in data.values())} total records")
        
        # Generate analytics with real or mock data
        print("\n🧠 Generating analytics...")
        forecasts = insights_engine.generate_forecasts(data, forecast_days=7)
        insights = insights_engine.generate_departmental_insights(data, forecasts)
        
        # Test saving results back to Supabase
        print("\n💾 Testing data save operations...")
        
        # Test saving forecasts
        if forecasts:
            forecast_saved = sync_manager.save_forecasts(forecasts)
            print(f"   Forecasts saved: {'✅' if forecast_saved else '❌'}")
        
        # Test saving insights
        insights_data = {}
        for dept_name, insight in insights.items():
            insights_data[dept_name] = {
                'department': insight.department,
                'key_metrics': [
                    {
                        'name': metric.metric_name,
                        'current_value': metric.current_value,
                        'trend': metric.trend,
                        'impact_level': metric.impact_level
                    } for metric in insight.key_metrics
                ],
                'recommendations': insight.recommendations,
                'action_items': insight.action_items,
                'alert_level': insight.alert_level
            }
        
        if insights_data:
            insights_saved = sync_manager.save_department_insights(insights_data)
            print(f"   Insights saved: {'✅' if insights_saved else '❌'}")
        
        # Test comprehensive report
        report = insights_engine.generate_comprehensive_report()
        if report and 'error' not in report:
            report_id = sync_manager.save_analytics_report(report)
            print(f"   Report saved: {'✅' if report_id else '❌'} (ID: {report_id})")
        
        print("\n🎉 Real Supabase demo completed!")
        return True
        
    except Exception as e:
        print(f"❌ Error in Supabase demo: {str(e)}")
        return False

def show_usage_examples():
    """Show code examples for using the new Supabase integration"""
    print("\n📚 Usage Examples")
    print("=" * 60)
    
    examples = [
        {
            "title": "Basic Connection",
            "code": """
from supabase_sync import SupabaseSyncManager

# Initialize with credentials
sync_manager = SupabaseSyncManager(
    supabase_url="https://your-project.supabase.co",
    supabase_key="your-service-role-key"
)

# Or use environment variables
sync_manager = SupabaseSyncManager()  # Uses SUPABASE_URL and SUPABASE_KEY
"""
        },
        {
            "title": "Load Tourism Data",
            "code": """
# Load last 30 days of data
data = sync_manager.load_tourism_data(days_back=30)

# Access different tables
arrivals_df = data['arrivals']
occupancy_df = data['occupancy']
visits_df = data['visits']
surveys_df = data['surveys']
"""
        },
        {
            "title": "Generate and Save Analytics",
            "code": """
from tourism_insights_engine import TourismInsightsEngine

# Initialize engine
engine = TourismInsightsEngine()

# Generate forecasts and insights
data = sync_manager.load_tourism_data()
forecasts = engine.generate_forecasts(data)
insights = engine.generate_departmental_insights(data, forecasts)

# Save results back to Supabase
sync_manager.save_forecasts(forecasts)
sync_manager.save_department_insights(insights)
"""
        },
        {
            "title": "Error Handling",
            "code": """
# Graceful fallback to mock data
if not sync_manager.client:
    print("Using mock data for development")
    data = engine.load_tourism_data(None)  # Uses mock data
else:
    print("Using real Supabase data")
    data = sync_manager.load_tourism_data()
"""
        }
    ]
    
    for i, example in enumerate(examples, 1):
        print(f"\n{i}. {example['title']}")
        print("-" * 40)
        print(example['code'].strip())

def main():
    """Main demonstration function"""
    print("🚀 Ethiopia Tourism Analytics - Supabase Integration Demo")
    print("=" * 80)
    
    # Demo 1: Mock data (always works)
    mock_success = demo_without_credentials()
    
    # Demo 2: Real Supabase data (if credentials available)
    real_success = demo_with_credentials()
    
    # Show usage examples
    show_usage_examples()
    
    # Summary
    print("\n📋 Demo Summary")
    print("=" * 60)
    print(f"✅ Mock data demo: {'Success' if mock_success else 'Failed'}")
    print(f"{'✅' if real_success else '⚠️ '} Real data demo: {'Success' if real_success else 'Skipped (no credentials)'}")
    
    print("\n🎯 Key Benefits of Supabase Client Integration:")
    print("   • Simple connection setup with URL + key")
    print("   • Automatic error handling and retries")
    print("   • Type-safe API calls instead of raw SQL")
    print("   • Built-in authentication and security")
    print("   • Graceful fallback to mock data for development")
    print("   • No more connection timeout issues")
    
    print("\n📖 Next Steps:")
    if not real_success:
        print("   1. Set up your Supabase project and get credentials")
        print("   2. Export SUPABASE_URL and SUPABASE_KEY environment variables")
        print("   3. Run the analytics pipeline with real data")
    else:
        print("   1. Your Supabase integration is working!")
        print("   2. Set up scheduled analytics jobs")
        print("   3. Configure the web dashboard")
    
    print("   4. Explore the ANALYTICS_README.md for full documentation")

if __name__ == "__main__":
    main() 