-- ============================================================================
-- FIX RLS POLICIES FOR ANALYTICS TABLES
-- ============================================================================
-- This script adds service role policies to allow the Python analytics engine
-- to write data to Supabase tables without authentication issues.
-- 
-- Run this in your Supabase SQL editor if you're getting RLS policy errors.
-- ============================================================================

-- Service role access for forecasts table
CREATE POLICY "service_role_forecasts" ON forecasts
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role access for department insights
CREATE POLICY "service_role_insights" ON department_insights
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role access for analytics reports
CREATE POLICY "service_role_reports" ON analytics_reports
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role access for system performance metrics
CREATE POLICY "service_role_system_metrics" ON system_performance_metrics
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role access for data quality metrics
CREATE POLICY "service_role_data_quality" ON data_quality_metrics
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role access for alert history
CREATE POLICY "service_role_alert_history" ON alert_history
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role access for ML models table
CREATE POLICY "service_role_ml_models" ON ml_models
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role access for scheduled jobs
CREATE POLICY "service_role_scheduled_jobs" ON scheduled_jobs
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Service role access for job execution history
CREATE POLICY "service_role_job_history" ON job_execution_history
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the policies were created successfully:

-- Check all policies on forecasts table
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies WHERE tablename = 'forecasts';

-- Check all policies on department_insights table  
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies WHERE tablename = 'department_insights';

-- Test analytics tables access
-- SELECT table_name, row_security 
-- FROM information_schema.tables 
-- WHERE table_name IN ('forecasts', 'department_insights', 'analytics_reports', 'system_performance_metrics'); 