"""
Simplified Supabase Data Synchronization Module
==============================================
A simplified version that works with your current single key setup.
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import pandas as pd
from supabase import create_client, Client
from postgrest.exceptions import APIError

logger = logging.getLogger(__name__)

class SupabaseSyncManager:
    """
    Simplified Supabase sync manager that works with your current setup
    """
    
    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        self.supabase_url = supabase_url or os.getenv('SUPABASE_URL')
        # Try different environment variable names
        self.supabase_key = (
            supabase_key or 
            os.getenv('SUPABASE_KEY') or 
            os.getenv('SUPABASE_ANON_KEY') or 
            os.getenv('SUPABASE_SERVICE_KEY')
        )
        self.client = self._create_client()
    
    def _create_client(self) -> Optional[Client]:
        """Create Supabase client with available credentials"""
        try:
            if not self.supabase_url or not self.supabase_key:
                logger.warning("Supabase URL or key not provided")
                return None
            
            client = create_client(self.supabase_url, self.supabase_key)
            
            # Test the connection
            result = client.table('regions').select('id').limit(1).execute()
            
            logger.info(f"Successfully connected to Supabase (key length: {len(self.supabase_key)})")
            return client
            
        except Exception as e:
            logger.error(f"Failed to create Supabase client: {str(e)}")
            return None
    
    def save_forecasts(self, forecasts: Dict[str, Any], region_id: str = None) -> bool:
        """Save forecast data to the forecasts table"""
        if not self.client:
            logger.warning("No Supabase client available")
            return False
        
        try:
            for forecast_type, forecast_data in forecasts.items():
                if 'error' in forecast_data:
                    logger.warning(f"Skipping {forecast_type} forecast due to error: {forecast_data['error']}")
                    continue
                
                # Determine forecast period
                start_date = datetime.now().date()
                
                if 'forecast_dates' in forecast_data:
                    end_date = datetime.strptime(forecast_data['forecast_dates'][-1], '%Y-%m-%d').date()
                else:
                    end_date = start_date + timedelta(days=30)
                
                # Prepare forecast record
                forecast_record = {
                    'forecast_type': forecast_type,
                    'region_id': region_id,
                    'forecast_period_start': start_date.isoformat(),
                    'forecast_period_end': end_date.isoformat(),
                    'forecast_method': forecast_data.get('method', 'unknown'),
                    'forecast_data': forecast_data,
                    'confidence_score': forecast_data.get('confidence', 0.8),
                    'metadata': {
                        'generated_by': 'tourism_insights_engine',
                        'data_points': len(forecast_data.get('forecast_values', [])),
                        'avg_value': forecast_data.get('average_daily_arrivals') or forecast_data.get('daily_average_revenue')
                    }
                }
                
                # Insert forecast record
                result = self.client.table('forecasts').insert(forecast_record).execute()
                
                if result.data:
                    logger.info(f"Successfully saved {forecast_type} forecast")
                else:
                    logger.warning(f"No data returned when saving {forecast_type} forecast")
                
            logger.info(f"Successfully processed {len(forecasts)} forecasts")
            return True
                
        except Exception as e:
            logger.error(f"Error saving forecasts: {str(e)}")
            return False
    
    def save_department_insights(self, insights: Dict[str, Any]) -> bool:
        """Save departmental insights to the department_insights table"""
        if not self.client:
            logger.warning("No Supabase client available")
            return False
        
        try:
            insight_records = []
            
            for dept_name, insight_data in insights.items():
                if 'department' not in insight_data:
                    continue
                
                # Calculate performance score based on metrics
                performance_score = self._calculate_performance_score(insight_data.get('key_metrics', []))
                
                # Determine trend direction
                trend_direction = self._determine_trend_direction(insight_data.get('key_metrics', []))
                
                insight_record = {
                    'department_name': dept_name,
                    'insight_date': datetime.now().date().isoformat(),
                    'alert_level': insight_data.get('alert_level', 'normal'),
                    'key_metrics': insight_data.get('key_metrics', []),
                    'recommendations': insight_data.get('recommendations', []),
                    'action_items': insight_data.get('action_items', []),
                    'performance_score': performance_score,
                    'trend_direction': trend_direction,
                    'data_sources': {'tourism_data': True, 'forecasts': True},
                    'generated_by': 'tourism_insights_engine'
                }
                
                insight_records.append(insight_record)
            
            # Batch insert insights
            if insight_records:
                result = self.client.table('department_insights').insert(insight_records).execute()
                
                if result.data:
                    logger.info(f"Successfully saved insights for {len(insight_records)} departments")
                    return True
                else:
                    logger.warning("No data returned when saving department insights")
                    return False
            
            return True
                
        except Exception as e:
            logger.error(f"Error saving department insights: {str(e)}")
            return False
    
    def save_analytics_report(self, report: Dict[str, Any]) -> str:
        """Save comprehensive analytics report to the analytics_reports table"""
        if not self.client:
            logger.warning("No Supabase client available")
            return None
        
        try:
            # Determine report period from metadata
            report_metadata = report.get('report_metadata', {})
            period_start = datetime.now().date() - timedelta(days=30)
            period_end = datetime.now().date()
            
            report_record = {
                'report_type': 'comprehensive',
                'report_period_start': period_start.isoformat(),
                'report_period_end': period_end.isoformat(),
                'executive_summary': report.get('executive_summary', {}),
                'departmental_insights': report.get('departmental_insights', {}),
                'forecasts': report.get('forecasts', {}),
                'cross_departmental_initiatives': report.get('cross_departmental_initiatives', []),
                'report_metadata': report_metadata,
                'status': 'generated'
            }
            
            result = self.client.table('analytics_reports').insert(report_record).execute()
            
            if result.data and len(result.data) > 0:
                report_id = result.data[0]['id']
                logger.info(f"Successfully saved analytics report with ID: {report_id}")
                return str(report_id)
            else:
                logger.warning("No data returned when saving analytics report")
                return None
                
        except Exception as e:
            logger.error(f"Error saving analytics report: {str(e)}")
            return None
    
    def _calculate_performance_score(self, metrics: List[Dict[str, Any]]) -> float:
        """Calculate overall performance score from metrics"""
        if not metrics:
            return 0.0
        
        total_score = 0.0
        weight_sum = 0.0
        
        for metric in metrics:
            impact_level = metric.get('impact_level', 'medium')
            current_value = metric.get('current_value', 0)
            
            # Weight based on impact level
            weight = {'high': 3.0, 'medium': 2.0, 'low': 1.0}.get(impact_level, 1.0)
            
            # Normalize value (simplified approach)
            normalized_value = min(100, max(0, current_value))
            
            total_score += normalized_value * weight
            weight_sum += weight
        
        return round(total_score / weight_sum if weight_sum > 0 else 0.0, 2)
    
    def _determine_trend_direction(self, metrics: List[Dict[str, Any]]) -> str:
        """Determine overall trend direction from metrics"""
        if not metrics:
            return 'stable'
        
        trend_scores = {'increasing': 1, 'stable': 0, 'decreasing': -1}
        total_score = 0
        
        for metric in metrics:
            trend = metric.get('trend', 'stable')
            impact_level = metric.get('impact_level', 'medium')
            
            # Weight by impact level
            weight = {'high': 3, 'medium': 2, 'low': 1}.get(impact_level, 1)
            total_score += trend_scores.get(trend, 0) * weight
        
        if total_score > 0:
            return 'improving'
        elif total_score < 0:
            return 'declining'
        else:
            return 'stable'

    def trigger_alerts(self, alert_data: Dict[str, Any]) -> bool:
        """Trigger alerts based on analytics data"""
        if not self.client:
            logger.warning("No Supabase client available")
            return False
        
        try:
            alerts = []
            current_time = datetime.now()
            
            # Process alert data and create alert records
            for alert_type, data in alert_data.items():
                # Handle both dictionary format and simple values
                if isinstance(data, dict):
                    # Full alert object
                    if data.get('severity', 'low') == 'none':
                        continue
                    
                    alert_record = {
                        'alert_type': alert_type,
                        'severity': data.get('severity', 'medium'),
                        'title': data.get('title', f'{alert_type.title()} Alert'),
                        'description': data.get('description', f'Alert for {alert_type}'),
                        'affected_department': data.get('department'),
                        'threshold_values': data.get('thresholds', {}),
                        'current_values': data.get('current_values', {}),
                        'recommendations': data.get('recommendations', []),
                        'alert_status': 'active',
                        'created_at': current_time.isoformat(),
                        'metadata': {
                            'source': 'analytics_pipeline',
                            'generated_by': 'tourism_insights_engine'
                        }
                    }
                else:
                    # Simple value - convert to basic alert
                    # Convert numpy types to Python types
                    if hasattr(data, 'item'):  # numpy types
                        value = data.item()
                    else:
                        value = data
                    
                    # Skip None or empty values
                    if value is None or value == 0:
                        continue
                    
                    alert_record = {
                        'alert_type': alert_type,
                        'severity': 'info',  # Default for metric values
                        'title': f'{alert_type.replace("_", " ").title()} Metric',
                        'description': f'Current value: {value}',
                        'affected_department': alert_type.split('_')[0] if '_' in alert_type else None,
                        'threshold_values': {},
                        'current_values': {'value': value},
                        'recommendations': [],
                        'alert_status': 'informational',
                        'created_at': current_time.isoformat(),
                        'metadata': {
                            'source': 'analytics_pipeline',
                            'generated_by': 'tourism_insights_engine',
                            'metric_type': 'performance_indicator'
                        }
                    }
                
                alerts.append(alert_record)
            
            # Save alerts if any were generated
            if alerts:
                # Only save actual alerts, not informational metrics
                actual_alerts = [a for a in alerts if a['alert_status'] != 'informational']
                
                if actual_alerts:
                    result = self.client.table('alerts').insert(actual_alerts).execute()
                    if result.data:
                        logger.info(f"Successfully triggered {len(actual_alerts)} alerts")
                        return True
                    else:
                        logger.warning("No data returned when saving alerts")
                        return False
                else:
                    logger.info("No actionable alerts to trigger (only informational metrics)")
                    return True
            else:
                logger.info("No alerts to trigger")
                return True
                
        except Exception as e:
            logger.error(f"Error triggering alerts: {str(e)}")
            return False

    def save_data_quality_metrics(self, table_name: str, quality_metrics: Dict[str, Any]) -> bool:
        """Save data quality metrics for a specific table"""
        if not self.client:
            logger.warning("No Supabase client available")
            return False
        
        try:
            quality_record = {
                'table_name': table_name,
                'assessment_date': datetime.now().date().isoformat(),
                'completeness_score': quality_metrics.get('completeness', 0.0),
                'validity_score': quality_metrics.get('validity', 0.0),
                'consistency_score': quality_metrics.get('consistency', 0.0),
                'timeliness_score': quality_metrics.get('timeliness', 0.0),
                'overall_score': (
                    quality_metrics.get('completeness', 0.0) +
                    quality_metrics.get('validity', 0.0) +
                    quality_metrics.get('consistency', 0.0) +
                    quality_metrics.get('timeliness', 0.0)
                ) / 4,
                'assessment_metadata': {
                    'generated_by': 'analytics_pipeline',
                    'assessment_timestamp': datetime.now().isoformat()
                }
            }
            
            result = self.client.table('data_quality_assessments').insert(quality_record).execute()
            
            if result.data:
                logger.info(f"Successfully saved data quality metrics for {table_name}")
                return True
            else:
                logger.warning(f"No data returned when saving quality metrics for {table_name}")
                return False
                
        except Exception as e:
            logger.error(f"Error saving data quality metrics for {table_name}: {str(e)}")
            return False

    def cleanup_old_data(self, retention_days: int = 365) -> Dict[str, Any]:
        """Clean up old analytics data beyond retention period"""
        if not self.client:
            logger.warning("No Supabase client available")
            return {'success': False, 'error': 'No client available'}
        
        try:
            cutoff_date = (datetime.now() - timedelta(days=retention_days)).date().isoformat()
            cleanup_results = {}
            
            # Tables to clean up with their date columns
            tables_to_cleanup = {
                'forecasts': 'created_at',
                'department_insights': 'insight_date',
                'analytics_reports': 'created_at',
                'data_quality_assessments': 'assessment_date',
                'alerts': 'created_at'
            }
            
            for table_name, date_column in tables_to_cleanup.items():
                try:
                    # Delete old records
                    result = self.client.table(table_name).delete().lt(date_column, cutoff_date).execute()
                    
                    # Count deleted records (if data is returned)
                    deleted_count = len(result.data) if result.data else 0
                    cleanup_results[table_name] = {
                        'deleted_records': deleted_count,
                        'success': True
                    }
                    
                    logger.info(f"Cleaned up {deleted_count} old records from {table_name}")
                    
                except Exception as table_error:
                    cleanup_results[table_name] = {
                        'deleted_records': 0,
                        'success': False,
                        'error': str(table_error)
                    }
                    logger.warning(f"Could not clean up {table_name}: {str(table_error)}")
            
            total_deleted = sum(
                result.get('deleted_records', 0) 
                for result in cleanup_results.values() 
                if result.get('success', False)
            )
            
            logger.info(f"Data cleanup completed. Total records deleted: {total_deleted}")
            
            return {
                'success': True,
                'total_deleted': total_deleted,
                'table_results': cleanup_results,
                'cutoff_date': cutoff_date
            }
            
        except Exception as e:
            logger.error(f"Error during data cleanup: {str(e)}")
            return {'success': False, 'error': str(e)}

    def load_tourism_data(self, days_back: int = 365) -> Dict[str, pd.DataFrame]:
        """Load tourism data from Supabase tables"""
        if not self.client:
            logger.warning("No Supabase client available")
            return {}
        
        try:
            # Calculate date range
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days_back)
            
            data = {}
            
            # Load arrivals data
            try:
                arrivals_result = self.client.table('arrivals')\
                    .select('*')\
                    .gte('timestamp', start_date.isoformat())\
                    .lte('timestamp', end_date.isoformat())\
                    .execute()
                
                if arrivals_result.data:
                    data['arrivals'] = pd.DataFrame(arrivals_result.data)
                    logger.info(f"Loaded {len(arrivals_result.data)} arrival records")
                else:
                    data['arrivals'] = pd.DataFrame()
                    
            except Exception as e:
                logger.warning(f"Could not load arrivals data: {str(e)}")
                data['arrivals'] = pd.DataFrame()
            
            # Load occupancy data
            try:
                occupancy_result = self.client.table('occupancy')\
                    .select('*')\
                    .gte('date', start_date.isoformat())\
                    .lte('date', end_date.isoformat())\
                    .execute()
                
                if occupancy_result.data:
                    data['occupancy'] = pd.DataFrame(occupancy_result.data)
                    logger.info(f"Loaded {len(occupancy_result.data)} occupancy records")
                else:
                    data['occupancy'] = pd.DataFrame()
                    
            except Exception as e:
                logger.warning(f"Could not load occupancy data: {str(e)}")
                data['occupancy'] = pd.DataFrame()
            
            # Load visits data
            try:
                visits_result = self.client.table('visits')\
                    .select('*')\
                    .gte('visit_date', start_date.isoformat())\
                    .lte('visit_date', end_date.isoformat())\
                    .execute()
                
                if visits_result.data:
                    data['visits'] = pd.DataFrame(visits_result.data)
                    logger.info(f"Loaded {len(visits_result.data)} visit records")
                else:
                    data['visits'] = pd.DataFrame()
                    
            except Exception as e:
                logger.warning(f"Could not load visits data: {str(e)}")
                data['visits'] = pd.DataFrame()
            
            # Load surveys data
            try:
                surveys_result = self.client.table('surveys')\
                    .select('*')\
                    .gte('survey_date', start_date.isoformat())\
                    .lte('survey_date', end_date.isoformat())\
                    .execute()
                
                if surveys_result.data:
                    data['surveys'] = pd.DataFrame(surveys_result.data)
                    logger.info(f"Loaded {len(surveys_result.data)} survey records")
                else:
                    data['surveys'] = pd.DataFrame()
                    
            except Exception as e:
                logger.warning(f"Could not load surveys data: {str(e)}")
                data['surveys'] = pd.DataFrame()
            
            # Check if we got any data
            total_records = sum(len(df) for df in data.values())
            if total_records == 0:
                logger.warning("No tourism data loaded from any table")
            else:
                logger.info(f"Successfully loaded {total_records} total records from tourism tables")
            
            return data
            
        except Exception as e:
            logger.error(f"Error loading tourism data: {str(e)}")
            return {}

# Simple test function
if __name__ == "__main__":
    # Test the simplified sync manager
    sync_manager = SupabaseSyncManager()
    
    if sync_manager.client:
        print("✅ Supabase connection successful!")
        
        # Test forecast saving
        test_forecasts = {
            'arrivals': {
                'method': 'simplified_test',
                'forecast_values': [100, 105, 110],
                'forecast_dates': ['2024-01-01', '2024-01-02', '2024-01-03'],
                'total_predicted_arrivals': 315,
                'confidence': 0.85
            }
        }
        
        success = sync_manager.save_forecasts(test_forecasts)
        print(f"Forecast save test: {'✅ Success' if success else '❌ Failed'}")
        
    else:
        print("❌ Failed to connect to Supabase")
        print("Make sure SUPABASE_URL and SUPABASE_KEY are set") 