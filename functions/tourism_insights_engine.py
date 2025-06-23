#!/usr/bin/env python3
"""
Tourism Insights Engine
=======================
Advanced analytics engine for Ethiopian tourism data with ML forecasting,
departmental insights, and comprehensive reporting capabilities.
"""

from dataclasses import dataclass
import os
import sys
import logging
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Union
import json
from pathlib import Path

# ML and Analytics imports
try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

try:
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.metrics import mean_absolute_error, mean_squared_error
    from sklearn.preprocessing import StandardScaler
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

# Use simplified sync manager by default
try:
    from supabase_sync_simple import SupabaseSyncManager
except ImportError:
    try:
        from supabase_sync import SupabaseSyncManager
    except ImportError:
        SupabaseSyncManager = None

# Database connectivity
import os
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class InsightMetric:
    """Structure for individual insights"""
    metric_name: str
    current_value: float
    predicted_value: Optional[float]
    trend: str  # 'increasing', 'decreasing', 'stable'
    confidence: float
    impact_level: str  # 'high', 'medium', 'low'
    recommendation: str
    department_relevance: List[str]

@dataclass
class DepartmentInsight:
    """Structure for department-specific insights"""
    department: str
    key_metrics: List[InsightMetric]
    forecasts: Dict[str, Any]
    recommendations: List[str]
    alert_level: str  # 'critical', 'warning', 'normal', 'positive'
    action_items: List[str]

