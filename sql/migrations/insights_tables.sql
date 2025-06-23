-- ============================================================================
-- Tourism Insights & Analytics Tables
-- ============================================================================
-- Additional tables for storing ML insights, forecasts, and departmental reports

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- INSIGHTS & FORECASTS STORAGE
-- ============================================================================

-- Store generated forecasts for different metrics
CREATE TABLE forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_type TEXT NOT NULL, -- 'arrivals', 'occupancy', 'revenue'
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    forecast_period_start DATE NOT NULL,
    forecast_period_end DATE NOT NULL,
    forecast_method TEXT NOT NULL, -- 'prophet', 'trend_analysis', 'ml_model'
    forecast_data JSONB NOT NULL, -- Forecast values and confidence intervals
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    metadata JSONB DEFAULT '{}',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

-- Store departmental insights and metrics
CREATE TABLE department_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_name TEXT NOT NULL CHECK (department_name IN (
        'software_development', 'operations', 'marketing', 
        'research_development', 'resource_mobility', 'tourism_funding'
    )),
    insight_date DATE NOT NULL DEFAULT CURRENT_DATE,
    alert_level TEXT NOT NULL CHECK (alert_level IN ('critical', 'warning', 'normal', 'positive')),
    key_metrics JSONB NOT NULL DEFAULT '[]',
    recommendations JSONB NOT NULL DEFAULT '[]',
    action_items JSONB NOT NULL DEFAULT '[]',
    performance_score DECIMAL(5,2), -- Overall performance score for the department
    trend_direction TEXT CHECK (trend_direction IN ('improving', 'declining', 'stable')),
    data_sources JSONB DEFAULT '{}', -- Which data was used to generate insights
    generated_by TEXT DEFAULT 'tourism_insights_engine',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store comprehensive analytics reports
CREATE TABLE analytics_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type TEXT NOT NULL DEFAULT 'comprehensive', -- 'comprehensive', 'departmental', 'executive'
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    executive_summary JSONB NOT NULL DEFAULT '{}',
    departmental_insights JSONB NOT NULL DEFAULT '{}',
    forecasts JSONB NOT NULL DEFAULT '{}',
    cross_departmental_initiatives JSONB DEFAULT '[]',
    report_metadata JSONB DEFAULT '{}',
    file_path TEXT, -- If report is exported to file
    status TEXT DEFAULT 'generated' CHECK (status IN ('generating', 'generated', 'distributed', 'archived')),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    distributed_at TIMESTAMP WITH TIME ZONE,
    recipients JSONB DEFAULT '[]' -- Email addresses or user IDs who received the report
);

-- Store ML model metadata and performance metrics
CREATE TABLE ml_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT NOT NULL,
    model_type TEXT NOT NULL, -- 'forecasting', 'classification', 'clustering'
    target_metric TEXT NOT NULL, -- 'arrivals', 'occupancy', 'revenue', 'satisfaction'
    model_version TEXT NOT NULL,
    training_data_period_start DATE,
    training_data_period_end DATE,
    performance_metrics JSONB NOT NULL DEFAULT '{}', -- MAE, RMSE, R², etc.
    hyperparameters JSONB DEFAULT '{}',
    feature_importance JSONB DEFAULT '{}',
    model_file_path TEXT, -- Path to serialized model
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_trained_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_retrain_at TIMESTAMP WITH TIME ZONE
);

-- Store automated alert configurations and history
CREATE TABLE alert_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_name TEXT NOT NULL,
    department_name TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    condition_type TEXT NOT NULL CHECK (condition_type IN ('threshold', 'trend', 'anomaly')),
    condition_parameters JSONB NOT NULL, -- threshold values, trend requirements, etc.
    notification_channels JSONB DEFAULT '[]', -- email, slack, sms, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store alert triggers and notifications
CREATE TABLE alert_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_config_id UUID REFERENCES alert_configurations(id) ON DELETE CASCADE,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    alert_level TEXT NOT NULL CHECK (alert_level IN ('critical', 'warning', 'info')),
    message TEXT NOT NULL,
    metric_value DECIMAL(15,4),
    threshold_value DECIMAL(15,4),
    additional_data JSONB DEFAULT '{}',
    notification_sent BOOLEAN DEFAULT FALSE,
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Store scheduled job configurations and execution history
CREATE TABLE scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name TEXT NOT NULL,
    job_type TEXT NOT NULL CHECK (job_type IN (
        'insights_generation', 'forecast_update', 'report_generation', 
        'model_training', 'data_quality_check', 'alert_monitoring'
    )),
    schedule_expression TEXT NOT NULL, -- Cron expression
    job_parameters JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    next_execution_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store job execution history and logs
