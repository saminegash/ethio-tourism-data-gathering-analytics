#!/usr/bin/env python3
"""
Quick Test - Get Things Working Now
==================================
This script tests your current setup and makes analytics work immediately.
"""

import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("🚀 Quick Test - Let's Get This Working!")
print("=" * 60)

# Step 1: Check environment
print("\n1️⃣ Checking Environment Variables...")
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')

print(f"   SUPABASE_URL: {'✅ Set' if url else '❌ Missing'}")
print(f"   SUPABASE_KEY: {'✅ Set' if key else '❌ Missing'} ({len(key) if key else 0} chars)")

if not url or not key:
    print("\n❌ Missing credentials. Please set:")
    print("   export SUPABASE_URL='your-project-url'")
    print("   export SUPABASE_KEY='your-key'")
    sys.exit(1)

# Step 2: Test connection with simplified manager
print("\n2️⃣ Testing Supabase Connection...")
try:
    from supabase_sync_simple import SupabaseSyncManager
    
    sync_manager = SupabaseSyncManager()
    
    if sync_manager.client:
        print("   ✅ Supabase connection successful!")
    else:
        print("   ❌ Failed to connect to Supabase")
        sys.exit(1)
    
except ImportError as e:
    print(f"   ❌ Import error: {e}")
    sys.exit(1)

# Step 3: Test a simple forecast save
print("\n3️⃣ Testing Analytics Save...")
try:
    # Simple test forecast
    test_forecasts = {
        'arrivals_test': {
            'method': 'quick_test',
            'forecast_values': [100, 105, 110, 115, 120],
            'forecast_dates': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
            'total_predicted_arrivals': 550,
            'confidence': 0.85,
            'average_daily_arrivals': 110
        }
    }
    
    success = sync_manager.save_forecasts(test_forecasts)
    
    if success:
        print("   ✅ Analytics save successful!")
    else:
        print("   ⚠️  Analytics save failed (might be RLS issue)")
        print("   💡 Next step: Run the RLS disable script in Supabase")
    
except Exception as e:
    print(f"   ⚠️  Analytics save failed: {e}")
    print("   💡 This is likely an RLS policy issue")

# Step 4: Test insights save
print("\n4️⃣ Testing Insights Save...")
try:
    test_insights = {
        'software_development': {
            'department': 'Software Development',
            'alert_level': 'normal',
            'key_metrics': [
                {
                    'metric_name': 'API Response Time',
                    'current_value': 95,
                    'impact_level': 'high',
                    'trend': 'stable'
                }
            ],
            'recommendations': [
                'System performing well',
                'Continue monitoring'
            ],
            'action_items': [
                'Review weekly performance metrics'
            ]
        }
    }
    
    success = sync_manager.save_department_insights(test_insights)
    
    if success:
        print("   ✅ Insights save successful!")
    else:
        print("   ⚠️  Insights save failed")
    
except Exception as e:
    print(f"   ⚠️  Insights save failed: {e}")

print("\n" + "=" * 60)
print("🎯 NEXT STEPS:")
print("   1. If saves failed, fix issue and run the followin sql")
print("      Go to SQL Editor and paste: sql/migrations/initial.sql")
print("   2. Once that's done, run this test again")
print("   3. If all tests pass, your analytics system is ready!")
print("   4. Run: python tourism_analytics_orchestrator.py run-pipeline")
print("=" * 60) 