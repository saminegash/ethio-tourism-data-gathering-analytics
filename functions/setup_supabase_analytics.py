#!/usr/bin/env python3
"""
Supabase Analytics Setup Script
==============================
Complete setup and troubleshooting script for the Ethiopia Tourism Analytics platform.
This script will guide you through the entire setup process and fix common issues.
"""

import os
import sys
from datetime import datetime
import subprocess

def print_header(title):
    """Print a formatted header"""
    print(f"\n{'='*60}")
    print(f"🚀 {title}")
    print(f"{'='*60}")

def print_step(step, description):
    """Print a formatted step"""
    print(f"\n{step}. {description}")
    print("-" * 50)

def check_environment():
    """Check if environment variables are properly set"""
    print_step("1", "Checking Environment Variables")
    
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    
    issues = []
    
    if not supabase_url:
        issues.append("❌ SUPABASE_URL is not set")
        print("   SUPABASE_URL: Not set")
    else:
        print(f"   SUPABASE_URL: ✅ {supabase_url[:30]}...")
    
    if not supabase_key:
        issues.append("❌ SUPABASE_KEY is not set")
        print("   SUPABASE_KEY: Not set")
    elif len(supabase_key) < 200:
        issues.append("⚠️  SUPABASE_KEY looks like anon key (too short)")
        print(f"   SUPABASE_KEY: ⚠️  Short key ({len(supabase_key)} chars) - might be anon key")
    else:
        print(f"   SUPABASE_KEY: ✅ Service role key ({len(supabase_key)} chars)")
    
    if issues:
        print("\n🔧 Environment Setup Required:")
        for issue in issues:
            print(f"   {issue}")
        
        print("\n📋 How to Fix:")
        print("   1. Go to your Supabase project dashboard")
        print("   2. Navigate to Settings → API")
        print("   3. Copy the Project URL and Service Role Key (NOT anon key)")
        print("   4. Set environment variables:")
        print(f"      export SUPABASE_URL='your-project-url'")
        print(f"      export SUPABASE_KEY='your-service-role-key'")
        print("   5. Restart your terminal and run this script again")
        
        return False
    
    print("\n✅ Environment variables are properly configured!")
    return True

def check_supabase_connection():
    """Test connection to Supabase"""
    print_step("2", "Testing Supabase Connection")
    
    try:
        from supabase_sync import SupabaseSyncManager
        
        sync_manager = SupabaseSyncManager()
        
        if not sync_manager.client:
            print("❌ Failed to create Supabase client")
            return False
        
        print("✅ Supabase client created successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error testing connection: {str(e)}")
        return False

def check_database_tables():
    """Check if required database tables exist"""
    print_step("3", "Checking Database Tables")
    
    try:
        from supabase_sync import SupabaseSyncManager
        
        sync_manager = SupabaseSyncManager()
        if not sync_manager.client:
            print("❌ No database connection")
            return False
        
        required_tables = [
            'forecasts', 'department_insights', 'analytics_reports',
            'system_performance_metrics', 'data_quality_metrics'
        ]
        
        missing_tables = []
        
        for table in required_tables:
            try:
                # Try to query the table (limit 0 to just test existence)
                result = sync_manager.client.table(table).select('id').limit(0).execute()
                print(f"   {table}: ✅ Exists")
            except Exception as e:
                missing_tables.append(table)
                print(f"   {table}: ❌ Missing or inaccessible")
        
        if missing_tables:
            print(f"\n⚠️  Missing tables: {', '.join(missing_tables)}")
            print("   You need to run the database migrations:")
            print("   1. sql/migrations/initial.sql")
            print("   2. sql/migrations/insights_tables.sql")
            return False
        
        print("\n✅ All required tables exist!")
        return True
        
    except Exception as e:
        print(f"❌ Error checking tables: {str(e)}")
        return False

def test_rls_policies():
    """Test if RLS policies allow service role access"""
    print_step("4", "Testing RLS Policies")
    
    try:
        from test_rls_fix import test_rls_policies
        return test_rls_policies()
    except Exception as e:
        print(f"❌ Error testing RLS policies: {str(e)}")
        return False

def show_rls_fix_instructions():
    """Show instructions for fixing RLS policies"""
    print_step("5", "RLS Policy Fix Instructions")
    
    print("🔐 The service role is blocked by Row Level Security policies.")
    print("   You need to run the SQL fix script to allow analytics operations.")
    
    print("\n📋 Steps to Fix:")
    print("   1. Open your Supabase project dashboard")
    print("   2. Go to SQL Editor")
    print("   3. Copy and paste the contents of this file:")
    print("      sql/migrations/fix_rls_policies.sql")
    print("   4. Click 'Run' to execute the SQL")
    print("   5. Come back and run this setup script again")
    
    print("\n📄 The fix script adds these policies:")
    policies = [
        "service_role_forecasts - Allows writing forecasts",
        "service_role_insights - Allows writing department insights", 
        "service_role_reports - Allows writing analytics reports",
        "service_role_system_metrics - Allows writing performance metrics",
        "service_role_data_quality - Allows writing quality metrics"
    ]
    
    for policy in policies:
        print(f"   • {policy}")

