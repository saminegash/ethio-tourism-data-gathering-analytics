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
        """Load tourism data from Supabase or generate mock data"""
        
        if client is None:
            return self._generate_mock_data(days_back)
        
        try:
            # Use the SupabaseSyncManager's load method
            sync_manager = SupabaseSyncManager(self.supabase_url, self.supabase_key)
            data = sync_manager.load_tourism_data(days_back)
            
            if not data or all(df.empty for df in data.values()):
                logger.warning("No data loaded from Supabase, using mock data")
                return self._generate_mock_data(days_back)
            
            return data
            
        except Exception as e:
            logger.error(f"Error loading data from Supabase: {str(e)}")
            return self._generate_mock_data(days_back)
    
    def _generate_mock_data(self, days_back: int) -> Dict[str, pd.DataFrame]:
        """Generate realistic mock tourism data for testing"""
        
        np.random.seed(42)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        date_range = pd.date_range(start_date, end_date, freq='D')
        
        # Mock arrivals data
        arrivals_data = []
        for date in date_range:
            daily_flights = np.random.poisson(15)  # Average 15 flights per day
            for _ in range(daily_flights):
                arrivals_data.append({
                    'id': f"flight_{len(arrivals_data)}",
                    'timestamp': date + timedelta(hours=np.random.randint(0, 24)),
                    'flight_number': f"ET{np.random.randint(100, 999)}",
                    'origin': np.random.choice(['London', 'Dubai', 'Nairobi', 'Cairo', 'Istanbul', 'Frankfurt']),
                    'passenger_count': np.random.randint(50, 300),
                    'segment_name': np.random.choice(['Business', 'Leisure', 'Cultural', 'Adventure', 'Religious']),
                    'region_name': 'Addis Ababa'
                })
        
        # Mock occupancy data
        occupancy_data = []
        regions = ['Addis Ababa', 'Lalibela', 'Axum', 'Bahir Dar', 'Gondar']
        for date in date_range:
            for region in regions:
                hotel_count = np.random.randint(5, 20)
                for i in range(hotel_count):
                    total_rooms = np.random.randint(20, 200)
                    base_occupancy = 0.6 + 0.3 * np.sin(2 * np.pi * date.dayofyear / 365)  # Seasonal pattern
                    occupancy_rate = max(0.1, min(0.95, base_occupancy + np.random.normal(0, 0.1)))
                    occupied_rooms = int(total_rooms * occupancy_rate)
                    
                    occupancy_data.append({
                        'id': f"hotel_{region}_{i}_{date.strftime('%Y%m%d')}",
                        'hotel_id': f"hotel_{region}_{i}",
                        'date': date.date(),
                        'total_rooms': total_rooms,
                        'occupied_rooms': occupied_rooms,
                        'revenue': occupied_rooms * np.random.uniform(50, 150),
                        'region_name': region
                    })
        
        return {
            'arrivals': pd.DataFrame(arrivals_data),
            'occupancy': pd.DataFrame(occupancy_data),
            'visits': pd.DataFrame(),  # Simplified for demo
            'surveys': pd.DataFrame()  # Simplified for demo
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
        
        # Aggregate daily arrivals
        arrivals_df['date'] = pd.to_datetime(arrivals_df['timestamp']).dt.date
        daily_arrivals = arrivals_df.groupby('date').agg({
            'passenger_count': 'sum',
            'flight_number': 'count'
        }).reset_index()
        
        daily_arrivals['date'] = pd.to_datetime(daily_arrivals['date'])
        daily_arrivals = daily_arrivals.sort_values('date')
        
        # Use Prophet if available, otherwise simple trend analysis
        if PROPHET_AVAILABLE and len(daily_arrivals) > 30:
            try:
                prophet_df = daily_arrivals[['date', 'passenger_count']].rename(
                    columns={'date': 'ds', 'passenger_count': 'y'}
                )
                
                model = Prophet(daily_seasonality=True, yearly_seasonality=True)
                model.fit(prophet_df)
                
                future = model.make_future_dataframe(periods=days)
                forecast = model.predict(future)
                
                future_dates = forecast.tail(days)
                
                return {
                    'method': 'prophet',
                    'forecast_values': future_dates['yhat'].tolist(),
                    'forecast_dates': future_dates['ds'].dt.strftime('%Y-%m-%d').tolist(),
                    'confidence_intervals': {
                        'lower': future_dates['yhat_lower'].tolist(),
                        'upper': future_dates['yhat_upper'].tolist()
                    },
                    'total_predicted_arrivals': int(future_dates['yhat'].sum()),
                    'average_daily_arrivals': int(future_dates['yhat'].mean())
                }
            except Exception as e:
                logger.warning(f"Prophet forecasting failed: {str(e)}, using simple trend")
        
        # Simple trend-based forecast
        if len(daily_arrivals) > 7:
            recent_trend = daily_arrivals['passenger_count'].tail(7).mean()
            seasonal_factor = 1.0 + 0.1 * np.sin(2 * np.pi * np.arange(days) / 365)
            
            forecast_values = [int(recent_trend * factor) for factor in seasonal_factor]
            forecast_dates = [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)]
            
            return {
                'method': 'trend_analysis',
                'forecast_values': forecast_values,
                'forecast_dates': forecast_dates,
                'total_predicted_arrivals': sum(forecast_values),
                'average_daily_arrivals': int(np.mean(forecast_values))
            }
        
        return {'error': 'Insufficient data for forecasting'}
    
    def _forecast_occupancy(self, occupancy_df: pd.DataFrame, days: int) -> Dict[str, Any]:
        """Forecast hotel occupancy rates"""
        
        # Calculate daily occupancy rates by region
        occupancy_df['occupancy_rate'] = occupancy_df['occupied_rooms'] / occupancy_df['total_rooms']
        occupancy_df['date'] = pd.to_datetime(occupancy_df['date'])
        
        regional_forecasts = {}
        
        for region in occupancy_df['region_name'].unique():
            region_data = occupancy_df[occupancy_df['region_name'] == region]
            daily_occupancy = region_data.groupby('date')['occupancy_rate'].mean().reset_index()
            
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
        
        return {
            'regional_forecasts': regional_forecasts,
            'forecast_dates': [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)]
        }
    
    def _forecast_revenue(self, occupancy_df: pd.DataFrame, days: int) -> Dict[str, Any]:
        """Forecast tourism revenue"""
        
        occupancy_df['date'] = pd.to_datetime(occupancy_df['date'])
        daily_revenue = occupancy_df.groupby('date')['revenue'].sum().reset_index()
        
        if len(daily_revenue) > 7:
            # Trend analysis with growth factors
            recent_avg = daily_revenue['revenue'].tail(7).mean()
            growth_factor = (daily_revenue['revenue'].tail(7).mean() / daily_revenue['revenue'].head(7).mean()) ** (1/7)
            
            forecast_values = []
            for i in range(1, days + 1):
                seasonal_adj = 1.0 + 0.2 * np.sin(2 * np.pi * i / 365)
                predicted_revenue = recent_avg * (growth_factor ** i) * seasonal_adj
                forecast_values.append(predicted_revenue)
            
            return {
                'forecast_values': forecast_values,
                'forecast_dates': [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, days + 1)],
                'total_predicted_revenue': sum(forecast_values),
                'daily_average_revenue': np.mean(forecast_values),
                'growth_rate_daily': (growth_factor - 1) * 100
            }
        
        return {'error': 'Insufficient data for revenue forecasting'}
    
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
        """Generate operations team insights"""
        
        metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        if not data['occupancy'].empty:
            # Current occupancy rate
            current_occupancy = (data['occupancy']['occupied_rooms'].sum() / data['occupancy']['total_rooms'].sum()) * 100
            
            # Predicted occupancy from forecasts
            predicted_occupancy = None
            if 'occupancy' in forecasts and 'regional_forecasts' in forecasts['occupancy']:
                regional_avg = np.mean([
                    region_data['average_predicted_rate'] 
                    for region_data in forecasts['occupancy']['regional_forecasts'].values()
                ])
                predicted_occupancy = regional_avg * 100
            
            trend = "stable"
            if predicted_occupancy and predicted_occupancy > current_occupancy * 1.05:
                trend = "increasing"
            elif predicted_occupancy and predicted_occupancy < current_occupancy * 0.95:
                trend = "decreasing"
            
            metrics.append(InsightMetric(
                metric_name="Average Occupancy Rate",
                current_value=current_occupancy,
                predicted_value=predicted_occupancy,
                trend=trend,
                confidence=0.85,
                impact_level="high",
                recommendation="Optimize pricing strategies based on demand patterns",
                department_relevance=["operations", "marketing", "tourism_funding"]
            ))
            
            # Revenue efficiency
            if 'revenue' in data['occupancy'].columns:
                revenue_per_room = data['occupancy']['revenue'].sum() / data['occupancy']['occupied_rooms'].sum()
                metrics.append(InsightMetric(
                    metric_name="Revenue per Occupied Room",
                    current_value=revenue_per_room,
                    predicted_value=None,
                    trend="stable",
                    confidence=0.9,
                    impact_level="high",
                    recommendation="Focus on high-value guest segments",
                    department_relevance=["operations", "tourism_funding"]
                ))
        
        # Capacity utilization by region
        if not data['occupancy'].empty:
            regional_performance = data['occupancy'].groupby('region_name').agg({
                'occupied_rooms': 'sum',
                'total_rooms': 'sum'
            })
            regional_performance['utilization'] = regional_performance['occupied_rooms'] / regional_performance['total_rooms']
            
            underperforming_regions = regional_performance[regional_performance['utilization'] < 0.6]
            if len(underperforming_regions) > 0:
                alert_level = 'warning'
                action_items.append(f"Address low occupancy in: {', '.join(underperforming_regions.index.tolist())}")
        
        recommendations.extend([
            "Implement dynamic pricing based on demand forecasts",
            "Develop region-specific marketing strategies",
            "Optimize staff allocation based on occupancy patterns",
            "Consider partnerships with underperforming regions"
        ])
        
        return metrics, recommendations, action_items, alert_level
    
    def _marketing_insights(self, data: Dict[str, pd.DataFrame], forecasts: Dict[str, Any]) -> Tuple[List[InsightMetric], List[str], List[str], str]:
        """Generate marketing team insights"""
        
        metrics = []
        recommendations = []
        action_items = []
        alert_level = 'normal'
        
        if not data['arrivals'].empty:
            # Market segmentation analysis
            segment_distribution = data['arrivals']['segment_name'].value_counts(normalize=True) * 100
            
            for segment, percentage in segment_distribution.head(3).items():
                metrics.append(InsightMetric(
                    metric_name=f"{segment} Segment Share",
                    current_value=percentage,
                    predicted_value=None,
                    trend="stable",
                    confidence=0.8,
                    impact_level="medium",
                    recommendation=f"Develop targeted campaigns for {segment.lower()} travelers",
                    department_relevance=["marketing"]
                ))
            
            # Origin market analysis
            origin_performance = data['arrivals']['origin'].value_counts()
            top_markets = origin_performance.head(3)
            
            recommendations.extend([
                f"Strengthen partnerships in {top_markets.index[0]} (top market)",
                f"Explore expansion opportunities in {top_markets.index[1]} and {top_markets.index[2]}",
                "Develop market-specific promotional materials"
            ])
        
        # Seasonal patterns
        if not data['arrivals'].empty:
            data['arrivals']['month'] = pd.to_datetime(data['arrivals']['timestamp']).dt.month
            monthly_arrivals = data['arrivals'].groupby('month')['passenger_count'].sum()
            
            peak_month = monthly_arrivals.idxmax()
            low_month = monthly_arrivals.idxmin()
            
            recommendations.extend([
                f"Capitalize on peak season (Month {peak_month}) with premium offerings",
                f"Develop off-season promotions for Month {low_month}",
                "Create year-round engagement strategies"
            ])
        
        action_items.extend([
            "Launch digital marketing campaigns for underperforming segments",
            "Develop influencer partnerships in key markets",
            "Implement visitor feedback collection system"
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
            # Market diversity index
            unique_origins = data['arrivals']['origin'].nunique()
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
            # Transportation efficiency (based on arrival patterns)
            arrival_times = pd.to_datetime(data['arrivals']['timestamp']).dt.hour
            peak_hours = arrival_times.value_counts().head(3)
            
            # Airport congestion indicator
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
        
        if not data['occupancy'].empty:
            # Regional resource distribution
            regional_capacity = data['occupancy'].groupby('region_name')['total_rooms'].sum()
            regional_utilization = data['occupancy'].groupby('region_name').apply(
                lambda x: x['occupied_rooms'].sum() / x['total_rooms'].sum()
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
            # Current revenue performance
            total_revenue = data['occupancy']['revenue'].sum()
            daily_revenue = total_revenue / len(data['occupancy']['date'].unique())
            
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
                total_visitors = data['arrivals']['passenger_count'].sum()
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
            regional_revenue = data['occupancy'].groupby('region_name')['revenue'].sum()
            regional_capacity = data['occupancy'].groupby('region_name')['total_rooms'].sum()
            
            # Revenue per room capacity (efficiency indicator)
            regional_efficiency = regional_revenue / regional_capacity
            top_performers = regional_efficiency.nlargest(3)
            
            for region, efficiency in top_performers.items():
                recommendations.append(f"Consider expanding investment in {region} (high efficiency: ${efficiency:.2f}/room)")
        
        # Economic impact projections
        if 'arrivals' in forecasts and 'total_predicted_arrivals' in forecasts.get('arrivals', {}):
            predicted_arrivals = forecasts['arrivals']['total_predicted_arrivals']
            economic_multiplier = 2.5  # Typical tourism economic multiplier
            projected_economic_impact = predicted_arrivals * revenue_per_visitor * economic_multiplier
            
            metrics.append(InsightMetric(
                metric_name="Projected Economic Impact",
                current_value=total_revenue * economic_multiplier,
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
                'executive_summary': self._generate_executive_summary(departmental_insights, forecasts),
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
    
    def _generate_executive_summary(self, insights: Dict[str, DepartmentInsight], forecasts: Dict[str, Any]) -> Dict[str, Any]:
        """Generate executive summary of key findings"""
        
        # Count alerts by level
        alert_counts = {'critical': 0, 'warning': 0, 'normal': 0, 'positive': 0}
        for insight in insights.values():
            alert_counts[insight.alert_level] += 1
        
        # Key metrics summary
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
        
        return {
            'overall_status': 'warning' if alert_counts['critical'] > 0 or alert_counts['warning'] > 2 else 'normal',
            'alert_distribution': alert_counts,
            'high_impact_metrics': high_impact_metrics[:5],  # Top 5
            'forecast_summary': forecast_summary,
            'key_opportunities': [
                "Optimize pricing strategies based on demand forecasts",
                "Invest in digital transformation initiatives",
                "Strengthen international market partnerships",
                "Develop sustainable tourism practices"
            ]
        }
    
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