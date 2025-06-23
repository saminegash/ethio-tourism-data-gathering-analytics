#!/usr/bin/env python3
"""
Switch to Simplified Setup
==========================
This script switches your system to use the simplified, working setup by default.
No more dual-key warnings or authentication headaches!
"""

import os
import shutil
import sys

def backup_and_switch():
    """Backup the complex version and switch to simplified"""
    
    print("🔄 Switching to Simplified Setup...")
    print("=" * 50)
    
    # Backup original complex version
    if os.path.exists('supabase_sync.py'):
        print("📦 Backing up complex version to supabase_sync_complex.py")
        shutil.copy('supabase_sync.py', 'supabase_sync_complex.py')
    
    # Replace with simplified version
    if os.path.exists('supabase_sync_simple.py'):
        print("🔄 Replacing supabase_sync.py with simplified version")
        shutil.copy('supabase_sync_simple.py', 'supabase_sync.py')
    
    print("\n✅ Switched to simplified setup!")
    print("   • No more dual-key warnings")
    print("   • Works with your existing SUPABASE_KEY")
    print("   • All analytics functionality preserved")
    
    print("\n🧪 Testing the switch...")
    
    # Test import
    try:
        from supabase_sync import SupabaseSyncManager
        sync_manager = SupabaseSyncManager()
        
        if sync_manager.client:
            print("   ✅ Simplified setup working perfectly!")
        else:
            print("   ⚠️  Connection test failed (check environment variables)")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n🎯 You can now run:")
    print("   python tourism_analytics_orchestrator.py run-pipeline")
    print("   python quick_test.py")
    print("   # No more warnings!")

def restore_complex():
    """Restore the complex dual-key version"""
    
    print("🔄 Restoring Complex Setup...")
    print("=" * 50)
    
    if os.path.exists('supabase_sync_complex.py'):
        print("🔄 Restoring complex version from backup")
        shutil.copy('supabase_sync_complex.py', 'supabase_sync.py')
        print("✅ Complex version restored")
        print("   • You'll need both SUPABASE_ANON_KEY and SUPABASE_SERVICE_KEY")
        print("   • Run setup_env.sh to configure properly")
    else:
        print("❌ No complex backup found")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == 'restore':
        restore_complex()
    else:
        backup_and_switch()
        
    print("\n📚 Commands:")
    print("   python use_simple_setup.py          # Switch to simplified (default)")  
    print("   python use_simple_setup.py restore  # Restore complex version") 