def run_full_test():
    """Run a comprehensive test of the analytics system"""
    print_step("6", "Running Full Analytics Test")
    
    try:
        # Import and test the main engine
        from tourism_insights_engine import TourismInsightsEngine
        from supabase_sync import SupabaseSyncManager
        
        print("🧠 Testing analytics engine...")
        engine = TourismInsightsEngine()
        
        # Test with mock data
        data = engine.load_tourism_data(None, days_back=7)
        print(f"   Mock data loaded: {sum(len(df) for df in data.values())} records")
        
        # Test forecasting
        forecasts = engine.generate_forecasts(data, forecast_days=7)
        print(f"   Forecasts generated: {len(forecasts)} types")
        
        # Test insights
        insights = engine.generate_departmental_insights(data, forecasts)
        print(f"   Department insights: {len(insights)} departments")
        
        # Test sync manager
        sync_manager = SupabaseSyncManager()
        if sync_manager.client:
            # Test saving (should work now with RLS fix)
            forecast_saved = sync_manager.save_forecasts(forecasts)
            print(f"   Forecast saving: {'✅ Success' if forecast_saved else '❌ Failed'}")
            
            # Convert insights to the expected format
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
            
            insights_saved = sync_manager.save_department_insights(insights_data)
            print(f"   Insights saving: {'✅ Success' if insights_saved else '❌ Failed'}")
            
            if forecast_saved and insights_saved:
                print("\n🎉 Full analytics system test PASSED!")
                print("   Your tourism analytics platform is ready to use!")
                return True
            else:
                print("\n⚠️  Some database operations failed - check RLS policies")
                return False
        else:
            print("   ⚠️  No database connection - using mock data only")
            return True
            
    except Exception as e:
        print(f"❌ Error in full test: {str(e)}")
        return False

def show_next_steps(success):
    """Show next steps based on setup results"""
    print_step("7", "Next Steps")
    
    if success:
        print("🎉 Setup Complete! Your analytics system is ready.")
        print("\n📋 What you can do now:")
        print("   • Run analytics: python tourism_analytics_orchestrator.py run-pipeline")
        print("   • Generate insights: python tourism_analytics_orchestrator.py run-insights")
        print("   • Check dashboard: npm run dev (then visit /dashboard/insights)")
        print("   • Schedule jobs: python tourism_analytics_orchestrator.py schedule")
        
        print("\n📚 Documentation:")
        print("   • Full guide: ANALYTICS_README.md")
        print("   • API reference: Check the README API section")
        print("   • Examples: functions/demo_supabase_integration.py")
        
    else:
        print("⚠️  Setup incomplete. Common issues:")
        print("   • Missing environment variables (SUPABASE_URL, SUPABASE_KEY)")
        print("   • Database tables not created (run SQL migrations)")
        print("   • RLS policies blocking service role (run fix_rls_policies.sql)")
        print("   • Using anon key instead of service role key")
        
        print("\n🔧 Troubleshooting:")
        print("   1. Check environment variables")
        print("   2. Run database migrations in Supabase SQL editor")
        print("   3. Apply RLS policy fixes")
        print("   4. Test again with: python setup_supabase_analytics.py")

def main():
    """Main setup function"""
    print_header("Ethiopia Tourism Analytics - Setup & Diagnostics")
    
    print("This script will:")
    print("• Check your environment configuration")
    print("• Test database connectivity") 
    print("• Verify table structure")
    print("• Test RLS policies")
    print("• Run a full system test")
    print("• Provide fix instructions for any issues")
    
    # Run all checks
    checks = [
        ("Environment", check_environment),
        ("Connection", check_supabase_connection),
        ("Tables", check_database_tables),
        ("RLS Policies", test_rls_policies)
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append(result)
            if not result and name == "RLS Policies":
                show_rls_fix_instructions()
                break  # Stop here so user can fix RLS
        except Exception as e:
            print(f"❌ Error in {name} check: {str(e)}")
            results.append(False)
            break
    
    # If all basic checks pass, run full test
    all_passed = all(results)
    if all_passed:
        full_test_passed = run_full_test()
        all_passed = all_passed and full_test_passed
    
    # Show summary and next steps
    show_next_steps(all_passed)
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 