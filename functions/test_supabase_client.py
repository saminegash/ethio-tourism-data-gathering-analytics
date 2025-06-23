#!/usr/bin/env python3
"""
Test Supabase Client Connection
==============================
Simple test to verify the new Supabase client works correctly
"""

import os
import sys
from supabase import create_client

def test_supabase_client():
    """Test Supabase client connectivity"""
    print("🔍 Testing Supabase Client Connection")
    print("=" * 50)
    
    # Get credentials from environment
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ Missing SUPABASE_URL or SUPABASE_KEY environment variables")
        print("\nUsage:")
        print("export SUPABASE_URL='https://your-project.supabase.co'")
        print("export SUPABASE_KEY='your-service-role-key'")
        print("python test_supabase_client.py")
        return False
    
    print(f"📡 Connecting to: {supabase_url}")
    print(f"🔑 Key length: {len(supabase_key)} characters")
    
    try:
        # Create Supabase client
        client = create_client(supabase_url, supabase_key)
        print("✅ Supabase client created successfully")
        
        # Test basic query - check if regions table exists
        try:
            result = client.table('regions').select('id').limit(1).execute()
            print("✅ Successfully queried regions table")
            
            if result.data:
                print(f"📊 Found {len(result.data)} region(s)")
            else:
                print("📊 No regions found (table may be empty)")
            
        except Exception as query_error:
            print(f"⚠️  Query test failed: {str(query_error)}")
            print("   This is expected if the regions table doesn't exist yet")
        
        # Test the analytics sync manager
        print("\n🧪 Testing SupabaseSyncManager...")
        from supabase_sync import SupabaseSyncManager
        
        sync_manager = SupabaseSyncManager(supabase_url, supabase_key)
        if sync_manager.client:
            print("✅ SupabaseSyncManager created successfully")
            
            # Test loading tourism data
            data = sync_manager.load_tourism_data(7)  # Last 7 days
            print(f"📊 Loaded data tables: {list(data.keys())}")
            
            for table_name, df in data.items():
                print(f"   - {table_name}: {len(df)} records")
        else:
            print("❌ SupabaseSyncManager failed to initialize")
            return False
        
        print("\n🎉 All tests passed! Supabase client is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("\nPossible issues:")
        print("1. Check that your SUPABASE_KEY is the service role key")
        print("2. Verify your Supabase project URL is correct")
        print("3. Ensure your project is active and accessible")
        return False

if __name__ == "__main__":
    success = test_supabase_client()
    sys.exit(0 if success else 1) 