CREATE TABLE job_execution_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES scheduled_jobs(id) ON DELETE CASCADE,
    execution_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    execution_completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'timeout')),
    result_data JSONB DEFAULT '{}',
    error_message TEXT,
    execution_duration_ms INTEGER,
    records_processed INTEGER DEFAULT 0,
    notifications_sent INTEGER DEFAULT 0
);

-- ============================================================================
-- PERFORMANCE MONITORING TABLES
-- ============================================================================

-- Store system performance metrics for monitoring
CREATE TABLE system_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'api_response_time', 'database_query_time', 'ml_inference_time',
        'data_processing_time', 'memory_usage', 'cpu_usage'
    )),
    metric_value DECIMAL(15,4) NOT NULL,
    unit TEXT NOT NULL, -- 'ms', 'seconds', 'MB', 'GB', 'percentage'
    endpoint TEXT, -- For API-specific metrics
    region_name TEXT, -- For region-specific metrics
    additional_tags JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store data quality metrics and monitoring
CREATE TABLE data_quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    column_name TEXT,
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'completeness', 'uniqueness', 'validity', 'consistency', 
        'timeliness', 'accuracy', 'freshness'
    )),
    metric_value DECIMAL(5,4) NOT NULL CHECK (metric_value BETWEEN 0 AND 1),
    total_records INTEGER NOT NULL,
    problematic_records INTEGER DEFAULT 0,
    quality_rules JSONB DEFAULT '{}',
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Forecasts indexes
CREATE INDEX idx_forecasts_type_region ON forecasts(forecast_type, region_id);
CREATE INDEX idx_forecasts_period ON forecasts(forecast_period_start, forecast_period_end);
CREATE INDEX idx_forecasts_generated_at ON forecasts(generated_at);
CREATE INDEX idx_forecasts_expires_at ON forecasts(expires_at);

-- Department insights indexes
CREATE INDEX idx_department_insights_dept_date ON department_insights(department_name, insight_date);
CREATE INDEX idx_department_insights_alert_level ON department_insights(alert_level, insight_date);
CREATE INDEX idx_department_insights_performance ON department_insights(performance_score DESC, insight_date);

-- Analytics reports indexes
CREATE INDEX idx_analytics_reports_type_period ON analytics_reports(report_type, report_period_start, report_period_end);
CREATE INDEX idx_analytics_reports_status ON analytics_reports(status, generated_at);

-- ML models indexes
CREATE INDEX idx_ml_models_active ON ml_models(is_active, model_type);
CREATE INDEX idx_ml_models_retrain ON ml_models(next_retrain_at) WHERE is_active = TRUE;

-- Alert system indexes
CREATE INDEX idx_alert_configs_active ON alert_configurations(is_active, department_name);
CREATE INDEX idx_alert_history_triggered ON alert_history(triggered_at DESC);
CREATE INDEX idx_alert_history_unresolved ON alert_history(resolved_at) WHERE resolved_at IS NULL;

-- Scheduled jobs indexes
CREATE INDEX idx_scheduled_jobs_active ON scheduled_jobs(is_active, next_execution_at);
CREATE INDEX idx_job_execution_history_job_status ON job_execution_history(job_id, status, execution_started_at);

-- Performance monitoring indexes
CREATE INDEX idx_system_performance_type_time ON system_performance_metrics(metric_type, recorded_at);
CREATE INDEX idx_data_quality_table_date ON data_quality_metrics(table_name, assessment_date);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_execution_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_metrics ENABLE ROW LEVEL SECURITY;

-- Admin users can access all insights and reports
CREATE POLICY "admin_full_access_forecasts" ON forecasts
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_full_access_insights" ON department_insights
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_full_access_reports" ON analytics_reports
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Department-specific access for insights
CREATE POLICY "department_specific_insights" ON department_insights
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role = 'admin' OR profiles.metadata->>'department' = department_name)
        )
    );

-- Regional access for forecasts
CREATE POLICY "regional_access_forecasts" ON forecasts
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND (region_id = ANY(p.allowed_regions) OR cardinality(p.allowed_regions) = 0)
        )
    );

-- System performance metrics - admins and developers only
CREATE POLICY "admin_dev_performance_metrics" ON system_performance_metrics
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin') 
            OR profiles.metadata->>'department' = 'software_development'
        )
    );

-- ============================================================================
-- FUNCTIONS FOR ANALYTICS AUTOMATION
-- ============================================================================

-- Function to generate insights for a specific department
CREATE OR REPLACE FUNCTION generate_department_insights(
    dept_name TEXT,
    analysis_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB AS $$
DECLARE
    insights_data JSONB;
    alert_level TEXT := 'normal';
    performance_score DECIMAL := 0.0;
BEGIN
    -- This would typically call the Python analytics engine
    -- For now, we'll return a template structure
    
    SELECT jsonb_build_object(
        'metrics', jsonb_build_array(
            jsonb_build_object(
                'name', 'Sample Metric',
                'value', random() * 100,
                'trend', 'stable',
                'impact_level', 'medium'
            )
        ),
        'recommendations', jsonb_build_array(
            'Review current processes',
            'Implement suggested improvements'
        ),
        'action_items', jsonb_build_array(
            'Schedule team meeting',
            'Update documentation'
        )
    ) INTO insights_data;
    
    -- Insert the insights
    INSERT INTO department_insights (
        department_name,
        insight_date,
        alert_level,
        key_metrics,
        recommendations,
        action_items,
        performance_score,
        trend_direction
    ) VALUES (
        dept_name,
        analysis_date,
        alert_level,
        insights_data->'metrics',
        insights_data->'recommendations',
        insights_data->'action_items',
        performance_score,
        'stable'
    );
    
    RETURN insights_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old forecasts and reports
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete expired forecasts
    DELETE FROM forecasts WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Archive old reports (older than 6 months)
    UPDATE analytics_reports 
    SET status = 'archived' 
    WHERE generated_at < NOW() - INTERVAL '6 months' 
    AND status != 'archived';
    
    -- Clean up old job execution history (older than 3 months)
    DELETE FROM job_execution_history 
    WHERE execution_started_at < NOW() - INTERVAL '3 months';
    
    -- Clean up old performance metrics (older than 1 month)
    DELETE FROM system_performance_metrics 
    WHERE recorded_at < NOW() - INTERVAL '1 month';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get latest insights for all departments
CREATE OR REPLACE FUNCTION get_latest_department_insights()
RETURNS TABLE (
    department TEXT,
    insight_date DATE,
    alert_level TEXT,
    performance_score DECIMAL,
    key_metrics_count INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (di.department_name)
        di.department_name,
        di.insight_date,
        di.alert_level,
        di.performance_score,
        jsonb_array_length(di.key_metrics),
        di.created_at
    FROM department_insights di
    ORDER BY di.department_name, di.insight_date DESC, di.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SAMPLE DATA AND TESTING
-- ============================================================================

-- Insert sample ML model configurations
INSERT INTO ml_models (model_name, model_type, target_metric, model_version, performance_metrics, is_active) VALUES 
    ('arrivals_prophet', 'forecasting', 'arrivals', 'v1.0', '{"mae": 15.2, "rmse": 22.1, "mape": 8.5}', true),
    ('occupancy_xgboost', 'forecasting', 'occupancy', 'v1.1', '{"mae": 0.05, "rmse": 0.08, "r2": 0.87}', true),
    ('revenue_lstm', 'forecasting', 'revenue', 'v1.0', '{"mae": 2500, "rmse": 3200, "mape": 12.3}', true);

-- Insert sample alert configurations
INSERT INTO alert_configurations (alert_name, department_name, metric_name, condition_type, condition_parameters) VALUES 
    ('Low Occupancy Alert', 'operations', 'occupancy_rate', 'threshold', '{"threshold": 60, "operator": "less_than"}'),
    ('High API Response Time', 'software_development', 'api_response_time', 'threshold', '{"threshold": 500, "operator": "greater_than"}'),
    ('Revenue Decline Trend', 'tourism_funding', 'daily_revenue', 'trend', '{"trend_direction": "decreasing", "min_days": 7}');

-- Insert sample scheduled jobs
INSERT INTO scheduled_jobs (job_name, job_type, schedule_expression, job_parameters) VALUES 
    ('Daily Insights Generation', 'insights_generation', '0 6 * * *', '{"departments": ["all"]}'),
    ('Weekly Forecast Update', 'forecast_update', '0 8 * * 1', '{"forecast_days": 30, "models": ["all"]}'),
    ('Monthly Comprehensive Report', 'report_generation', '0 9 1 * *', '{"report_type": "comprehensive", "recipients": ["admin"]}');

COMMENT ON TABLE forecasts IS 'Stores ML-generated forecasts for tourism metrics';
COMMENT ON TABLE department_insights IS 'Stores departmental insights and recommendations';
COMMENT ON TABLE analytics_reports IS 'Stores comprehensive analytics reports';
COMMENT ON TABLE ml_models IS 'Metadata and performance tracking for ML models';
COMMENT ON TABLE alert_configurations IS 'Configuration for automated alerts and notifications';
COMMENT ON TABLE scheduled_jobs IS 'Configuration for scheduled analytics jobs'; 