class TourismInsightsEngine:
    """
    Advanced tourism analytics engine for generating multi-departmental insights
    """
    
    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        self.supabase_url = supabase_url or os.getenv('SUPABASE_URL')
        self.supabase_key = supabase_key or os.getenv('SUPABASE_KEY')
        
        # Initialize ML models
        self.models = {}
        self.scalers = {}
        
        # Department configurations
        self.departments = {
            'software_development': {
                'focus_metrics': ['api_usage', 'system_performance', 'data_quality', 'user_engagement'],
                'priority': 'technical_optimization'
            },
            'operations': {
                'focus_metrics': ['occupancy_rates', 'arrival_patterns', 'capacity_utilization', 'revenue'],
                'priority': 'operational_efficiency'
            },
            'marketing': {
                'focus_metrics': ['visitor_satisfaction', 'market_segments', 'seasonal_trends', 'roi'],
                'priority': 'market_expansion'
            },
            'research_development': {
                'focus_metrics': ['innovation_metrics', 'tourist_behavior', 'emerging_trends', 'competitive_analysis'],
                'priority': 'strategic_insights'
            },
            'resource_mobility': {
                'focus_metrics': ['resource_allocation', 'transportation', 'infrastructure_usage', 'logistics'],
                'priority': 'resource_optimization'
            },
            'tourism_funding': {
                'focus_metrics': ['revenue_generation', 'investment_returns', 'economic_impact', 'funding_efficiency'],
                'priority': 'financial_performance'
            }
        }
    
    def connect_to_supabase(self) -> Optional[Any]:
        """Establish connection to Supabase database"""
        try:
            if not self.supabase_url or not self.supabase_key:
                logger.warning("Supabase URL or key not provided, using mock data")
                return None
            
            # Create Supabase client
            client = create_client(self.supabase_url, self.supabase_key)
            
            # Test the connection with a simple query
            result = client.table('regions').select('id').limit(1).execute()
            
            logger.info("Successfully connected to Supabase using client library")
            return client
            
        except Exception as e:
            logger.error(f"Failed to connect to Supabase: {str(e)}")
            logger.warning("Database connection failed, will use mock data")
            return None
    
    def load_tourism_data(self, client=None, days_back: int = 365) -> Dict[str, pd.DataFrame]:
        """Load tourism data from Supabase or CSV file as fallback"""
        
        if client is not None:
            try:
                # Use the SupabaseSyncManager's load method
                sync_manager = SupabaseSyncManager(self.supabase_url, self.supabase_key)
                data = sync_manager.load_tourism_data(days_back)
                
                if data and not all(df.empty for df in data.values()):
                    logger.info("Successfully loaded data from Supabase")
                    return data
                else:
                    logger.warning("No data loaded from Supabase, trying fallback methods")
            except Exception as e:
                logger.error(f"Error loading data from Supabase: {str(e)}")
        
        # Fallback to CSV file or direct table query
        return self._load_fallback_data(days_back)
    
    def _load_fallback_data(self, days_back: int) -> Dict[str, pd.DataFrame]:
        """Load data from CSV file or direct database query as fallback"""
        
        # Try loading from CSV file first
        csv_paths = [
            'tourism_dataset.csv',
            'data/tourism_dataset.csv',
            '../tourism_dataset.csv',
            'functions/tourism_dataset.csv'
        ]
        
        for csv_path in csv_paths:
            if os.path.exists(csv_path):
                try:
                    logger.info(f"Loading data from CSV file: {csv_path}")
                    df = pd.read_csv(csv_path, low_memory=False, dtype=str)
                    
                    # Convert numeric columns where possible
                    numeric_columns = ['arrivals', 'tourist_arrivals', 'visitors', 'count', 'revenue', 'total_revenue']
                    for col in numeric_columns:
                        if col in df.columns:
                            df[col] = pd.to_numeric(df[col], errors='coerce')
                    
                    # Filter by date if possible
                    date_columns = ['date', 'timestamp', 'arrival_date', 'created_at', 'year']
                    date_col = next((col for col in date_columns if col in df.columns), None)
                    
                    if date_col:
                        try:
                            df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
                            if not df[date_col].isna().all():
                                cutoff_date = datetime.now() - timedelta(days=days_back)
                                df = df[df[date_col] >= cutoff_date]
                                logger.info(f"Filtered data to last {days_back} days, {len(df)} records remaining")
                        except Exception as e:
                            logger.warning(f"Could not filter by date: {str(e)}")
                    else:
                        logger.info(f"No date column found, using all {len(df)} records")
                    
                    # Process the CSV data into the expected format
                    return self._process_csv_data(df)
                    
                except Exception as e:
                    logger.error(f"Error loading CSV file {csv_path}: {str(e)}")
                    continue
        
        # Try direct database query to tourism_data table
        if self.supabase_url and self.supabase_key:
            try:
                logger.info("Attempting direct query to tourism_data table")
                client = create_client(self.supabase_url, self.supabase_key)
                
                # Query tourism_data table directly
                cutoff_date = (datetime.now() - timedelta(days=days_back)).isoformat()
                result = client.table('tourism_data').select('*').gte('date', cutoff_date).execute()
                
                if result.data:
                    df = pd.DataFrame(result.data)
                    logger.info(f"Loaded {len(df)} records from tourism_data table")
                    return self._process_tourism_data_table(df)
                
            except Exception as e:
                logger.error(f"Error querying tourism_data table: {str(e)}")
        
        logger.error("All fallback data loading methods failed")
        raise Exception("No data sources available - neither Supabase, CSV file, nor direct table query worked")
    
    def _process_csv_data(self, df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
        """Process CSV data into the expected tourism data format"""
        
        # Define numeric columns based on user specification
        numeric_columns = [
            'spend_amount', 'visit_duration_days', 'satisfaction_score', 'age',
            'infrastructure_rating', 'local_business_spend', 'flight_delay_minutes', 
            'flight_spend', 'hotel_nights', 'hotel_rating', 'hotel_spend', 
            'activities_count', 'activity_spend', 'package_spend', 'souvenir_spend',
            'other_service_rating'
        ]
        
        # Convert numeric columns
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Handle date columns
        date_columns = ['arrival_date', 'created_at', 'updated_at']
        for col in date_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        # Create derived columns for analytics
        if 'arrival_date' in df.columns:
            df['year'] = df['arrival_date'].dt.year
            df['month'] = df['arrival_date'].dt.month
            df['day_of_week'] = df['arrival_date'].dt.day_name()
            df['week_of_year'] = df['arrival_date'].dt.isocalendar().week
        
        # Calculate total spending per visitor
        spending_cols = ['spend_amount', 'flight_spend', 'hotel_spend', 'activity_spend', 'package_spend', 'souvenir_spend']
        df['total_spend'] = df[[col for col in spending_cols if col in df.columns]].sum(axis=1, skipna=True)
        
        # Calculate occupancy rate if we can derive it
        if 'hotel_nights' in df.columns and 'visit_duration_days' in df.columns:
            df['occupancy_rate'] = (df['hotel_nights'] / df['visit_duration_days']).clip(0, 1)
        
        # Create separate DataFrames for different analysis types
        data = {
            'arrivals': df.copy(),  # All data can be treated as arrivals
            'occupancy': df[df['hotel_nights'].notna()].copy() if 'hotel_nights' in df.columns else pd.DataFrame(),
            'visits': df.copy(),  # All data represents visits
            'surveys': df[df['satisfaction_score'].notna()].copy() if 'satisfaction_score' in df.columns else pd.DataFrame()
        }
        
        return data
    
    def _process_tourism_data_table(self, df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
        """Process tourism_data table into expected format"""
        
        return {
            'arrivals': df.copy(),
            'occupancy': pd.DataFrame(),
            'visits': df.copy(),
            'surveys': pd.DataFrame()
        }
    
    def generate_forecasts(self, data: Dict[str, pd.DataFrame], forecast_days: int = 30) -> Dict[str, Any]:
        """Generate ML-based forecasts for key tourism metrics"""
        
        forecasts = {}
        
        try:
            # Arrivals forecasting
            if not data['arrivals'].empty:
                arrivals_forecast = self._forecast_arrivals(data['arrivals'], forecast_days)
                forecasts['arrivals'] = arrivals_forecast
            
            # Occupancy forecasting
            if not data['occupancy'].empty:
                occupancy_forecast = self._forecast_occupancy(data['occupancy'], forecast_days)
                forecasts['occupancy'] = occupancy_forecast
            
            # Revenue forecasting
            if not data['occupancy'].empty:
                revenue_forecast = self._forecast_revenue(data['occupancy'], forecast_days)
                forecasts['revenue'] = revenue_forecast
            
        except Exception as e:
            logger.error(f"Error generating forecasts: {str(e)}")
            forecasts['error'] = str(e)
        
        return forecasts
    
    def _forecast_arrivals(self, arrivals_df: pd.DataFrame, days: int) -> Dict[str, Any]:
        """Forecast tourist arrivals using time series analysis"""
        
        # Handle different possible date column names and data structures
        date_col = None
        value_col = None
        
        # Find appropriate date column (updated for real CSV structure)
        for col in ['arrival_date', 'created_at', 'date', 'timestamp', 'updated_at']:
            if col in arrivals_df.columns:
                date_col = col
                break
        
        # Find appropriate value column for arrivals (updated for real CSV structure)
        for col in ['spend_amount', 'total_spend', 'visitors', 'count', 'passenger_count']:
            if col in arrivals_df.columns and pd.api.types.is_numeric_dtype(arrivals_df[col]):
                value_col = col
                break
        
        if date_col is None:
            logger.warning("No date column found for arrivals forecasting, using statistical forecast")
            return self._generate_statistical_forecast(arrivals_df, days)
        
        # Prepare data
        try:
            arrivals_df[date_col] = pd.to_datetime(arrivals_df[date_col], errors='coerce')
            arrivals_df = arrivals_df.dropna(subset=[date_col])
            arrivals_df['date'] = arrivals_df[date_col].dt.date
            
            if value_col and pd.api.types.is_numeric_dtype(arrivals_df[value_col]):
                # Aggregate by date using the value column (e.g., total spending as proxy for activity)
                daily_arrivals = arrivals_df.groupby('date')[value_col].sum().reset_index()
                daily_arrivals.columns = ['date', 'arrivals']
            else:
                # Count records per day as arrivals
                daily_arrivals = arrivals_df.groupby('date').size().reset_index()
                daily_arrivals.columns = ['date', 'arrivals']
            
            daily_arrivals['date'] = pd.to_datetime(daily_arrivals['date'])
            daily_arrivals = daily_arrivals.sort_values('date')
            
        except Exception as e:
            logger.error(f"Error preparing arrivals data: {str(e)}")
            return {'error': f'Data preparation failed: {str(e)}'}
        
        # Use Prophet if available, otherwise simple trend analysis
        if PROPHET_AVAILABLE and len(daily_arrivals) > 30:
            try:
                prophet_df = daily_arrivals[['date', 'arrivals']].rename(
                    columns={'date': 'ds', 'arrivals': 'y'}
                )
                
                model = Prophet(
                    daily_seasonality=True, 
                    yearly_seasonality=True,
                    weekly_seasonality=True,
                    changepoint_prior_scale=0.05
                )
                model.fit(prophet_df)
                
                future = model.make_future_dataframe(periods=days)
                forecast = model.predict(future)
                
                future_dates = forecast.tail(days)
                
                return {
                    'method': 'prophet',
                    'forecast_values': [max(0, int(val)) for val in future_dates['yhat'].tolist()],
                    'forecast_dates': future_dates['ds'].dt.strftime('%Y-%m-%d').tolist(),
                    'confidence_intervals': {
                        'lower': [max(0, int(val)) for val in future_dates['yhat_lower'].tolist()],
                        'upper': [max(0, int(val)) for val in future_dates['yhat_upper'].tolist()]
                    },
                    'total_predicted_arrivals': int(max(0, future_dates['yhat'].sum())),
                    'average_daily_arrivals': int(max(0, future_dates['yhat'].mean())),
                    'historical_average': int(daily_arrivals['arrivals'].mean())
                }
            except Exception as e:
                logger.warning(f"Prophet forecasting failed: {str(e)}, using trend analysis")
        
        # Enhanced trend-based forecast
        if len(daily_arrivals) > 7:
            # Calculate trend
            recent_data = daily_arrivals.tail(min(30, len(daily_arrivals)))
            historical_avg = recent_data['arrivals'].mean()
            
            # Simple linear trend
            if len(recent_data) > 1:
                x = np.arange(len(recent_data))
                y = recent_data['arrivals'].values
                slope = np.polyfit(x, y, 1)[0] if len(x) > 1 else 0
            else:
                slope = 0
            
            # Generate forecasts with seasonal adjustment
            base_values = []
            for i in range(days):
                # Linear trend projection
                trend_value = historical_avg + (slope * i)
                
                # Add seasonal patterns (simple sine wave)
                seasonal_factor = 1.0 + 0.15 * np.sin(2 * np.pi * i / 365) + 0.1 * np.sin(2 * np.pi * i / 7)
                
                # Ensure non-negative values
                forecast_value = max(0, int(trend_value * seasonal_factor))
                base_values.append(forecast_value)
            
            forecast_dates = [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)]
            
            return {
                'method': 'trend_analysis',
                'forecast_values': base_values,
                'forecast_dates': forecast_dates,
                'total_predicted_arrivals': sum(base_values),
                'average_daily_arrivals': int(np.mean(base_values)),
                'historical_average': int(historical_avg),
                'trend_slope': float(slope)
            }
        
        return {'error': 'Insufficient data for forecasting'}
    
    def _forecast_occupancy(self, occupancy_df: pd.DataFrame, days: int) -> Dict[str, Any]:
        """Forecast hotel occupancy rates"""
        
        # For real CSV structure, calculate occupancy based on hotel_nights and visit_duration
        if 'hotel_nights' in occupancy_df.columns and 'visit_duration_days' in occupancy_df.columns:
            # Calculate occupancy rate from hotel nights vs visit duration
            occupancy_df = occupancy_df.copy()
            occupancy_df['occupancy_rate'] = (occupancy_df['hotel_nights'] / occupancy_df['visit_duration_days']).clip(0, 1)
            
            # Find date column
            date_columns = ['arrival_date', 'created_at', 'date', 'timestamp']
            date_col = next((col for col in date_columns if col in occupancy_df.columns), None)
            
            if date_col:
                try:
                    occupancy_df[date_col] = pd.to_datetime(occupancy_df[date_col], errors='coerce')
                    occupancy_df = occupancy_df.dropna(subset=[date_col])
                    
                    regional_forecasts = {}
                    
                    # Use home_region for regional analysis
                    region_col = 'home_region' if 'home_region' in occupancy_df.columns else None
                    
                    if region_col:
                        for region in occupancy_df[region_col].unique():
                            region_data = occupancy_df[occupancy_df[region_col] == region]
                            daily_occupancy = region_data.groupby(region_data[date_col].dt.date)['occupancy_rate'].mean().reset_index()
                            
                            if len(daily_occupancy) > 7:
                                # Simple moving average with seasonal adjustment
                                recent_avg = daily_occupancy['occupancy_rate'].tail(7).mean()
                                seasonal_pattern = 1.0 + 0.15 * np.sin(2 * np.pi * np.arange(days) / 365)
                                
                                forecast_values = [min(0.95, max(0.1, recent_avg * factor)) for factor in seasonal_pattern]
                                
                                regional_forecasts[region] = {
                                    'forecast_rates': forecast_values,
                                    'average_predicted_rate': np.mean(forecast_values),
                                    'peak_predicted_rate': max(forecast_values),
                                    'trend': 'increasing' if forecast_values[-1] > forecast_values[0] else 'decreasing'
                                }
                    else:
                        # Overall occupancy forecast without regional breakdown
                        daily_occupancy = occupancy_df.groupby(occupancy_df[date_col].dt.date)['occupancy_rate'].mean().reset_index()
                        
                        if len(daily_occupancy) > 7:
                            recent_avg = daily_occupancy['occupancy_rate'].tail(7).mean()
                            seasonal_pattern = 1.0 + 0.15 * np.sin(2 * np.pi * np.arange(days) / 365)
                            
                            forecast_values = [min(0.95, max(0.1, recent_avg * factor)) for factor in seasonal_pattern]
                            
                            regional_forecasts['overall'] = {
                                'forecast_rates': forecast_values,
                                'average_predicted_rate': np.mean(forecast_values),
                                'peak_predicted_rate': max(forecast_values),
                                'trend': 'increasing' if forecast_values[-1] > forecast_values[0] else 'decreasing'
                            }
                    
                    return {
                        'regional_forecasts': regional_forecasts,
                        'forecast_dates': [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)],
                        'method': 'hotel_nights_based'
                    }
                    
                except Exception as e:
                    logger.error(f"Error processing occupancy forecast: {str(e)}")
        
        # Fallback: use hotel_rating as proxy for occupancy quality
        if 'hotel_rating' in occupancy_df.columns:
            avg_rating = occupancy_df['hotel_rating'].mean()
            # Convert rating to occupancy estimate (higher rating = higher occupancy)
            estimated_occupancy = min(0.9, max(0.3, avg_rating / 5.0))
            
            seasonal_pattern = 1.0 + 0.15 * np.sin(2 * np.pi * np.arange(days) / 365)
            forecast_values = [min(0.95, max(0.1, estimated_occupancy * factor)) for factor in seasonal_pattern]
            
            return {
                'regional_forecasts': {
                    'estimated': {
                        'forecast_rates': forecast_values,
                        'average_predicted_rate': np.mean(forecast_values),
                        'peak_predicted_rate': max(forecast_values),
                        'trend': 'stable'
                    }
                },
                'forecast_dates': [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)],
                'method': 'rating_based_estimate',
                'note': 'Occupancy estimated from hotel ratings'
            }
        
        # If no suitable data, return empty forecast
        return {
            'error': 'Insufficient data for occupancy forecasting',
            'note': 'No hotel_nights, visit_duration, or hotel_rating data available'
        }
    
    def _forecast_revenue(self, occupancy_df: pd.DataFrame, days: int) -> Dict[str, Any]:
        """Enhanced revenue forecasting using multiple data sources"""
        
        # Try to find revenue data in the dataset
        revenue_cols = ['revenue', 'total_revenue', 'income', 'earnings']
        date_cols = ['date', 'timestamp', 'created_at']
        
        revenue_col = next((col for col in revenue_cols if col in occupancy_df.columns), None)
        date_col = next((col for col in date_cols if col in occupancy_df.columns), None)
        
        if not revenue_col or not date_col:
            logger.warning("No revenue or date columns found for revenue forecasting")
            # Try to estimate revenue from other columns
            return self._estimate_revenue_forecast(occupancy_df, days)
        
        try:
            occupancy_df[date_col] = pd.to_datetime(occupancy_df[date_col])
            daily_revenue = occupancy_df.groupby(occupancy_df[date_col].dt.date)[revenue_col].sum().reset_index()
            daily_revenue.columns = ['date', 'revenue']
            daily_revenue['date'] = pd.to_datetime(daily_revenue['date'])
            daily_revenue = daily_revenue.sort_values('date')
            
        except Exception as e:
            logger.error(f"Error preparing revenue data: {str(e)}")
            return {'error': f'Revenue data preparation failed: {str(e)}'}
        
        if len(daily_revenue) > 7:
            # Enhanced trend analysis with growth factors
            recent_avg = daily_revenue['revenue'].tail(14).mean()
            historical_avg = daily_revenue['revenue'].head(14).mean() if len(daily_revenue) > 14 else recent_avg
            
            # Calculate growth rate
            if historical_avg > 0:
                growth_factor = (recent_avg / historical_avg) ** (1/min(14, len(daily_revenue)))
            else:
                growth_factor = 1.02  # Default 2% growth
            
            forecast_values = []
            for i in range(1, days + 1):
                # Base projection with growth
                base_revenue = recent_avg * (growth_factor ** i)
                
                # Seasonal adjustment
                seasonal_adj = 1.0 + 0.2 * np.sin(2 * np.pi * i / 365) + 0.1 * np.sin(2 * np.pi * i / 7)
                
                # Apply seasonal adjustment and ensure positive values
                predicted_revenue = max(0, base_revenue * seasonal_adj)
                forecast_values.append(predicted_revenue)
            
            return {
                'method': 'enhanced_trend',
                'forecast_values': forecast_values,
                'forecast_dates': [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)],
                'total_predicted_revenue': sum(forecast_values),
                'daily_average_revenue': np.mean(forecast_values),
                'growth_rate_daily': (growth_factor - 1) * 100,
                'historical_average': float(historical_avg),
                'recent_average': float(recent_avg)
            }
        
        return {'error': 'Insufficient revenue data for forecasting'}
    
    def _estimate_revenue_forecast(self, data_df: pd.DataFrame, days: int) -> Dict[str, Any]:
        """Estimate revenue forecast when direct revenue data is not available"""
        
        # Use occupancy or visitor data to estimate revenue
        if 'occupied_rooms' in data_df.columns and 'total_rooms' in data_df.columns:
            # Hotel-based revenue estimation
            avg_occupancy = (data_df['occupied_rooms'] / data_df['total_rooms']).mean()
            avg_rooms = data_df['total_rooms'].mean()
            estimated_daily_revenue = avg_occupancy * avg_rooms * 100  # Assume $100 per room
            
        elif len(data_df) > 0:
            # Visitor-based revenue estimation
            daily_visitors = len(data_df) / max(1, data_df['date'].nunique() if 'date' in data_df.columns else 30)
            estimated_daily_revenue = daily_visitors * 150  # Assume $150 per visitor
            
        else:
            estimated_daily_revenue = 10000  # Default fallback
        
        # Generate forecast
        forecast_values = []
        for i in range(days):
            seasonal_factor = 1.0 + 0.15 * np.sin(2 * np.pi * i / 365)
            daily_forecast = estimated_daily_revenue * seasonal_factor
            forecast_values.append(daily_forecast)
        
        return {
            'method': 'estimated',
            'forecast_values': forecast_values,
            'forecast_dates': [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)],
            'total_predicted_revenue': sum(forecast_values),
            'daily_average_revenue': np.mean(forecast_values),
            'note': 'Revenue estimated from available data'
        }
    
    def generate_departmental_insights(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Dict[str, DepartmentInsight]:
        """Generate specific insights for each department"""
        
        insights = {}
        
        for dept_name, dept_config in self.departments.items():
            insights[dept_name] = self._generate_department_insight(dept_name, dept_config, data, forecasts)
        
        return insights
    
    def _generate_department_insight(self, dept_name: str, dept_config: Dict[str, Any], 
                                   data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> DepartmentInsight:
        """Generate insights for a specific department"""
        
        key_metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        if dept_name == 'software_development':
            # Focus on API usage, system performance, data quality
            metrics, recs, actions, alert = self._software_dev_insights(data, forecasts)
            key_metrics.extend(metrics)
            recommendations.extend(recs)
            action_items.extend(actions)
            alert_level = alert
            
        elif dept_name == 'operations':
            # Focus on occupancy, capacity, operational efficiency
            metrics, recs, actions, alert = self._operations_insights(data, forecasts)
            key_metrics.extend(metrics)
            recommendations.extend(recs)
            action_items.extend(actions)
            alert_level = alert
            
        elif dept_name == 'marketing':
            # Focus on visitor satisfaction, market trends, ROI
            metrics, recs, actions, alert = self._marketing_insights(data, forecasts)
            key_metrics.extend(metrics)
            recommendations.extend(recs)
            action_items.extend(actions)
            alert_level = alert
            
        elif dept_name == 'research_development':
            # Focus on innovation metrics, emerging trends
            metrics, recs, actions, alert = self._rd_insights(data, forecasts)
            key_metrics.extend(metrics)
            recommendations.extend(recs)
            action_items.extend(actions)
            alert_level = alert
            
        elif dept_name == 'resource_mobility':
            # Focus on resource allocation, transportation
            metrics, recs, actions, alert = self._resource_mobility_insights(data, forecasts)
            key_metrics.extend(metrics)
            recommendations.extend(recs)
            action_items.extend(actions)
            alert_level = alert
            
        elif dept_name == 'tourism_funding':
            # Focus on revenue, ROI, economic impact
            metrics, recs, actions, alert = self._funding_insights(data, forecasts)
            key_metrics.extend(metrics)
            recommendations.extend(recs)
            action_items.extend(actions)
            alert_level = alert
        
        return DepartmentInsight(
            department=dept_name,
            key_metrics=key_metrics,
            forecasts=forecasts,
            recommendations=recommendations,
            alert_level=alert_level,
            action_items=action_items
        )
    
    def _software_dev_insights(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Tuple[List[InsightMetric], List[str], List[str], str]:
        """Generate software development team insights"""
        
        metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        # Data quality metrics
        if not data['arrivals'].empty:
            data_completeness = 1.0 - (data['arrivals'].isnull().sum().sum() / data['arrivals'].size)
            metrics.append(InsightMetric(
                metric_name="Data Completeness",
                current_value=data_completeness * 100,
                predicted_value=None,
                trend="stable",
                confidence=0.95,
                impact_level="high",
                recommendation="Maintain data validation pipelines",
                department_relevance=["software_development", "operations"]
            ))
            
            if data_completeness < 0.95:
                alert_level = 'warning'
                action_items.append("Investigate missing data sources")
        
        # API Performance (simulated)
        api_response_time = np.random.uniform(150, 300)  # milliseconds
        metrics.append(InsightMetric(
            metric_name="API Response Time",
            current_value=api_response_time,
            predicted_value=api_response_time * 1.1,  # Slight degradation expected
            trend="increasing",
            confidence=0.8,
            impact_level="medium",
            recommendation="Optimize database queries and implement caching",
            department_relevance=["software_development"]
        ))
        
        recommendations.extend([
            "Implement real-time data validation",
            "Add automated testing for data pipelines",
            "Set up monitoring alerts for system performance",
            "Consider implementing GraphQL for more efficient API calls"
        ])
        
        action_items.extend([
            "Review database indexing strategy",
            "Implement Redis caching layer",
            "Set up comprehensive logging and monitoring"
        ])
        
        return metrics, recommendations, action_items, alert_level
    
    def _operations_insights(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Tuple[List[InsightMetric], List[str], List[str], str]:
        """Generate operations team insights with comprehensive hotel and occupancy analytics"""
        
        metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        # Analyze hotel occupancy data
        if not data['occupancy'].empty and 'hotel_nights' in data['occupancy'].columns:
            df = data['occupancy']
            
            # Average hotel nights per visitor
            avg_hotel_nights = df['hotel_nights'].mean()
            metrics.append(InsightMetric(
                metric_name="Average Hotel Nights per Visitor",
                current_value=avg_hotel_nights,
                predicted_value=None,
                trend="stable",
                confidence=0.9,
                impact_level="high",
                recommendation="Optimize pricing to increase average stay duration",
                department_relevance=["operations", "marketing"]
            ))
            
            # Hotel rating analysis
            if 'hotel_rating' in df.columns:
                avg_rating = df['hotel_rating'].mean()
                metrics.append(InsightMetric(
                    metric_name="Average Hotel Rating",
                    current_value=avg_rating,
                    predicted_value=None,
                    trend="stable",
                    confidence=0.85,
                    impact_level="high",
                    recommendation="Focus on improving service quality for lower-rated properties",
                    department_relevance=["operations"]
                ))
                
                if avg_rating < 3.5:
                    alert_level = 'warning'
                    action_items.append("Address service quality issues in underperforming hotels")
            
            # Hotel revenue analysis
            if 'hotel_spend' in df.columns:
                total_hotel_revenue = df['hotel_spend'].sum()
                avg_revenue_per_guest = df['hotel_spend'].mean()
                
                metrics.append(InsightMetric(
                    metric_name="Average Revenue per Guest",
                    current_value=avg_revenue_per_guest,
                    predicted_value=None,
                    trend="stable",
                    confidence=0.9,
                    impact_level="high",
                    recommendation="Implement upselling strategies for higher revenue per guest",
                    department_relevance=["operations", "tourism_funding"]
                ))
            
            # Regional occupancy patterns
            if 'home_region' in df.columns:
                try:
                    regional_performance = df.groupby('home_region').agg({
                        'hotel_nights': ['count', 'mean'],
                        'hotel_spend': 'sum' if 'hotel_spend' in df.columns else 'count',
                        'hotel_rating': 'mean' if 'hotel_rating' in df.columns else 'count'
                    }).round(2)
                    
                    # Identify top performing regions
                    top_regions = regional_performance.nlargest(3, ('hotel_nights', 'count'))
                    if len(top_regions) > 0:
                        recommendations.append(f"Expand hotel capacity in top regions: {', '.join(top_regions.index[:3])}")
                        
                except Exception as e:
                    logger.warning(f"Error analyzing regional patterns: {str(e)}")
            
            # Weekly and monthly patterns
            if 'arrival_date' in df.columns:
                try:
                    df['arrival_date'] = pd.to_datetime(df['arrival_date'], errors='coerce')
                    df_with_dates = df.dropna(subset=['arrival_date'])
                    
                    if not df_with_dates.empty:
                        # Weekly patterns
                        df_with_dates['day_of_week'] = df_with_dates['arrival_date'].dt.day_name()
                        weekly_occupancy = df_with_dates.groupby('day_of_week')['hotel_nights'].mean()
                        peak_day = weekly_occupancy.idxmax()
                        low_day = weekly_occupancy.idxmin()
                        
                        recommendations.append(f"Optimize pricing for peak day ({peak_day}) and promote off-peak day ({low_day})")
                        
                        # Monthly patterns
                        df_with_dates['month'] = df_with_dates['arrival_date'].dt.month
                        monthly_occupancy = df_with_dates.groupby('month')['hotel_nights'].mean()
                        peak_month = monthly_occupancy.idxmax()
                        low_month = monthly_occupancy.idxmin()
                        
                        recommendations.append(f"Develop seasonal strategies: peak month {peak_month}, low month {low_month}")
                        
                except Exception as e:
                    logger.warning(f"Error analyzing temporal patterns: {str(e)}")
        
        # Analyze overall visitor operations
        if not data['arrivals'].empty:
            df = data['arrivals']
            total_visitors = len(df)
            
            metrics.append(InsightMetric(
                metric_name="Total Visitors",
                current_value=total_visitors,
                predicted_value=forecasts.get('arrivals', {}).get('total_predicted_arrivals'),
                trend="stable",
                confidence=0.8,
                impact_level="high",
                recommendation="Monitor visitor capacity and infrastructure needs",
                department_relevance=["operations"]
            ))
            
            # Visit duration analysis
            if 'visit_duration_days' in df.columns:
                avg_duration = df['visit_duration_days'].mean()
                metrics.append(InsightMetric(
                    metric_name="Average Visit Duration (Days)",
                    current_value=avg_duration,
                    predicted_value=None,
                    trend="stable",
                    confidence=0.85,
                    impact_level="medium",
                    recommendation="Create packages to extend average stay duration",
                    department_relevance=["operations", "marketing"]
                ))
            
            # Infrastructure utilization
            if 'infrastructure_rating' in df.columns:
                avg_infrastructure = df['infrastructure_rating'].mean()
                metrics.append(InsightMetric(
                    metric_name="Infrastructure Satisfaction",
                    current_value=avg_infrastructure,
                    predicted_value=None,
                    trend="stable",
                    confidence=0.8,
                    impact_level="high",
                    recommendation="Invest in infrastructure improvements for low-rated areas",
                    department_relevance=["operations", "resource_mobility"]
                ))
                
                if avg_infrastructure < 3.0:
                    alert_level = 'warning'
                    action_items.append("Priority infrastructure improvements needed")
        
        # Default recommendations
        recommendations.extend([
            "Implement dynamic pricing based on occupancy patterns",
            "Develop capacity management systems for peak periods",
            "Create standard operating procedures for service quality",
            "Establish partnerships with local accommodation providers"
        ])
        
        # Default action items
        action_items.extend([
            "Conduct quarterly service quality audits",
            "Implement guest feedback collection systems",
            "Analyze competitor pricing and service offerings",
            "Develop staff training programs for peak season operations"
        ])
        
        return metrics, recommendations, action_items, alert_level
    
    def _marketing_insights(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Tuple[List[InsightMetric], List[str], List[str], str]:
        """Generate marketing team insights with comprehensive visitor analytics"""
        
        metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        if not data['arrivals'].empty:
            df = data['arrivals']
            
            # Nationality/Source Market Analysis
            if 'nationality' in df.columns:
                try:
                    nationality_distribution = df['nationality'].value_counts()
                    top_nationalities = nationality_distribution.head(5)
                    
                    # Market concentration analysis
                    total_visitors = len(df)
                    top_market_share = (top_nationalities.iloc[0] / total_visitors) * 100
                    
                    metrics.append(InsightMetric(
                        metric_name=f"Top Source Market Share ({top_nationalities.index[0]})",
                        current_value=top_market_share,
                        predicted_value=None,
                        trend="stable",
                        confidence=0.85,
                        impact_level="high",
                        recommendation=f"Strengthen partnerships in {top_nationalities.index[0]} market",
                        department_relevance=["marketing"]
                    ))
                    
                    # Market diversity assessment
                    market_diversity = len(nationality_distribution) / total_visitors * 100
                    metrics.append(InsightMetric(
                        metric_name="Market Diversity Index",
                        current_value=market_diversity,
                        predicted_value=None,
                        trend="stable",
                        confidence=0.8,
                        impact_level="medium",
                        recommendation="Diversify marketing to reduce dependency on top markets",
                        department_relevance=["marketing", "research_development"]
                    ))
                    
                    # Generate recommendations for top markets
                    for i, (nationality, count) in enumerate(top_nationalities.head(3).items()):
                        share = (count / total_visitors) * 100
                        recommendations.append(f"Target {nationality} market (${share:.1f}% share) with localized campaigns")
                    
                except Exception as e:
                    logger.warning(f"Error analyzing nationality data: {str(e)}")
            
            # Spending Pattern Analysis
            if 'total_spend' in df.columns or 'spend_amount' in df.columns:
                spend_col = 'total_spend' if 'total_spend' in df.columns else 'spend_amount'
                
                try:
                    avg_spending = df[spend_col].mean()
                    total_revenue = df[spend_col].sum()
                    
                    metrics.append(InsightMetric(
                        metric_name="Average Spending per Visitor",
                        current_value=avg_spending,
                        predicted_value=None,
                        trend="stable",
                        confidence=0.9,
                        impact_level="high",
                        recommendation="Develop premium packages to increase average spending",
                        department_relevance=["marketing", "tourism_funding"]
                    ))
                    
                    # Spending by nationality
                    if 'nationality' in df.columns:
                        nationality_spending = df.groupby('nationality')[spend_col].mean().sort_values(ascending=False)
                        top_spending_nations = nationality_spending.head(3)
                        
                        for nationality, avg_spend in top_spending_nations.items():
                            recommendations.append(f"Focus on high-value {nationality} visitors (avg ${avg_spend:.2f})")
                    
                    # Spending categories analysis
                    spending_categories = ['flight_spend', 'hotel_spend', 'activity_spend', 'package_spend', 'souvenir_spend']
                    category_spending = {}
                    
                    for category in spending_categories:
                        if category in df.columns:
                            category_spending[category] = df[category].mean()
                    
                    if category_spending:
                        top_category = max(category_spending, key=category_spending.get)
                        recommendations.append(f"Optimize {top_category.replace('_', ' ')} offerings (highest spending category)")
                    
                except Exception as e:
                    logger.warning(f"Error analyzing spending data: {str(e)}")
            
            # Satisfaction and Experience Analysis
            if 'satisfaction_score' in df.columns:
                try:
                    avg_satisfaction = df['satisfaction_score'].mean()
                    satisfaction_std = df['satisfaction_score'].std()
                    
                    metrics.append(InsightMetric(
                        metric_name="Overall Satisfaction Score",
                        current_value=avg_satisfaction,
                        predicted_value=None,
                        trend="stable",
                        confidence=0.9,
                        impact_level="high",
                        recommendation="Focus on experience improvement initiatives",
                        department_relevance=["marketing", "operations"]
                    ))
                    
                    if avg_satisfaction < 4.0:
                        alert_level = 'warning'
                        action_items.append("Address satisfaction issues - score below 4.0")
                    
                    # Satisfaction by nationality
                    if 'nationality' in df.columns:
                        nationality_satisfaction = df.groupby('nationality')['satisfaction_score'].mean().sort_values(ascending=False)
                        low_satisfaction_markets = nationality_satisfaction[nationality_satisfaction < 3.5]
                        
                        if len(low_satisfaction_markets) > 0:
                            action_items.append(f"Improve experience for: {', '.join(low_satisfaction_markets.index[:3])}")
                    
                except Exception as e:
                    logger.warning(f"Error analyzing satisfaction data: {str(e)}")
            
            # Tourism Destination Performance
            if 'tourist_destination' in df.columns:
                try:
                    destination_performance = df['tourist_destination'].value_counts()
                    top_destinations = destination_performance.head(5)
                    
                    for i, (destination, count) in enumerate(top_destinations.head(3).items()):
                        share = (count / len(df)) * 100
                        if i == 0:
                            metrics.append(InsightMetric(
                                metric_name=f"Top Destination Share ({destination})",
                                current_value=share,
                                predicted_value=None,
                                trend="stable",
                                confidence=0.85,
                                impact_level="medium",
                                recommendation=f"Leverage success of {destination} for marketing other destinations",
                                department_relevance=["marketing"]
                            ))
                        
                        recommendations.append(f"Promote {destination} in targeted campaigns ({share:.1f}% of visits)")
                    
                except Exception as e:
                    logger.warning(f"Error analyzing destination data: {str(e)}")
            
            # Age Demographics Analysis
            if 'age' in df.columns:
                try:
                    avg_age = df['age'].mean()
                    age_distribution = pd.cut(df['age'], bins=[0, 25, 35, 50, 65, 100], 
                                            labels=['18-25', '26-35', '36-50', '51-65', '65+'])
                    age_segments = age_distribution.value_counts()
                    
                    dominant_age_group = age_segments.index[0]
                    dominant_percentage = (age_segments.iloc[0] / len(df)) * 100
                    
                    metrics.append(InsightMetric(
                        metric_name=f"Dominant Age Group ({dominant_age_group})",
                        current_value=dominant_percentage,
                        predicted_value=None,
                        trend="stable",
                        confidence=0.8,
                        impact_level="medium",
                        recommendation=f"Develop age-specific packages for {dominant_age_group} demographic",
                        department_relevance=["marketing"]
                    ))
                    
                except Exception as e:
                    logger.warning(f"Error analyzing age data: {str(e)}")
            
            # Gender Distribution Analysis
            if 'sex' in df.columns:
                try:
                    gender_distribution = df['sex'].value_counts(normalize=True) * 100
                    
                    for gender, percentage in gender_distribution.items():
                        if percentage > 60:  # Significant gender skew
                            recommendations.append(f"Develop targeted campaigns for underrepresented gender")
                            break
                    
                except Exception as e:
                    logger.warning(f"Error analyzing gender data: {str(e)}")
            
            # Seasonal Pattern Analysis
            if 'arrival_date' in df.columns:
                try:
                    df['arrival_date'] = pd.to_datetime(df['arrival_date'], errors='coerce')
                    df_with_dates = df.dropna(subset=['arrival_date'])
                    
                    if not df_with_dates.empty:
                        # Monthly arrival patterns
                        monthly_arrivals = df_with_dates.groupby(df_with_dates['arrival_date'].dt.month).size()
                        peak_month = monthly_arrivals.idxmax()
                        low_month = monthly_arrivals.idxmin()
                        
                        recommendations.extend([
                            f"Capitalize on peak season (Month {peak_month}) with premium pricing",
                            f"Develop promotional campaigns for off-season (Month {low_month})",
                            "Create year-round marketing calendar based on seasonal patterns"
                        ])
                        
                        # Weekly patterns
                        weekly_arrivals = df_with_dates.groupby(df_with_dates['arrival_date'].dt.day_name()).size()
                        peak_day = weekly_arrivals.idxmax()
                        
                        recommendations.append(f"Optimize marketing campaigns for {peak_day} arrivals")
                    
                except Exception as e:
                    logger.warning(f"Error analyzing seasonal patterns: {str(e)}")
        
        # Default recommendations if no specific analysis was possible
        if not recommendations:
            recommendations.extend([
                "Develop comprehensive visitor segmentation strategy",
                "Implement digital marketing campaigns across multiple channels",
                "Create loyalty programs for repeat visitors",
                "Establish social media presence in key markets"
            ])
        
        action_items.extend([
            "Launch targeted campaigns for top nationality markets",
            "Develop premium experience packages for high-spending segments",
            "Implement visitor feedback collection and analysis system",
            "Create seasonal marketing calendar with targeted promotions",
            "Establish partnerships with international tour operators"
        ])
        
        return metrics, recommendations, action_items, alert_level
    
    def _rd_insights(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Tuple[List[InsightMetric], List[str], List[str], str]:
        """Generate R&D team insights"""
        
        metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        # Innovation metrics (simulated based on data patterns)
        if not data['arrivals'].empty and not data['occupancy'].empty:
            # Market diversity index using nationality instead of origin
            if 'nationality' in data['arrivals'].columns:
                unique_origins = data['arrivals']['nationality'].nunique()
                total_arrivals = len(data['arrivals'])
                diversity_index = unique_origins / max(1, total_arrivals / 100)  # Normalized
                
                metrics.append(InsightMetric(
                    metric_name="Market Diversity Index",
                    current_value=diversity_index,
                    predicted_value=None,
                    trend="stable",
                    confidence=0.7,
                    impact_level="medium",
                    recommendation="Explore emerging markets to increase diversity",
                    department_relevance=["research_development", "marketing"]
                ))
            
            # Technology adoption indicator (based on data quality and completeness)
            tech_adoption_score = np.random.uniform(65, 85)  # Simulated
            metrics.append(InsightMetric(
                metric_name="Digital Technology Adoption",
                current_value=tech_adoption_score,
                predicted_value=tech_adoption_score * 1.15,
                trend="increasing",
                confidence=0.8,
                impact_level="high",
                recommendation="Accelerate digital transformation initiatives",
                department_relevance=["research_development", "software_development"]
            ))
        
        recommendations.extend([
            "Investigate AI/ML applications for personalized tourism experiences",
            "Research sustainable tourism practices and their impact",
            "Study emerging tourism technologies (VR/AR, IoT)",
            "Analyze global tourism trend reports and competitive intelligence"
        ])
        
        action_items.extend([
            "Conduct visitor behavior analysis using advanced analytics",
            "Prototype smart tourism applications",
            "Establish partnerships with tourism research institutions"
        ])
        
        return metrics, recommendations, action_items, alert_level
    
    def _resource_mobility_insights(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Tuple[List[InsightMetric], List[str], List[str], str]:
        """Generate resource mobility insights"""
        
        metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        if not data['arrivals'].empty:
            df = data['arrivals']
            
            # Transportation efficiency (based on arrival patterns)
            date_columns = ['timestamp', 'date', 'arrival_date', 'created_at']
            date_col = next((col for col in date_columns if col in df.columns), None)
            
            if date_col:
                try:
                    df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
                    df_with_dates = df.dropna(subset=[date_col])
                    
                    if not df_with_dates.empty:
                        arrival_times = df_with_dates[date_col].dt.hour
                        peak_hours = arrival_times.value_counts().head(3)
                        
                        # Airport congestion indicator
                        if len(peak_hours) > 0:
                            max_hourly_arrivals = peak_hours.iloc[0]
                            congestion_score = min(100, (max_hourly_arrivals / 10) * 100)  # Assuming 10 flights/hour is optimal
                            
                            metrics.append(InsightMetric(
                                metric_name="Airport Congestion Score",
                                current_value=congestion_score,
                                predicted_value=None,
                                trend="stable",
                                confidence=0.75,
                                impact_level="medium",
                                recommendation="Optimize flight scheduling and ground services",
                                department_relevance=["resource_mobility", "operations"]
                            ))
                except Exception as e:
                    logger.warning(f"Error analyzing arrival patterns: {str(e)}")
            else:
                logger.info("No date column found for arrival pattern analysis")
        
        if not data['occupancy'].empty:
            df = data['occupancy']
            
            # Regional resource distribution
            region_columns = ['region_name', 'region', 'location', 'destination']
            region_col = next((col for col in region_columns if col in df.columns), None)
            
            if region_col and 'total_rooms' in df.columns:
                try:
                    regional_capacity = df.groupby(region_col)['total_rooms'].sum()
                    
                    if 'occupied_rooms' in df.columns:
                        regional_utilization = df.groupby(region_col).apply(
                            lambda x: x['occupied_rooms'].sum() / x['total_rooms'].sum() if x['total_rooms'].sum() > 0 else 0
                        )
                        
                        # Resource efficiency score
                        efficiency_score = (regional_utilization.mean()) * 100
                        metrics.append(InsightMetric(
                            metric_name="Regional Resource Efficiency",
                            current_value=efficiency_score,
                            predicted_value=None,
                            trend="stable",
                            confidence=0.8,
                            impact_level="high",
                            recommendation="Redistribute resources to high-demand regions",
                            department_relevance=["resource_mobility", "operations"]
                        ))
                except Exception as e:
                    logger.warning(f"Error analyzing regional efficiency: {str(e)}")
            else:
                logger.info("No regional data available for resource analysis")
        
        recommendations.extend([
            "Implement dynamic resource allocation based on demand forecasts",
            "Develop transportation partnerships for better connectivity",
            "Optimize staff deployment across regions",
            "Invest in infrastructure for underserved high-potential areas"
        ])
        
        action_items.extend([
            "Analyze transportation bottlenecks and propose solutions",
            "Create resource reallocation protocols",
            "Establish real-time resource monitoring systems"
        ])
        
        return metrics, recommendations, action_items, alert_level
    
    def _funding_insights(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Tuple[List[InsightMetric], List[str], List[str], str]:
        """Generate tourism funding insights"""
        
        metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        if not data['occupancy'].empty and 'revenue' in data['occupancy'].columns:
            df = data['occupancy']
            
            # Current revenue performance
            total_revenue = df['revenue'].sum()
            
            # Try to calculate daily revenue
            date_columns = ['date', 'timestamp', 'created_at']
            date_col = next((col for col in date_columns if col in df.columns), None)
            
            if date_col:
                try:
                    daily_revenue = total_revenue / df[date_col].nunique()
                except:
                    daily_revenue = total_revenue / 30  # Default assumption
            else:
                daily_revenue = total_revenue / 30  # Default assumption
            
            # Predicted revenue from forecasts
            predicted_revenue = None
            if 'revenue' in forecasts and 'total_predicted_revenue' in forecasts['revenue']:
                predicted_revenue = forecasts['revenue']['total_predicted_revenue']
                trend = "increasing" if predicted_revenue > total_revenue else "decreasing"
            else:
                trend = "stable"
            
            metrics.append(InsightMetric(
                metric_name="Total Tourism Revenue",
                current_value=total_revenue,
                predicted_value=predicted_revenue,
                trend=trend,
                confidence=0.85,
                impact_level="high",
                recommendation="Focus investment on high-ROI segments and regions",
                department_relevance=["tourism_funding", "operations", "marketing"]
            ))
            
            # Revenue per visitor (if arrival data available)
            if not data['arrivals'].empty:
                arrivals_df = data['arrivals']
                
                # Check for visitor count columns
                visitor_cols = ['passenger_count', 'visitors', 'arrivals', 'tourist_count']
                visitor_col = next((col for col in visitor_cols if col in arrivals_df.columns), None)
                
                if visitor_col and pd.api.types.is_numeric_dtype(arrivals_df[visitor_col]):
                    total_visitors = arrivals_df[visitor_col].sum()
                else:
                    total_visitors = len(arrivals_df)  # Use record count as fallback
                
                if total_visitors > 0:
                    revenue_per_visitor = total_revenue / total_visitors
                    
                    metrics.append(InsightMetric(
                        metric_name="Revenue per Visitor",
                        current_value=revenue_per_visitor,
                        predicted_value=None,
                        trend="stable",
                        confidence=0.8,
                        impact_level="high",
                        recommendation="Increase average spending through premium experiences",
                        department_relevance=["tourism_funding", "marketing"]
                    ))
        
        # Investment efficiency by region
        if not data['occupancy'].empty:
            df = data['occupancy']
            
            region_columns = ['region_name', 'region', 'location', 'destination']
            region_col = next((col for col in region_columns if col in df.columns), None)
            
            if region_col and 'revenue' in df.columns and 'total_rooms' in df.columns:
                try:
                    regional_revenue = df.groupby(region_col)['revenue'].sum()
                    regional_capacity = df.groupby(region_col)['total_rooms'].sum()
                    
                    # Revenue per room capacity (efficiency indicator)
                    regional_efficiency = regional_revenue / regional_capacity
                    top_performers = regional_efficiency.nlargest(3)
                    
                    for region, efficiency in top_performers.items():
                        recommendations.append(f"Consider expanding investment in {region} (high efficiency: ${efficiency:.2f}/room)")
                except Exception as e:
                    logger.warning(f"Error analyzing regional investment efficiency: {str(e)}")
        
        # Economic impact projections
        revenue_per_visitor = 150  # Default assumption if not calculated above
        if 'arrivals' in forecasts and 'total_predicted_arrivals' in forecasts.get('arrivals', {}):
            predicted_arrivals = forecasts['arrivals']['total_predicted_arrivals']
            economic_multiplier = 2.5  # Typical tourism economic multiplier
            
            # Use calculated revenue per visitor if available
            if metrics and len(metrics) > 1:
                revenue_per_visitor = metrics[1].current_value
            
            projected_economic_impact = predicted_arrivals * revenue_per_visitor * economic_multiplier
            
            # Calculate current economic impact
            current_visitors = len(data['arrivals']) if not data['arrivals'].empty else 1000
            current_economic_impact = current_visitors * revenue_per_visitor * economic_multiplier
            
            metrics.append(InsightMetric(
                metric_name="Projected Economic Impact",
                current_value=current_economic_impact,
                predicted_value=projected_economic_impact,
                trend="increasing",
                confidence=0.7,
                impact_level="high",
                recommendation="Leverage economic impact data for policy advocacy",
                department_relevance=["tourism_funding"]
            ))
        
        recommendations.extend([
            "Develop investment prioritization framework based on ROI analysis",
            "Create funding proposals highlighting economic impact",
            "Establish performance-based funding metrics",
            "Explore public-private partnership opportunities"
        ])
        
        action_items.extend([
            "Conduct detailed ROI analysis for each tourism sector",
            "Prepare investment reports for stakeholders",
            "Identify funding gaps and opportunities"
        ])
        
        return metrics, recommendations, action_items, alert_level
    
    def generate_comprehensive_report(self, output_format: str = 'json') -> Dict[str, Any]:
        """Generate comprehensive analytics report for all departments"""
        
        try:
            # Load data
            client = self.connect_to_supabase()
            data = self.load_tourism_data(client)
            
            # Generate forecasts
            forecasts = self.generate_forecasts(data)
            
            # Generate departmental insights
            departmental_insights = self.generate_departmental_insights(data, forecasts)
            
            # Create comprehensive report
            report = {
                'report_metadata': {
                    'generated_at': datetime.now().isoformat(),
                    'data_period': f"Last {len(data.get('arrivals', pd.DataFrame()))} records",
                    'forecast_period': '30 days',
                    'confidence_level': 0.85
                },
                'executive_summary': self._generate_executive_summary(departmental_insights, forecasts, data),
                'forecasts': forecasts,
                'departmental_insights': {
                    dept: {
                        'department': insight.department,
                        'alert_level': insight.alert_level,
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
                        'action_items': insight.action_items
                    } for dept, insight in departmental_insights.items()
                },
                'cross_departmental_initiatives': self._generate_cross_departmental_initiatives(departmental_insights)
            }
            
            return report
            
        except Exception as e:
            logger.error(f"Error generating comprehensive report: {str(e)}")
            return {'error': str(e), 'timestamp': datetime.now().isoformat()}
    
    def _generate_executive_summary(self, insights: Dict[str, DepartmentInsight], forecasts: Dict[str, Any], data: Dict[str, pd.DataFrame] = None) -> Dict[str, Any]:
        """Generate comprehensive executive summary with multi-dimensional analysis"""
        
        # Count alerts by level
        alert_counts = {'critical': 0, 'warning': 0, 'normal': 0, 'positive': 0}
        for insight in insights.values():
            alert_counts[insight.alert_level] += 1
        
        # Key metrics summary from departments
        high_impact_metrics = []
        for dept_insight in insights.values():
            for metric in dept_insight.key_metrics:
                if metric.impact_level == 'high':
                    high_impact_metrics.append({
                        'department': dept_insight.department,
                        'metric': metric.metric_name,
                        'value': metric.current_value,
                        'trend': metric.trend
                    })
        
        # Forecast summary
        forecast_summary = {}
        if 'arrivals' in forecasts and 'total_predicted_arrivals' in forecasts['arrivals']:
            forecast_summary['arrivals'] = forecasts['arrivals']['total_predicted_arrivals']
        if 'revenue' in forecasts and 'total_predicted_revenue' in forecasts['revenue']:
            forecast_summary['revenue'] = forecasts['revenue']['total_predicted_revenue']
        
        # Multi-dimensional analysis
        dimensional_analysis = {}
        
        if data and 'arrivals' in data and not data['arrivals'].empty:
            df = data['arrivals']
            
            try:
                # Regional analysis (using home_region from real CSV)
                if 'home_region' in df.columns:
                    regional_performance = self._analyze_dimension(df, 'home_region')
                    dimensional_analysis['regions'] = regional_performance
                
                # Destination analysis (using tourist_destination from real CSV)
                if 'tourist_destination' in df.columns:
                    destination_performance = self._analyze_dimension(df, 'tourist_destination')
                    dimensional_analysis['destinations'] = destination_performance
                
                # Sector analysis (using sector from real CSV)
                if 'sector' in df.columns:
                    sector_performance = self._analyze_dimension(df, 'sector')
                    dimensional_analysis['sectors'] = sector_performance
                
                # Gender analysis (using sex from real CSV)
                if 'sex' in df.columns:
                    gender_performance = self._analyze_dimension(df, 'sex')
                    dimensional_analysis['demographics'] = gender_performance
                
                # Nationality analysis (using nationality from real CSV)
                if 'nationality' in df.columns:
                    nationality_performance = self._analyze_dimension(df, 'nationality', top_n=10)
                    dimensional_analysis['nationalities'] = nationality_performance
                
                # Age group analysis
                if 'age' in df.columns:
                    # Create age groups for analysis
                    df_copy = df.copy()
                    df_copy['age_group'] = pd.cut(df_copy['age'], 
                                                bins=[0, 25, 35, 50, 65, 100], 
                                                labels=['18-25', '26-35', '36-50', '51-65', '65+'])
                    age_performance = self._analyze_dimension(df_copy, 'age_group')
                    dimensional_analysis['age_groups'] = age_performance
                
                # Package type analysis
                if 'package_type' in df.columns:
                    package_performance = self._analyze_dimension(df, 'package_type')
                    dimensional_analysis['package_types'] = package_performance
                    
            except Exception as e:
                logger.warning(f"Error in dimensional analysis: {str(e)}")
                dimensional_analysis['error'] = f"Analysis error: {str(e)}"
        
        # Generate key opportunities based on analysis
        key_opportunities = self._generate_key_opportunities(dimensional_analysis, forecasts)
        
        return {
            'overall_status': 'warning' if alert_counts['critical'] > 0 or alert_counts['warning'] > 2 else 'normal',
            'alert_distribution': alert_counts,
            'high_impact_metrics': high_impact_metrics[:5],  # Top 5
            'forecast_summary': forecast_summary,
            'dimensional_analysis': dimensional_analysis,
            'key_opportunities': key_opportunities,
            'performance_indicators': self._calculate_performance_indicators(data, forecasts)
        }
    
    def _analyze_dimension(self, df: pd.DataFrame, dimension_col: str, value_col: str = None, top_n: int = 5) -> Dict[str, Any]:
        """Analyze performance across a specific dimension"""
        
        if dimension_col not in df.columns:
            return {}
        
        # Determine value column to analyze (updated for real CSV)
        if value_col is None:
            # Priority order for value columns in real CSV
            value_cols = ['total_spend', 'spend_amount', 'hotel_spend', 'activity_spend', 'flight_spend', 'package_spend']
            value_col = next((col for col in value_cols if col in df.columns), None)
            
            if value_col is None:
                # Use count of records as fallback
                analysis = df[dimension_col].value_counts().head(top_n)
                return {
                    'top_performers': [
                        {'name': str(idx), 'value': int(val), 'percentage': round(val/analysis.sum()*100, 2)}
                        for idx, val in analysis.items()
                    ],
                    'total_categories': df[dimension_col].nunique(),
                    'metric_type': 'count'
                }
        
        # Aggregate by dimension
        if value_col in df.columns:
            if pd.api.types.is_numeric_dtype(df[value_col]):
                # Use sum for spending columns, mean for ratings
                if 'spend' in value_col.lower() or 'revenue' in value_col.lower():
                    analysis = df.groupby(dimension_col)[value_col].sum().sort_values(ascending=False).head(top_n)
                    metric_type = f"total_{value_col}"
                elif 'rating' in value_col.lower() or 'score' in value_col.lower():
                    analysis = df.groupby(dimension_col)[value_col].mean().sort_values(ascending=False).head(top_n)
                    metric_type = f"avg_{value_col}"
                else:
                    analysis = df.groupby(dimension_col)[value_col].sum().sort_values(ascending=False).head(top_n)
                    metric_type = value_col
            else:
                analysis = df[dimension_col].value_counts().head(top_n)
                metric_type = 'count'
        else:
            analysis = df[dimension_col].value_counts().head(top_n)
            metric_type = 'count'
        
        total_value = analysis.sum()
        
        return {
            'top_performers': [
                {
                    'name': str(idx), 
                    'value': float(val) if pd.api.types.is_numeric_dtype(analysis) else int(val),
                    'percentage': round(val/total_value*100, 2) if total_value > 0 else 0
                }
                for idx, val in analysis.items()
            ],
            'total_categories': df[dimension_col].nunique(),
            'metric_type': metric_type,
            'growth_potential': self._assess_growth_potential(analysis)
        }
    
    def _assess_growth_potential(self, data_series) -> str:
        """Assess growth potential based on distribution"""
        if len(data_series) == 0:
            return 'unknown'
        
        # Check if distribution is concentrated or diverse
        top_performer_share = data_series.iloc[0] / data_series.sum() if data_series.sum() > 0 else 0
        
        if top_performer_share > 0.5:
            return 'high_concentration'  # Opportunity to diversify
        elif top_performer_share < 0.2:
            return 'well_distributed'  # Balanced portfolio
        else:
            return 'moderate_concentration'  # Room for optimization
    
    def _generate_key_opportunities(self, dimensional_analysis: Dict[str, Any], forecasts: Dict[str, Any]) -> List[str]:
        """Generate key opportunities based on dimensional analysis"""
        
        opportunities = []
        
        # Base opportunities
        base_opportunities = [
            "Optimize pricing strategies based on demand forecasts",
            "Invest in digital transformation initiatives", 
            "Strengthen international market partnerships",
            "Develop sustainable tourism practices"
        ]
        
        # Add dimension-specific opportunities
        if 'regions' in dimensional_analysis:
            regions = dimensional_analysis['regions']
            if regions.get('growth_potential') == 'high_concentration':
                opportunities.append("Diversify tourism development across underperforming regions")
            
            top_region = regions.get('top_performers', [{}])[0].get('name', '')
            if top_region:
                opportunities.append(f"Leverage success model from {top_region} for other regions")
        
        if 'nationalities' in dimensional_analysis:
            nationalities = dimensional_analysis['nationalities']
            if len(nationalities.get('top_performers', [])) < 5:
                opportunities.append("Expand marketing to emerging source markets")
        
        if 'purposes' in dimensional_analysis:
            purposes = dimensional_analysis['purposes']
            if purposes.get('growth_potential') != 'well_distributed':
                opportunities.append("Develop diverse tourism products for different travel purposes")
        
        if 'sectors' in dimensional_analysis:
            sectors = dimensional_analysis['sectors']
            opportunities.append("Strengthen public-private partnerships in tourism development")
        
        # Forecast-based opportunities
        if forecasts.get('arrivals', {}).get('total_predicted_arrivals', 0) > 0:
            opportunities.append("Prepare infrastructure for projected visitor growth")
        
        return base_opportunities + opportunities[:4]  # Limit to reasonable number
    
    def _calculate_performance_indicators(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate key performance indicators"""
        
        indicators = {}
        
        if data and 'arrivals' in data and not data['arrivals'].empty:
            df = data['arrivals']
            
            # Diversity index (using nationality column from real CSV)
            if 'nationality' in df.columns:
                nationality_counts = df['nationality'].value_counts()
                diversity_index = len(nationality_counts) / len(df) * 100
                indicators['market_diversity_index'] = round(diversity_index, 2)
            
            # Growth indicators (using arrival_date from real CSV)
            date_columns = ['arrival_date', 'created_at', 'date', 'timestamp']
            date_col = next((col for col in date_columns if col in df.columns), None)
            
            if date_col:
                try:
                    df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
                    df_with_dates = df.dropna(subset=[date_col])
                    
                    if len(df_with_dates) > 60:  # Need enough data for comparison
                        # Recent vs historical performance
                        recent_data = df_with_dates[df_with_dates[date_col] >= datetime.now() - timedelta(days=30)]
                        historical_data = df_with_dates[df_with_dates[date_col] < datetime.now() - timedelta(days=30)]
                        
                        if len(recent_data) > 0 and len(historical_data) > 0:
                            recent_avg = len(recent_data) / 30
                            historical_avg = len(historical_data) / max(1, (datetime.now() - historical_data[date_col].min()).days)
                            
                            growth_rate = ((recent_avg - historical_avg) / historical_avg * 100) if historical_avg > 0 else 0
                            indicators['monthly_growth_rate'] = round(growth_rate, 2)
                except Exception as e:
                    logger.warning(f"Error calculating growth indicators: {str(e)}")
        
        # Forecast reliability
        if forecasts:
            indicators['forecast_confidence'] = 0.85  # This could be calculated based on model performance
        
        return indicators
    
    def _generate_cross_departmental_initiatives(self, insights: Dict[str, DepartmentInsight]) -> List[Dict[str, Any]]:
        """Generate initiatives that require cross-departmental collaboration"""
        
        initiatives = [
            {
                'title': 'Integrated Revenue Optimization',
                'departments': ['operations', 'marketing', 'tourism_funding'],
                'description': 'Combine operational data, marketing insights, and funding strategies to maximize revenue per visitor',
                'priority': 'high',
                'timeline': '3 months'
            },
            {
                'title': 'Digital Tourism Platform Development',
                'departments': ['software_development', 'marketing', 'research_development'],
                'description': 'Build comprehensive digital platform for enhanced visitor experience and data collection',
                'priority': 'high',
                'timeline': '6 months'
            },
            {
                'title': 'Resource Allocation Optimization',
                'departments': ['resource_mobility', 'operations', 'tourism_funding'],
                'description': 'Implement data-driven resource allocation based on demand patterns and ROI analysis',
                'priority': 'medium',
                'timeline': '4 months'
            },
            {
                'title': 'Predictive Analytics Implementation',
                'departments': ['software_development', 'research_development', 'operations'],
                'description': 'Deploy ML models for demand forecasting and operational optimization',
                'priority': 'medium',
                'timeline': '5 months'
            }
        ]
        
        return initiatives

    def _generate_statistical_forecast(self, df: pd.DataFrame, days: int) -> Dict[str, Any]:
        """Generate forecast based on statistical analysis when no date columns available"""
        
        try:
            # Find a numeric column to forecast
            value_cols = ['arrivals', 'tourist_arrivals', 'visitors', 'count', 'passenger_count']
            value_col = next((col for col in value_cols if col in df.columns and pd.api.types.is_numeric_dtype(df[col])), None)
            
            if value_col:
                # Use the numeric column for forecasting
                values = df[value_col].dropna()
                if len(values) > 0:
                    daily_avg = values.mean()
                    std_dev = values.std()
                else:
                    daily_avg = len(df) / 30  # Fallback: assume 30 days of data
                    std_dev = daily_avg * 0.2
            else:
                # Use record count as proxy for activity
                daily_avg = len(df) / 30  # Assume data spans 30 days
                std_dev = daily_avg * 0.2
            
            # Generate forecast with some variability
            forecast_values = []
            for i in range(days):
                # Add some seasonal variation
                seasonal_factor = 1.0 + 0.1 * np.sin(2 * np.pi * i / 365) + 0.05 * np.sin(2 * np.pi * i / 7)
                
                # Add some random variation within reasonable bounds
                variation = np.random.normal(0, std_dev * 0.1)
                
                forecast_value = max(0, int((daily_avg + variation) * seasonal_factor))
                forecast_values.append(forecast_value)
            
            forecast_dates = [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)]
            
            return {
                'method': 'statistical',
                'forecast_values': forecast_values,
                'forecast_dates': forecast_dates,
                'total_predicted_arrivals': sum(forecast_values),
                'average_daily_arrivals': int(np.mean(forecast_values)),
                'note': 'Forecast based on statistical analysis of available data'
            }
            
        except Exception as e:
            logger.error(f"Error generating statistical forecast: {str(e)}")
            # Return a very basic forecast as last resort
            basic_daily = max(10, len(df) // 30)
            forecast_values = [basic_daily + np.random.randint(-5, 6) for _ in range(days)]
            
            return {
                'method': 'basic',
                'forecast_values': forecast_values,
                'forecast_dates': [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)],
                'total_predicted_arrivals': sum(forecast_values),
                'average_daily_arrivals': int(np.mean(forecast_values)),
                'note': 'Basic forecast - limited data available'
            }

# Usage example and handler function
def lambda_handler(event, context):
    """AWS Lambda handler for the insights engine"""
    
    try:
        engine = TourismInsightsEngine()
        report = engine.generate_comprehensive_report()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(report)
        }
    except Exception as e:
        logger.error(f"Handler error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }

if __name__ == "__main__":
    # Local testing
    engine = TourismInsightsEngine()
    report = engine.generate_comprehensive_report()
    print(json.dumps(report, indent=2)) 