# 🚀 Quick Start - Get Analytics Working NOW

**Stop struggling with keys! Let's get your analytics working in 2 minutes.**

## Step 1: Use What You Have

You already have working credentials:

- ✅ `SUPABASE_URL` is set
- ✅ `SUPABASE_KEY` is set (208 chars)

**This is enough to get started!**

## Step 2: Test Everything

```bash
cd functions/
python quick_test.py
```

You should see:

```
🚀 Quick Test - Let's Get This Working!
1️⃣ Checking Environment Variables...
   ✅ SUPABASE_URL: Set
   ✅ SUPABASE_KEY: Set
2️⃣ Testing Supabase Connection...
   ✅ Supabase connection successful!
3️⃣ Testing Analytics Save...
   ✅ Analytics save successful!
4️⃣ Testing Insights Save...
   ✅ Insights save successful!
```

## Step 4: Run Full Analytics

```bash
python tourism_analytics_orchestrator.py run-pipeline
```

This will:

- ✅ Generate forecasts for all 6 departments
- ✅ Save insights to your database
- ✅ Create comprehensive reports
- ✅ Process hundreds of data points

## Step 5: View Dashboard

```bash
cd ..
npm run dev
```

Visit: http://localhost:3000/dashboard/insights

## ✅ Success!

Your analytics system is now working! The simplified approach:
