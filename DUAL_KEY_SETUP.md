# 🔑 Dual-Key Supabase Setup Guide

## Overview

The Ethiopia Tourism Analytics platform uses **both** Supabase keys for different purposes:

| Key Type             | Purpose            | Length      | Usage                            | RLS         |
| -------------------- | ------------------ | ----------- | -------------------------------- | ----------- |
| **Anon Key**         | Frontend/Dashboard | ~200 chars  | User authentication, dashboard   | ✅ Enforced |
| **Service Role Key** | Analytics Engine   | ~400+ chars | Backend analytics, ML operations | ❌ Bypassed |

## 🎯 Why Both Keys?

### 🖥️ **Anon Key** (Frontend Operations)

- **Purpose**: User authentication and dashboard access
- **Security**: Enforces Row Level Security (RLS) policies
- **Usage**:
  - Next.js dashboard authentication
  - User-specific data access
  - Department-specific insights
- **Length**: ~150-250 characters

### 🔧 **Service Role Key** (Analytics Operations)

- **Purpose**: Backend analytics and ML operations
- **Security**: Bypasses RLS for system operations
- **Usage**:
  - Python analytics engine
  - ML forecasting operations
  - System performance metrics
  - Data quality assessments
- **Length**: ~400+ characters

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
cd functions/
./setup_env.sh
```

### Option 2: Manual Setup

```bash
# Get credentials from Supabase Dashboard → Settings → API
export SUPABASE_URL='https://your-project-id.supabase.co'
export SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...' # ~200 chars
export SUPABASE_SERVICE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...' # ~400+ chars

# Test the setup
python debug_supabase_setup.py
```

## 🔍 Where to Find Your Keys

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to Settings → API**
4. **Copy both keys**:
   - **anon/public key** → Use as `SUPABASE_ANON_KEY`
   - **service_role key** → Use as `SUPABASE_SERVICE_KEY`

## 🏗️ Architecture

```
Frontend (Next.js)          Backend (Python)
      ↓                           ↓
   Anon Key                Service Role Key
      ↓                           ↓
  RLS Enforced              RLS Bypassed
      ↓                           ↓
User-specific data       System-wide analytics
```

## 📊 Usage Examples

### Frontend Dashboard (Anon Key)

```typescript
// components/dashboard/InsightsDashboard.tsx
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // User operations
);

// Gets user-specific insights (RLS enforced)
const { data } = await supabase
  .from("department_insights")
  .select("*")
  .eq("department_name", userDepartment);
```

### Analytics Engine (Service Role Key)

```python
# functions/supabase_sync.py
sync_manager = SupabaseSyncManager(
    supabase_anon_key=os.getenv('SUPABASE_ANON_KEY'),      # For user ops
    supabase_service_key=os.getenv('SUPABASE_SERVICE_KEY') # For analytics
)

# Save forecasts (bypasses RLS)
sync_manager.save_forecasts(forecasts)  # Uses service role key

# Get user insights (enforces RLS)
sync_manager.get_user_insights(user_id, department)  # Uses anon key
```

## 🔐 Security Model

### RLS Policies Applied

- **Anon Key**: Subject to all RLS policies
  - Users see only their department's data
  - Regional restrictions apply
  - Admin users have broader access

### RLS Policies Bypassed

- **Service Role Key**: Bypasses RLS for system operations
  - Can write analytics data
  - Can read all data for processing
  - Used only by trusted backend systems

## 🛠️ Environment Variables

### New Format (Recommended)

```bash
export SUPABASE_URL='https://your-project.supabase.co'
export SUPABASE_ANON_KEY='your-anon-key'
export SUPABASE_SERVICE_KEY='your-service-role-key'
```

### Legacy Support

```bash
# Still supported for backward compatibility
export SUPABASE_KEY='your-service-role-key'  # Treated as service key
```

## 🧪 Testing Your Setup

### 1. Test Environment Variables

```bash
python debug_supabase_setup.py
```

### 2. Expected Output

```
🔍 Step 1: Environment Variables Check
==================================================
SUPABASE_URL: ✅ Set
SUPABASE_ANON_KEY: ✅ Set
  ✅ Length appropriate for anon key
SUPABASE_SERVICE_KEY: ✅ Set
  ✅ Length appropriate for service role key

🔗 Step 2: Connection Test
==================================================
✅ Anon client connection successful!
✅ Service client connection successful!

🔐 Step 3: Service Role Permissions Test
==================================================
✅ Can read from forecasts table
✅ Service role can write to forecasts table!

🎉 SUCCESS! Your Supabase setup is working correctly.
```

## 🔧 Troubleshooting

### Common Issues

1. **Wrong Key Type**

   ```
   Error: new row violates row-level security policy
   ```

   **Solution**: Ensure you're using SERVICE ROLE key for analytics

2. **Missing Keys**

   ```
   Error: SUPABASE_ANON_KEY is not set
   ```

   **Solution**: Set both keys using `./setup_env.sh`

3. **Key Length Issues**
   ```
   Warning: Too short for service role key
   ```
   **Solution**: Double-check you copied the service role key, not anon key

### Debug Commands

```bash
# Check current environment
echo "Anon key length: ${#SUPABASE_ANON_KEY}"
echo "Service key length: ${#SUPABASE_SERVICE_KEY}"

# Test connections
python debug_supabase_setup.py

# Test analytics pipeline
python tourism_analytics_orchestrator.py test
```

## 🎯 Next Steps

Once both keys are properly configured:

1. **Test the analytics system**:

   ```bash
   python tourism_analytics_orchestrator.py run-pipeline
   ```

2. **Start the dashboard**:

   ```bash
   npm run dev
   # Visit http://localhost:3000/dashboard/insights
   ```

3. **Set up scheduled analytics**:
   ```bash
   python tourism_analytics_orchestrator.py schedule
   ```

## 📚 Integration Points

### Frontend (Next.js)

- Uses **anon key** for user authentication
- Enforces RLS for security
- Shows department-specific data

### Backend (Python)

- Uses **service role key** for analytics
- Bypasses RLS for system operations
- Processes all data for insights

### Database (Supabase)

- RLS policies control anon key access
- Service role policies allow analytics operations
- Maintains data security and functionality

---

**✅ With both keys properly configured, your tourism analytics platform will have:**

- Secure user authentication and authorization
- Powerful analytics capabilities that bypass security restrictions when appropriate
- Department-specific data access for users
- System-wide analytics for comprehensive insights
