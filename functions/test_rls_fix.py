#!/usr/bin/env python3
"""
Test RLS Policy Fix
===================
Tests that the service role can properly insert data into analytics tables
after applying the RLS policy fixes.
"""

import os
import sys
from datetime import datetime, timedelta
from supabase_sync import SupabaseSyncManager

def test_rls_policies():
    """Test that service role can write to all analytics tables"""
    print("🔐 Testing RLS Policy Fix")
    print("=" * 50)
    
    # Initialize sync manager
    sync_manager = SupabaseSyncManager()
    
    if not sync_manager.client:
        print("❌ No Supabase client available - check credentials")
        return False
    
    print("✅ Connected to Supabase")
    
    # Test 1: Insert forecast data
    print("\n📊 Test 1: Forecasts Table")
    test_forecasts = {
        'test_arrivals': {
            'method': 'test',
            'forecast_values': [100, 105, 110],
            'forecast_dates': ['2024-01-01', '2024-01-02', '2024-01-03'],
            'total_predicted_arrivals': 315,
            'confidence': 0.85
        }
    }
    
    forecast_result = sync_manager.save_forecasts(test_forecasts)
    print(f"   Forecasts: {'✅ Success' if forecast_result else '❌ Failed'}")
    
    # Test 2: Insert department insights
    print("\n🏢 Test 2: Department Insights Table")
    test_insights = {
        'test_department': {
            'department': 'test',
            'key_metrics': [
                {
                    'name': 'Test Metric',
                    'current_value': 75.5,
                    'trend': 'stable',
                    'impact_level': 'medium'
                }
            ],
            'recommendations': ['Test recommendation'],
            'action_items': ['Test action'],
            'alert_level': 'normal'
        }
    }
    
    insights_result = sync_manager.save_department_insights(test_insights)
    print(f"   Insights: {'✅ Success' if insights_result else '❌ Failed'}")
    
    # Test 3: Insert analytics report
    print("\n📈 Test 3: Analytics Reports Table")
    test_report = {
        'report_metadata': {
            'generated_by': 'test_script',
            'version': '1.0'
        },
        'executive_summary': {
            'total_arrivals': 1000,
            'avg_satisfaction': 4.2
        },
        'departmental_insights': test_insights,
        'forecasts': test_forecasts,
        'cross_departmental_initiatives': ['Test initiative']
    }
    
    report_id = sync_manager.save_analytics_report(test_report)
    print(f"   Report: {'✅ Success' if report_id else '❌ Failed'} (ID: {report_id})")
    
    # Test 4: Insert performance metrics
    print("\n⚡ Test 4: System Performance Metrics")
    test_metrics = {
        'api_response_time': 250.5,
        'memory_usage': 65.2,
        'cpu_utilization': 45.8
    }
    
    metrics_result = sync_manager.save_system_performance_metrics(test_metrics)
    print(f"   Metrics: {'✅ Success' if metrics_result else '❌ Failed'}")
    
    # Test 5: Insert data quality metrics
    print("\n🔍 Test 5: Data Quality Metrics")
    test_quality = {
        'completeness': {'value': 95.5, 'total_records': 1000, 'problematic_records': 45},
        'accuracy': {'value': 98.2, 'total_records': 1000, 'problematic_records': 18}
    }
    
    quality_result = sync_manager.save_data_quality_metrics('test_table', test_quality)
    print(f"   Quality: {'✅ Success' if quality_result else '❌ Failed'}")
    
    # Summary
    all_tests = [forecast_result, insights_result, bool(report_id), metrics_result, quality_result]
    success_count = sum(all_tests)
    total_tests = len(all_tests)
    
    print(f"\n📋 Test Summary")
    print(f"   Passed: {success_count}/{total_tests}")
    print(f"   Status: {'✅ All tests passed!' if success_count == total_tests else '❌ Some tests failed'}")
    
    if success_count == total_tests:
        print("\n🎉 RLS policies are working correctly!")
        print("   Your analytics system can now save data to Supabase.")
    else:
        print("\n⚠️  Some tests failed. You may need to:")
        print("   1. Run the fix_rls_policies.sql script in Supabase")
        print("   2. Ensure you're using the SERVICE ROLE key (not anon key)")
        print("   3. Check that all analytics tables exist")
    
    return success_count == total_tests

def cleanup_test_data():
    """Clean up test data inserted during testing"""
    print("\n🧹 Cleaning up test data...")
    
    sync_manager = SupabaseSyncManager()
    if not sync_manager.client:
        return False
    
    try:
        # Clean up test forecasts
        sync_manager.client.table('forecasts').delete().eq('forecast_method', 'test').execute()
        
        # Clean up test insights
        sync_manager.client.table('department_insights').delete().eq('department_name', 'test_department').execute()
        
        # Clean up test reports (those with test metadata)
        sync_manager.client.table('analytics_reports').delete().eq('report_metadata->generated_by', 'test_script').execute()
        
        # Clean up test metrics
        sync_manager.client.table('system_performance_metrics').delete().eq('additional_tags->test', 'true').execute()
        
        # Clean up test quality metrics
        sync_manager.client.table('data_quality_metrics').delete().eq('table_name', 'test_table').execute()
        
        print("✅ Test data cleaned up")
        return True
        
    except Exception as e:
        print(f"⚠️  Error cleaning up test data: {str(e)}")
        return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Test RLS policy fixes')
    parser.add_argument('--cleanup', action='store_true', help='Clean up test data after testing')
    args = parser.parse_args()
    
    # Run the tests
    success = test_rls_policies()
    
    # Clean up if requested
    if args.cleanup:
        cleanup_test_data()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1) 