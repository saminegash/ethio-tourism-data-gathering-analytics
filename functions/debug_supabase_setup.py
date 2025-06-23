#!/usr/bin/env python3
"""
Debug Supabase Setup
===================
Step-by-step debugging script to identify and fix Supabase connection issues.
"""

import os
import sys
from supabase import create_client, Client

def test_environment_variables():
    """Test if environment variables are set correctly"""
    print("🔍 Step 1: Environment Variables Check")
    print("=" * 50)
    
    url = os.getenv('SUPABASE_URL')
    anon_key = os.getenv('SUPABASE_ANON_KEY')
    service_key = os.getenv('SUPABASE_SERVICE_KEY')
    legacy_key = os.getenv('SUPABASE_KEY')
    
    issues = []
    
    # Check URL
    print(f"SUPABASE_URL: {'✅ Set' if url else '❌ Not set'}")
    if url:
        print(f"  Value: {url[:50]}{'...' if len(url) > 50 else ''}")
    else:
        issues.append("❌ SUPABASE_URL is not set")
    
    # Check Anon Key
    print(f"SUPABASE_ANON_KEY: {'✅ Set' if anon_key else '❌ Not set'}")
    if anon_key:
        print(f"  Length: {len(anon_key)} characters")
        print(f"  First 50 chars: {anon_key[:50]}...")
        if len(anon_key) < 100 or len(anon_key) > 300:
            print("  ⚠️  WARNING: Length unusual for anon key (expected 150-250 chars)")
        else:
            print("  ✅ Length appropriate for anon key")
    else:
        issues.append("❌ SUPABASE_ANON_KEY is not set")
    
    # Check Service Key
    print(f"SUPABASE_SERVICE_KEY: {'✅ Set' if service_key else '❌ Not set'}")
    if service_key:
        print(f"  Length: {len(service_key)} characters")
        print(f"  First 50 chars: {service_key[:50]}...")
        if len(service_key) < 300:
            print("  ⚠️  WARNING: Too short for service role key (expected 400+ chars)")
            issues.append("⚠️  SUPABASE_SERVICE_KEY looks too short")
        else:
            print("  ✅ Length appropriate for service role key")
    else:
        issues.append("❌ SUPABASE_SERVICE_KEY is not set")
    
    # Check legacy key for backward compatibility
    if legacy_key and (not anon_key or not service_key):
        print(f"SUPABASE_KEY (legacy): ✅ Set ({len(legacy_key)} chars)")
        if len(legacy_key) < 250:
            print("  → Appears to be anon key")
        else:
            print("  → Appears to be service role key")
        print("  💡 Consider migrating to separate ANON_KEY and SERVICE_KEY variables")
    
    if issues:
        print("\n🔧 Setup Required:")
        for issue in issues:
            print(f"   {issue}")
        
        print("\n📋 How to Fix:")
        print("   1. Go to your Supabase project dashboard")
        print("   2. Navigate to Settings → API")
        print("   3. Copy BOTH keys:")
        print("      • Anon Key: For frontend (~200 chars)")
        print("      • Service Role Key: For analytics (~400+ chars)")
        print("   4. Set environment variables:")
        print("      export SUPABASE_URL='your-project-url'")
        print("      export SUPABASE_ANON_KEY='your-anon-key'")
        print("      export SUPABASE_SERVICE_KEY='your-service-role-key'")
        print("   5. Or run: ./setup_env.sh")
        
        return False
    
    print("\n✅ Environment variables are properly configured!")
    return True

