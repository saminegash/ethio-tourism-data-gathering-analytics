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