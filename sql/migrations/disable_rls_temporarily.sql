-- ============================================================================
-- TEMPORARY RLS DISABLE FOR ANALYTICS TABLES
-- ============================================================================
-- This script temporarily disables Row Level Security on analytics tables
-- to make the system work immediately while we sort out the key issues.
-- 
-- ⚠️  WARNING: This reduces security but makes analytics work immediately
-- ⚠️  Re-enable RLS later when dual-key system is properly configured
-- ============================================================================

-- Disable RLS on all analytics tables temporarily
ALTER TABLE forecasts DISABLE ROW LEVEL SECURITY;
ALTER TABLE department_insights DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_performance_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE ml_models DISABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_execution_history DISABLE ROW LEVEL SECURITY;

-- Optional: Keep RLS enabled on main tourism data tables for security
-- (These are fine to keep secure since analytics doesn't write to them directly)
-- ALTER TABLE arrivals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE occupancy ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Verify what we've done
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN (
    'forecasts', 'department_insights', 'analytics_reports',
    'system_performance_metrics', 'data_quality_metrics'
)
ORDER BY tablename;

-- ============================================================================
-- TO RE-ENABLE RLS LATER (when dual-key system is working)
-- ============================================================================
-- Run this when you're ready to re-enable security:
/*
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_execution_history ENABLE ROW LEVEL SECURITY;
*/ 