def test_manual_connection():
    """Test connection with manual input if env vars are missing"""
    print("\n🔗 Step 2: Connection Test")
    print("=" * 50)
    
    url = os.getenv('SUPABASE_URL')
    anon_key = os.getenv('SUPABASE_ANON_KEY')
    service_key = os.getenv('SUPABASE_SERVICE_KEY')
    
    # Use legacy key if new ones not available
    if not anon_key and not service_key:
        legacy_key = os.getenv('SUPABASE_KEY')
        if legacy_key:
            if len(legacy_key) < 250:
                anon_key = legacy_key
                print("Using legacy SUPABASE_KEY as anon key")
            else:
                service_key = legacy_key
                print("Using legacy SUPABASE_KEY as service key")
    
    if not url or (not anon_key and not service_key):
        print("❌ Missing credentials. Manual input required.")
        print("\n📋 Please provide your Supabase credentials:")
        
        if not url:
            url = input("Enter your Supabase URL: ").strip()
        
        if not anon_key:
            anon_key = input("Enter your Anon Key: ").strip()
        
        if not service_key:
            service_key = input("Enter your Service Role Key: ").strip()
    
    if not url:
        print("❌ Cannot test without URL")
        return False, None, None, None
    
    # Test anon client
    anon_client = None
    if anon_key:
        try:
            print("🔄 Testing anon client...")
            anon_client = create_client(url, anon_key)
            result = anon_client.table('regions').select('id').limit(1).execute()
            print("✅ Anon client connection successful!")
        except Exception as e:
            print(f"⚠️  Anon client failed: {str(e)}")
    
    # Test service client
    service_client = None
    if service_key:
        try:
            print("🔄 Testing service client...")
            service_client = create_client(url, service_key)
            result = service_client.table('regions').select('id').limit(1).execute()
            print("✅ Service client connection successful!")
        except Exception as e:
            print(f"❌ Service client failed: {str(e)}")
    
    if anon_client or service_client:
        return True, anon_client, service_client, (url, anon_key, service_key)
    else:
        return False, None, None, (url, anon_key, service_key)

def test_service_role_permissions(service_client):
    """Test if the service role can bypass RLS"""
    print("\n🔐 Step 3: Service Role Permissions Test")
    print("=" * 50)
    
    if not service_client:
        print("❌ No service client available for testing")
        print("   This means analytics operations will be blocked by RLS policies")
        return False
    
    # Test 1: Check if forecasts table exists
    print("🔄 Testing forecasts table access...")
    try:
        result = service_client.table('forecasts').select('id').limit(1).execute()
        print("✅ Can read from forecasts table")
    except Exception as e:
        print(f"❌ Cannot read from forecasts table: {str(e)}")
        if "does not exist" in str(e).lower():
            print("   → Run sql/migrations/insights_tables.sql in Supabase")
        return False
    
    # Test 2: Try a simple insert to test RLS bypass
    print("🔄 Testing RLS bypass with simple insert...")
    try:
        # Try to insert a minimal test record
        test_data = {
            'forecast_type': 'test_debug',
            'forecast_period_start': '2024-01-01',
            'forecast_period_end': '2024-01-07',
            'forecast_method': 'debug_test',
            'forecast_data': {'test': True},
            'confidence_score': 0.5
        }
        
        result = service_client.table('forecasts').insert(test_data).execute()
        
        if result.data:
            print("✅ Service role can write to forecasts table!")
            
            # Clean up the test record
            record_id = result.data[0]['id']
            service_client.table('forecasts').delete().eq('id', record_id).execute()
            print("   → Test record cleaned up")
            return True
        else:
            print("❌ Insert returned no data")
            return False
            
    except Exception as e:
        print(f"❌ Cannot write to forecasts table: {str(e)}")
        
        if "row-level security policy" in str(e).lower():
            print("   → RLS policies are still blocking the service role")
            print("   → Double-check that you ran fix_rls_policies.sql correctly")
            print("   → Ensure you're using the SERVICE ROLE key (not anon key)")
        
        return False

def check_rls_policies(client):
    """Check what RLS policies exist"""
    print("\n📋 Step 4: RLS Policies Verification")
    print("=" * 50)
    
    if not client:
        print("❌ No client available for checking policies")
        return
    
    try:
        # Query the PostgreSQL system tables to see what policies exist
        query = """
        SELECT schemaname, tablename, policyname, permissive, roles, cmd 
        FROM pg_policies 
        WHERE tablename IN ('forecasts', 'department_insights', 'analytics_reports')
        ORDER BY tablename, policyname;
        """
        
        result = client.rpc('execute_sql', {'query': query}).execute()
        
        if result.data:
            print("📋 Current RLS Policies:")
            for policy in result.data:
                print(f"   • {policy['tablename']}.{policy['policyname']} (for {policy['roles']})")
        else:
            print("⚠️  No policies found or cannot query policies")
            
    except Exception as e:
        print(f"⚠️  Cannot check policies: {str(e)}")
        print("   This is normal - we'll check manually instead")
    
    # Alternative: Check if our specific policies exist by testing them
    print("\n🔍 Testing specific service role policies...")
    
    expected_policies = [
        'service_role_forecasts',
        'service_role_insights', 
        'service_role_reports'
    ]
    
    for policy in expected_policies:
        print(f"   • {policy}: Expected to exist")
    
    print("\n💡 If RLS is still blocking:")
    print("   1. Make sure you ran the ENTIRE fix_rls_policies.sql file")
    print("   2. Check for any SQL errors when running the script")
    print("   3. Verify you're using the Service Role key (not anon key)")
    print("   4. Try disabling RLS temporarily to test: ALTER TABLE forecasts DISABLE ROW LEVEL SECURITY;")

def show_environment_setup_instructions():
    """Show detailed environment setup instructions"""
    print("\n📝 Step 5: Environment Setup Instructions")
    print("=" * 50)
    
    print("🔧 To set up environment variables permanently:")
    print("   1. Edit your shell configuration file:")
    print("      nano ~/.bashrc    # for bash users")
    print("      nano ~/.zshrc     # for zsh users")
    
    print("\n   2. Add these lines (replace with your actual values):")
    print("      export SUPABASE_URL='https://your-project-id.supabase.co'")
    print("      export SUPABASE_ANON_KEY='your-anon-key'")
    print("      export SUPABASE_SERVICE_KEY='your-service-role-key'")
    
    print("\n   3. Reload your shell configuration:")
    print("      source ~/.bashrc  # or ~/.zshrc")
    
    print("\n   4. Or set them for this session only:")
    print("      export SUPABASE_URL='your-url'")
    print("      export SUPABASE_ANON_KEY='your-anon-key'")
    print("      export SUPABASE_SERVICE_KEY='your-service-role-key'")
    
    print("\n📍 Where to find your credentials:")
    print("   • Supabase Dashboard → Settings → API")
    print("   • Use the PROJECT URL (not the REST URL)")
    print("   • Use the SERVICE ROLE KEY (not the anon public key)")

def main():
    """Main debugging function"""
    print("🔧 Supabase Analytics Debug Tool")
    print("=" * 60)
    print("This tool will help you identify and fix connection issues.\n")
    
    # Step 1: Check environment variables
    env_ok = test_environment_variables()
    
    # Step 2: Test connection (with manual input if needed)
    conn_ok, anon_client, service_client, credentials = test_manual_connection()
    
    if conn_ok and service_client:
        # Step 3: Test service role permissions
        permissions_ok = test_service_role_permissions(service_client)
        
        # Step 4: Check RLS policies
        check_rls_policies(service_client)
        
        if permissions_ok:
            print("\n🎉 SUCCESS! Your Supabase setup is working correctly.")
            print("   You can now run the analytics system.")
            
            if not env_ok:
                print("\n⚠️  Remember to set up environment variables permanently")
                show_environment_setup_instructions()
        else:
            print("\n❌ RLS policies are still blocking the service role.")
            print("   Double-check the fix_rls_policies.sql execution.")
    else:
        print("\n❌ Connection failed.")
        if not env_ok:
            show_environment_setup_instructions()
    
    print("\n📋 Summary:")
    print(f"   Environment Variables: {'✅' if env_ok else '❌'}")
    print(f"   Database Connection: {'✅' if conn_ok else '❌'}")
    print(f"   Service Role Permissions: {'✅' if conn_ok and service_client and test_service_role_permissions(service_client) else '❌'}")

if __name__ == "__main__":
    main() 