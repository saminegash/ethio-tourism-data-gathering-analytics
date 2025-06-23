#!/usr/bin/env python3
"""
Tourism Analytics Orchestrator
==============================
Main orchestrator for the Ethiopia Tourism Analytics platform.
Integrates insights generation, forecasting, and data synchronization.
"""

import os
import sys
import json
import logging
import schedule
import time
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import argparse
from pathlib import Path

# Add current directory to path for imports
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

# Import our custom modules
from tourism_insights_engine import TourismInsightsEngine

# Use simplified sync manager by default  
try:
    from supabase_sync_simple import SupabaseSyncManager
except ImportError:
    try:
        from supabase_sync import SupabaseSyncManager  
    except ImportError:
        SupabaseSyncManager = None

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tourism_analytics.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class TourismAnalyticsOrchestrator:
    """
    Main orchestrator for tourism analytics operations
    """
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or self._load_config()
        self.insights_engine = TourismInsightsEngine(
            self.config.get('supabase_url'),
            self.config.get('supabase_key')
        )
        
        # Initialize sync manager with error handling
        try:
            if SupabaseSyncManager and self.config.get('supabase_url') and self.config.get('supabase_key'):
                self.sync_manager = SupabaseSyncManager(
                    self.config.get('supabase_url'),
                    self.config.get('supabase_key')
                )
                logger.info("Sync manager initialized successfully")
            else:
                self.sync_manager = None
                logger.warning("Sync manager not available - running in offline mode")
        except Exception as e:
            logger.warning(f"Could not initialize sync manager: {str(e)} - running in offline mode")
            self.sync_manager = None
        
        # Track operation status
        self.last_run_timestamp = None
        self.operation_history = []
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from environment variables or config file"""
        config = {
            'supabase_url': os.getenv('SUPABASE_URL'),
            'supabase_key': os.getenv('SUPABASE_KEY'),
            'openai_api_key': os.getenv('OPENAI_API_KEY'),
            'forecast_days': int(os.getenv('FORECAST_DAYS', 30)),
            'data_retention_days': int(os.getenv('DATA_RETENTION_DAYS', 365)),
            'alert_thresholds': {
                'occupancy_low': float(os.getenv('OCCUPANCY_LOW_THRESHOLD', 60.0)),
                'api_response_high': float(os.getenv('API_RESPONSE_HIGH_THRESHOLD', 500.0)),
                'revenue_decline_days': int(os.getenv('REVENUE_DECLINE_DAYS', 7))
            },
            'notification_channels': {
                'email': os.getenv('NOTIFICATION_EMAIL', '').split(','),
                'slack_webhook': os.getenv('SLACK_WEBHOOK_URL'),
                'sms_api': os.getenv('SMS_API_URL')
            }
        }
        
        # Load additional config from file if exists
        config_file = os.getenv('CONFIG_FILE', 'config.json')
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    file_config = json.load(f)
                    config.update(file_config)
                logger.info(f"Loaded additional config from {config_file}")
            except Exception as e:
                logger.warning(f"Could not load config file {config_file}: {str(e)}")
        
        return config
    
    def run_full_analytics_pipeline(self) -> Dict[str, Any]:
        """
        Run the complete analytics pipeline
        """
        logger.info("Starting full analytics pipeline")
        start_time = datetime.now()
        
        try:
            # Generate comprehensive report
            report = self.insights_engine.generate_comprehensive_report()
            
            if 'error' in report:
                logger.error(f"Analytics generation failed: {report['error']}")
                return {'success': False, 'error': report['error']}
            
            # Save forecasts to database
            if 'forecasts' in report and self.sync_manager:
                try:
                    forecast_saved = self.sync_manager.save_forecasts(report['forecasts'])
                    logger.info(f"Forecasts saved: {forecast_saved}")
                except Exception as e:
                    logger.warning(f"Could not save forecasts: {str(e)}")
            
            # Save department insights
            if 'departmental_insights' in report and self.sync_manager:
                try:
                    insights_saved = self.sync_manager.save_department_insights(
                        report['departmental_insights']
                    )
                    logger.info(f"Department insights saved: {insights_saved}")
                except Exception as e:
                    logger.warning(f"Could not save department insights: {str(e)}")
            
            # Save comprehensive report
            if self.sync_manager:
                try:
                    report_id = self.sync_manager.save_analytics_report(report)
                    logger.info(f"Analytics report saved with ID: {report_id}")
                except Exception as e:
                    logger.warning(f"Could not save analytics report: {str(e)}")
                    report_id = f"local_{int(time.time())}"
            else:
                report_id = f"local_{int(time.time())}"
            
            # Trigger alerts if needed
            if self.sync_manager:
                try:
                    alert_data = self._extract_alert_data(report)
                    alerts_triggered = self.sync_manager.trigger_alerts(alert_data)
                    logger.info(f"Alerts processed: {alerts_triggered}")
                except Exception as e:
                    logger.warning(f"Could not process alerts: {str(e)}")
            
            # Record operation
            execution_time = (datetime.now() - start_time).total_seconds()
            self._record_operation('full_pipeline', execution_time, True)
            
            logger.info(f"Full analytics pipeline completed in {execution_time:.2f} seconds")
            
            # Enhanced response with dimensional analysis
            summary = report.get('executive_summary', {})
            
            return {
                'success': True,
                'report_id': report_id,
                'execution_time': execution_time,
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'overall_status': summary.get('overall_status', 'unknown'),
                    'alert_distribution': summary.get('alert_distribution', {}),
                    'high_impact_metrics': summary.get('high_impact_metrics', []),
                    'forecast_summary': summary.get('forecast_summary', {}),
                    'key_opportunities': summary.get('key_opportunities', []),
                    'dimensional_analysis': summary.get('dimensional_analysis', {}),
                    'performance_indicators': summary.get('performance_indicators', {})
                },
                'data_sources_used': self._get_data_sources_info()
            }
            
        except Exception as e:
            logger.error(f"Analytics pipeline failed: {str(e)}")
            self._record_operation('full_pipeline', 0, False, str(e))
            return {'success': False, 'error': str(e)}
    
    def run_department_insights(self, department: str = None) -> Dict[str, Any]:
        """
        Run insights generation for specific department(s)
        """
        logger.info(f"Generating insights for department: {department or 'all'}")
        start_time = datetime.now()
        
        try:
            # Load data
            client = self.insights_engine.connect_to_supabase()
            data = self.insights_engine.load_tourism_data(client)
            
            # Generate forecasts (needed for insights)
            forecasts = self.insights_engine.generate_forecasts(data)
            
            # Generate insights
            if department:
                # Single department
                dept_config = self.insights_engine.departments.get(department)
                if not dept_config:
                    raise ValueError(f"Unknown department: {department}")
                
                insight = self.insights_engine._generate_department_insight(
                    department, dept_config, data, forecasts
                )
                insights = {department: insight}
            else:
                # All departments
                insights = self.insights_engine.generate_departmental_insights(data, forecasts)
            
            # Convert insights to saveable format
            insights_data = {}
            for dept_name, insight in insights.items():
                insights_data[dept_name] = {
                    'department': insight.department,
                    'key_metrics': [
                        {
                            'name': metric.metric_name,
                            'current_value': metric.current_value,
                            'predicted_value': metric.predicted_value,
                            'trend': metric.trend,
                            'confidence': metric.confidence,
                            'impact_level': metric.impact_level,
                            'recommendation': metric.recommendation
                        } for metric in insight.key_metrics
                    ],
                    'recommendations': insight.recommendations,
                    'action_items': insight.action_items,
                    'alert_level': insight.alert_level
                }
            
            # Save insights
            saved = self.sync_manager.save_department_insights(insights_data)
            
            execution_time = (datetime.now() - start_time).total_seconds()
            self._record_operation('department_insights', execution_time, saved)
            
            logger.info(f"Department insights completed in {execution_time:.2f} seconds")
            
            return {
                'success': saved,
                'insights': insights_data,
                'execution_time': execution_time,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Department insights failed: {str(e)}")
            self._record_operation('department_insights', 0, False, str(e))
            return {'success': False, 'error': str(e)}
    
    def run_forecasts_update(self) -> Dict[str, Any]:
        """
        Update forecasts for all metrics
        """
        logger.info("Updating forecasts")
        start_time = datetime.now()
        
        try:
            # Load data
            client = self.insights_engine.connect_to_supabase()
            data = self.insights_engine.load_tourism_data(client)
            
            # Generate forecasts
            forecast_days = self.config.get('forecast_days', 30)
            forecasts = self.insights_engine.generate_forecasts(data, forecast_days)
            
            # Save forecasts
            saved = self.sync_manager.save_forecasts(forecasts)
            
            execution_time = (datetime.now() - start_time).total_seconds()
            self._record_operation('forecasts_update', execution_time, saved)
            
            logger.info(f"Forecasts update completed in {execution_time:.2f} seconds")
            
            return {
                'success': saved,
                'forecasts': forecasts,
                'execution_time': execution_time,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Forecasts update failed: {str(e)}")
            self._record_operation('forecasts_update', 0, False, str(e))
            return {'success': False, 'error': str(e)}
    
    def run_data_quality_check(self) -> Dict[str, Any]:
        """
        Run data quality assessment on tourism data
        """
        logger.info("Running data quality check")
        start_time = datetime.now()
        
        try:
            # Load data
            client = self.insights_engine.connect_to_supabase()
            data = self.insights_engine.load_tourism_data(client)
            
            quality_results = {}
            
            # Check each data table
            for table_name, df in data.items():
                if df.empty:
                    continue
                
                table_quality = {
                    'completeness': self._check_completeness(df),
                    'validity': self._check_validity(df, table_name),
                    'consistency': self._check_consistency(df, table_name),
                    'timeliness': self._check_timeliness(df, table_name)
                }
                
                quality_results[table_name] = table_quality
                
                # Save quality metrics
                self.sync_manager.save_data_quality_metrics(table_name, table_quality)
            
            execution_time = (datetime.now() - start_time).total_seconds()
            self._record_operation('data_quality_check', execution_time, True)
            
            logger.info(f"Data quality check completed in {execution_time:.2f} seconds")
            
            return {
                'success': True,
                'quality_results': quality_results,
                'execution_time': execution_time,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Data quality check failed: {str(e)}")
            self._record_operation('data_quality_check', 0, False, str(e))
            return {'success': False, 'error': str(e)}
    
    def cleanup_old_data(self) -> Dict[str, Any]:
        """
        Clean up old analytics data
        """
        logger.info("Cleaning up old data")
        start_time = datetime.now()
        
        try:
            cleaned = self.sync_manager.cleanup_old_data()
            
            execution_time = (datetime.now() - start_time).total_seconds()
            self._record_operation('cleanup', execution_time, cleaned)
            
            logger.info(f"Data cleanup completed in {execution_time:.2f} seconds")
            
            return {
                'success': cleaned,
                'execution_time': execution_time,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Data cleanup failed: {str(e)}")
            self._record_operation('cleanup', 0, False, str(e))
            return {'success': False, 'error': str(e)}
    
    def _extract_alert_data(self, report: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract alert-relevant data from analytics report
        """
        alert_data = {}
        
        # Extract key metrics that could trigger alerts
        dept_insights = report.get('departmental_insights', {})
        
        for dept_name, dept_data in dept_insights.items():
            for metric in dept_data.get('key_metrics', []):
                metric_name = metric.get('name', '').lower().replace(' ', '_')
                alert_data[f"{dept_name}_{metric_name}"] = metric.get('current_value', 0)
        
        # Extract forecast data
        forecasts = report.get('forecasts', {})
        for forecast_type, forecast_data in forecasts.items():
            if 'total_predicted_arrivals' in forecast_data:
                alert_data[f"{forecast_type}_predicted_total"] = forecast_data['total_predicted_arrivals']
            if 'total_predicted_revenue' in forecast_data:
                alert_data[f"{forecast_type}_predicted_revenue"] = forecast_data['total_predicted_revenue']
        
        return alert_data
    
    def _check_completeness(self, df) -> float:
        """Check data completeness (% of non-null values)"""
        if df.empty:
            return 0.0
        total_cells = df.size
        non_null_cells = df.count().sum()
        return non_null_cells / total_cells if total_cells > 0 else 0.0
    
    def _check_validity(self, df, table_name: str) -> float:
        """Check data validity based on business rules"""
        if df.empty:
            return 0.0
        
        valid_rows = len(df)
        
        # Table-specific validation rules
        if table_name == 'arrivals':
            if 'passenger_count' in df.columns:
                valid_rows = len(df[df['passenger_count'] > 0])
        elif table_name == 'occupancy':
            if 'occupied_rooms' in df.columns and 'total_rooms' in df.columns:
                valid_rows = len(df[df['occupied_rooms'] <= df['total_rooms']])
        
        return valid_rows / len(df) if len(df) > 0 else 0.0
    
    def _check_consistency(self, df, table_name: str) -> float:
        """Check data consistency"""
        if df.empty:
            return 0.0
        
        # Simple consistency check - could be expanded
        return 1.0  # Placeholder
    
    def _check_timeliness(self, df, table_name: str) -> float:
        """Check data timeliness (how recent the data is)"""
        if df.empty:
            return 0.0
        
        # Check if we have recent data (within last 7 days)
        date_columns = ['timestamp', 'date', 'created_at']
        for col in date_columns:
            if col in df.columns:
                try:
                    latest_date = pd.to_datetime(df[col]).max()
                    days_old = (datetime.now() - latest_date).days
                    return max(0.0, 1.0 - (days_old / 7.0))  # Linear decay over 7 days
                except:
                    continue
        
        return 0.5  # Default if no date column found
    
    def _record_operation(self, operation_type: str, execution_time: float, 
                         success: bool, error_message: str = None):
        """Record operation in history"""
        self.operation_history.append({
            'operation': operation_type,
            'timestamp': datetime.now().isoformat(),
            'execution_time': execution_time,
            'success': success,
            'error': error_message
        })
        
        # Keep only last 100 operations
        if len(self.operation_history) > 100:
            self.operation_history = self.operation_history[-100:]
        
        self.last_run_timestamp = datetime.now()
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status of the orchestrator"""
        return {
            'last_run': self.last_run_timestamp.isoformat() if self.last_run_timestamp else None,
            'operations_count': len(self.operation_history),
            'recent_operations': self.operation_history[-10:],  # Last 10 operations
            'config': {
                'forecast_days': self.config.get('forecast_days'),
                'data_retention_days': self.config.get('data_retention_days'),
                'has_supabase_config': bool(self.config.get('supabase_url'))
            }
        }
    
    def setup_scheduled_jobs(self):
        """Set up scheduled jobs for automated analytics"""
        logger.info("Setting up scheduled jobs")
        
        # Daily insights generation (6 AM)
        schedule.every().day.at("06:00").do(self.run_department_insights)
        
        # Weekly forecast updates (Monday 8 AM)
        schedule.every().monday.at("08:00").do(self.run_forecasts_update)
        
        # Monthly comprehensive reports (1st of month, 9 AM)
        schedule.every().month.do(self.run_full_analytics_pipeline)
        
        # Daily data quality checks (10 PM)
        schedule.every().day.at("22:00").do(self.run_data_quality_check)
        
        # Weekly cleanup (Sunday 2 AM)
        schedule.every().sunday.at("02:00").do(self.cleanup_old_data)
        
        logger.info("Scheduled jobs configured")
    
    def run_scheduler(self):
        """Run the scheduler indefinitely"""
        logger.info("Starting scheduler...")
        
        while True:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except KeyboardInterrupt:
                logger.info("Scheduler stopped by user")
                break
            except Exception as e:
                logger.error(f"Scheduler error: {str(e)}")
                time.sleep(300)  # Wait 5 minutes before retrying
    
    def _get_data_sources_info(self) -> Dict[str, Any]:
        """Get information about data sources used"""
        
        sources_info = {
            'supabase_available': bool(self.config.get('supabase_url') and self.config.get('supabase_key')),
            'sync_manager_available': self.sync_manager is not None,
            'fallback_sources': ['tourism_dataset.csv', 'tourism_data table']
        }
        
        return sources_info

def main():
    """Main CLI interface"""
    parser = argparse.ArgumentParser(description='Ethiopia Tourism Analytics Orchestrator')
    parser.add_argument('command', choices=[
        'run-pipeline', 'run-insights', 'run-forecasts', 'run-quality-check',
        'cleanup', 'status', 'schedule', 'test'
    ], help='Command to execute')
    parser.add_argument('--department', type=str, help='Specific department for insights')
    parser.add_argument('--config', type=str, help='Config file path')
    
    args = parser.parse_args()
    
    # Set config file if provided
    if args.config:
        os.environ['CONFIG_FILE'] = args.config
    
    # Initialize orchestrator
    orchestrator = TourismAnalyticsOrchestrator()
    
    try:
        if args.command == 'run-pipeline':
            result = orchestrator.run_full_analytics_pipeline()
            print(json.dumps(result, indent=2))
        
        elif args.command == 'run-insights':
            result = orchestrator.run_department_insights(args.department)
            print(json.dumps(result, indent=2))
        
        elif args.command == 'run-forecasts':
            result = orchestrator.run_forecasts_update()
            print(json.dumps(result, indent=2))
        
        elif args.command == 'run-quality-check':
            result = orchestrator.run_data_quality_check()
            print(json.dumps(result, indent=2))
        
        elif args.command == 'cleanup':
            result = orchestrator.cleanup_old_data()
            print(json.dumps(result, indent=2))
        
        elif args.command == 'status':
            status = orchestrator.get_status()
            print(json.dumps(status, indent=2))
        
        elif args.command == 'schedule':
            orchestrator.setup_scheduled_jobs()
            orchestrator.run_scheduler()
        
        elif args.command == 'test':
            print("Running test analytics pipeline...")
            result = orchestrator.run_full_analytics_pipeline()
            print("Test completed:", result.get('success', False))
    
    except Exception as e:
        logger.error(f"Command failed: {str(e)}")
        print(json.dumps({'success': False, 'error': str(e)}, indent=2))

if __name__ == "__main__":
    main() 