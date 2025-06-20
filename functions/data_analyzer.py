"""
Ethiopia Tourism Analytics - Serverless Data Analyzer
=====================================================
AWS Lambda-compatible function for processing tourism data and generating insights.
Supports multiple data formats and provides comprehensive analytics for tourism stakeholders.
"""

import json
import pandas as pd
import numpy as np
from io import StringIO
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TourismDataAnalyzer:
    """
    Comprehensive tourism data analyzer supporting multiple data types and analysis methods.
    """
    
    def __init__(self):
        self.supported_formats = ['csv', 'json', 'parquet']
        self.analysis_types = [
            'arrivals_analysis',
            'occupancy_analysis', 
            'satisfaction_analysis',
            'trend_analysis',
            'predictive_insights',
            'regional_comparison'
        ]
    
    def parse_input_data(self, event_body: str, data_format: str = 'csv') -> pd.DataFrame:
        """
        Parse input data from various formats into a pandas DataFrame.
        
        Args:
            event_body: Raw data string
            data_format: Format of the data (csv, json, parquet)
            
        Returns:
            pandas.DataFrame: Parsed data
        """
        try:
            if data_format.lower() == 'csv':
                return pd.read_csv(StringIO(event_body))
            elif data_format.lower() == 'json':
                data = json.loads(event_body)
                return pd.DataFrame(data)
            else:
                raise ValueError(f"Unsupported data format: {data_format}")
        except Exception as e:
            logger.error(f"Error parsing {data_format} data: {str(e)}")
            raise
    
    def analyze_arrivals(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze flight arrivals data for tourism insights.
        
        Args:
            df: DataFrame with columns: flight_number, origin, timestamp, passenger_count
            
        Returns:
            Dict containing arrivals analysis results
        """
        results = {}
        
        try:
            # Convert timestamp if needed
            if 'timestamp' in df.columns:
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                df['date'] = df['timestamp'].dt.date
                df['hour'] = df['timestamp'].dt.hour
                df['day_of_week'] = df['timestamp'].dt.day_name()
            
            # Arrivals by origin country/city
            if 'origin' in df.columns:
                results['arrivals_by_origin'] = df.groupby('origin').size().to_dict()
                results['top_origins'] = df['origin'].value_counts().head(10).to_dict()
            
            # Airline analysis
            if 'airline' in df.columns:
                results['arrivals_by_airline'] = df.groupby('airline').size().to_dict()
            elif 'flight_number' in df.columns:
                # Extract airline from flight number (first 2-3 characters typically)
                df['airline'] = df['flight_number'].str.extract(r'([A-Z]{2,3})')
                results['arrivals_by_airline'] = df.groupby('airline').size().to_dict()
            
            # Passenger volume analysis
            if 'passenger_count' in df.columns:
                results['total_passengers'] = int(df['passenger_count'].sum())
                results['average_passengers_per_flight'] = float(df['passenger_count'].mean())
                results['passenger_volume_by_origin'] = df.groupby('origin')['passenger_count'].sum().to_dict()
            
            # Time-based patterns
            if 'timestamp' in df.columns:
                results['arrivals_by_hour'] = df.groupby('hour').size().to_dict()
                results['arrivals_by_day_of_week'] = df.groupby('day_of_week').size().to_dict()
                results['daily_arrivals'] = {str(k): v for k, v in df.groupby('date').size().to_dict().items()}
            
            # Growth trends (if data spans multiple periods)
            if len(df) > 1 and 'timestamp' in df.columns:
                df_sorted = df.sort_values('timestamp')
                df_sorted['month'] = df_sorted['timestamp'].dt.to_period('M')
                monthly_arrivals = df_sorted.groupby('month').size()
                if len(monthly_arrivals) > 1:
                    growth_rate = ((monthly_arrivals.iloc[-1] - monthly_arrivals.iloc[0]) / monthly_arrivals.iloc[0]) * 100
                    results['monthly_growth_rate_percent'] = float(growth_rate)
                    results['monthly_arrivals'] = {str(k): v for k, v in monthly_arrivals.to_dict().items()}
            
        except Exception as e:
            logger.error(f"Error in arrivals analysis: {str(e)}")
            results['error'] = str(e)
        
        return results
    
    def analyze_occupancy(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze hotel occupancy data for tourism insights.
        
        Args:
            df: DataFrame with columns: hotel_id, date, total_rooms, occupied_rooms, region
            
        Returns:
            Dict containing occupancy analysis results
        """
        results = {}
        
        try:
            # Calculate occupancy rate
            if 'occupied_rooms' in df.columns and 'total_rooms' in df.columns:
                df['occupancy_rate'] = (df['occupied_rooms'] / df['total_rooms']) * 100
                results['average_occupancy_rate'] = float(df['occupancy_rate'].mean())
                results['peak_occupancy_rate'] = float(df['occupancy_rate'].max())
                results['lowest_occupancy_rate'] = float(df['occupancy_rate'].min())
            
            # Regional analysis
            if 'region' in df.columns:
                regional_occupancy = df.groupby('region')['occupancy_rate'].mean().to_dict()
                results['occupancy_by_region'] = {k: float(v) for k, v in regional_occupancy.items()}
            
            # Revenue analysis (if available)
            if 'revenue' in df.columns:
                results['total_revenue'] = float(df['revenue'].sum())
                results['average_daily_revenue'] = float(df['revenue'].mean())
                if 'region' in df.columns:
                    regional_revenue = df.groupby('region')['revenue'].sum().to_dict()
                    results['revenue_by_region'] = {k: float(v) for k, v in regional_revenue.items()}
            
            # Time-based analysis
            if 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'])
                df['month'] = df['date'].dt.month
                df['day_of_week'] = df['date'].dt.day_name()
                
                results['occupancy_by_month'] = df.groupby('month')['occupancy_rate'].mean().to_dict()
                results['occupancy_by_day_of_week'] = df.groupby('day_of_week')['occupancy_rate'].mean().to_dict()
            
            # Capacity utilization
            if 'total_rooms' in df.columns:
                results['total_room_capacity'] = int(df['total_rooms'].sum())
                results['average_hotel_size'] = float(df['total_rooms'].mean())
            
        except Exception as e:
            logger.error(f"Error in occupancy analysis: {str(e)}")
            results['error'] = str(e)
        
        return results
    
    def analyze_satisfaction(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze customer satisfaction survey data.
        
        Args:
            df: DataFrame with columns: rating, sentiment, comments, visit_id
            
        Returns:
            Dict containing satisfaction analysis results
        """
        results = {}
        
        try:
            # Rating analysis
            if 'rating' in df.columns:
                results['average_rating'] = float(df['rating'].mean())
                results['rating_distribution'] = df['rating'].value_counts().to_dict()
                results['satisfaction_score'] = float((df['rating'].mean() / 5) * 100)  # Convert to percentage
            
            # Sentiment analysis
            if 'sentiment' in df.columns:
                sentiment_counts = df['sentiment'].value_counts().to_dict()
                results['sentiment_distribution'] = sentiment_counts
                
                total_responses = len(df)
                if total_responses > 0:
                    results['positive_sentiment_percentage'] = float(
                        (sentiment_counts.get('positive', 0) / total_responses) * 100
                    )
            
            # Comments analysis (basic keyword extraction)
            if 'comments' in df.columns:
                all_comments = ' '.join(df['comments'].dropna().astype(str))
                # Simple keyword frequency (in a real implementation, use NLP libraries)
                words = all_comments.lower().split()
                word_freq = pd.Series(words).value_counts().head(10).to_dict()
                results['top_keywords'] = word_freq
            
            # Response volume
            results['total_responses'] = len(df)
            
        except Exception as e:
            logger.error(f"Error in satisfaction analysis: {str(e)}")
            results['error'] = str(e)
        
        return results
    
    def analyze_trends(self, df: pd.DataFrame, data_type: str) -> Dict[str, Any]:
        """
        Perform trend analysis on time-series tourism data.
        
        Args:
            df: DataFrame with timestamp column
            data_type: Type of data being analyzed
            
        Returns:
            Dict containing trend analysis results
        """
        results = {}
        
        try:
            if 'timestamp' in df.columns:
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                df = df.sort_values('timestamp')
                
                # Daily aggregation
                daily_data = df.groupby(df['timestamp'].dt.date).size()
                
                # Calculate trend metrics
                if len(daily_data) > 1:
                    # Simple linear trend
                    x = np.arange(len(daily_data))
                    y = daily_data.values
                    slope, intercept = np.polyfit(x, y, 1)
                    
                    results['trend_direction'] = 'increasing' if slope > 0 else 'decreasing'
                    results['trend_strength'] = float(abs(slope))
                    
                    # Week-over-week growth
                    if len(daily_data) >= 14:
                        recent_week = daily_data.tail(7).mean()
                        previous_week = daily_data.tail(14).head(7).mean()
                        wow_growth = ((recent_week - previous_week) / previous_week) * 100
                        results['week_over_week_growth_percent'] = float(wow_growth)
                
                # Seasonality detection (basic)
                if len(daily_data) > 30:
                    df['day_of_week'] = df['timestamp'].dt.day_name()
                    weekly_pattern = df.groupby('day_of_week').size()
                    results['weekly_seasonality'] = weekly_pattern.to_dict()
            
        except Exception as e:
            logger.error(f"Error in trend analysis: {str(e)}")
            results['error'] = str(e)
        
        return results
    
    def generate_insights(self, analysis_results: Dict[str, Any]) -> List[str]:
        """
        Generate actionable insights from analysis results.
        
        Args:
            analysis_results: Combined results from various analyses
            
        Returns:
            List of insight strings
        """
        insights = []
        
        try:
            # Occupancy insights
            if 'average_occupancy_rate' in analysis_results:
                occupancy = analysis_results['average_occupancy_rate']
                if occupancy > 80:
                    insights.append("High occupancy rates indicate strong demand. Consider dynamic pricing strategies.")
                elif occupancy < 50:
                    insights.append("Low occupancy rates suggest marketing opportunities or pricing adjustments needed.")
            
            # Satisfaction insights
            if 'satisfaction_score' in analysis_results:
                satisfaction = analysis_results['satisfaction_score']
                if satisfaction > 80:
                    insights.append("High satisfaction scores indicate excellent service quality.")
                elif satisfaction < 60:
                    insights.append("Low satisfaction scores require immediate attention to service quality.")
            
            # Trend insights
            if 'trend_direction' in analysis_results:
                if analysis_results['trend_direction'] == 'increasing':
                    insights.append("Positive growth trend detected. Consider capacity expansion planning.")
                else:
                    insights.append("Declining trend detected. Investigate market factors and adjust strategies.")
            
            # Seasonal insights
            if 'weekly_seasonality' in analysis_results:
                seasonal_data = analysis_results['weekly_seasonality']
                peak_day = max(seasonal_data, key=seasonal_data.get)
                insights.append(f"Peak activity occurs on {peak_day}. Optimize staffing and resources accordingly.")
        
        except Exception as e:
            logger.error(f"Error generating insights: {str(e)}")
            insights.append("Error generating insights. Please check data quality.")
        
        return insights


def handler(event, context):
    """
    AWS Lambda handler function for tourism data analysis.
    
    Args:
        event: Lambda event object containing request data
        context: Lambda context object
        
    Returns:
        Dict: API response with analysis results
    """
    try:
        # Initialize analyzer
        analyzer = TourismDataAnalyzer()
        
        # Parse request
        if isinstance(event.get('body'), str):
            body = event['body']
        else:
            body = json.dumps(event.get('body', {}))
        
        # Get request parameters
        query_params = event.get('queryStringParameters') or {}
        analysis_type = query_params.get('analysis_type', 'arrivals_analysis')
        data_format = query_params.get('format', 'csv')
        include_insights = query_params.get('insights', 'true').lower() == 'true'
        
        # Validate analysis type
        if analysis_type not in analyzer.analysis_types:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Unsupported analysis type: {analysis_type}',
                    'supported_types': analyzer.analysis_types
                })
            }
        
        # Parse input data
        df = analyzer.parse_input_data(body, data_format)
        
        if df.empty:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'No data provided or data is empty'
                })
            }
        
        # Perform analysis based on type
        results = {}
        
        if analysis_type == 'arrivals_analysis':
            results = analyzer.analyze_arrivals(df)
        elif analysis_type == 'occupancy_analysis':
            results = analyzer.analyze_occupancy(df)
        elif analysis_type == 'satisfaction_analysis':
            results = analyzer.analyze_satisfaction(df)
        elif analysis_type == 'trend_analysis':
            results = analyzer.analyze_trends(df, 'general')
        elif analysis_type == 'predictive_insights':
            # Combine multiple analysis types for comprehensive insights
            results.update(analyzer.analyze_arrivals(df))
            results.update(analyzer.analyze_occupancy(df))
            results.update(analyzer.analyze_trends(df, 'combined'))
        elif analysis_type == 'regional_comparison':
            # Analyze data by region if region column exists
            if 'region' in df.columns:
                regional_results = {}
                for region in df['region'].unique():
                    region_df = df[df['region'] == region]
                    regional_results[region] = analyzer.analyze_occupancy(region_df)
                results['regional_analysis'] = regional_results
            else:
                results['error'] = 'Regional analysis requires a "region" column in the data'
        
        # Generate insights if requested
        if include_insights and 'error' not in results:
            results['insights'] = analyzer.generate_insights(results)
        
        # Add metadata
        results['metadata'] = {
            'analysis_type': analysis_type,
            'data_format': data_format,
            'records_processed': len(df),
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            },
            'body': json.dumps(results, default=lambda x: str(x) if hasattr(x, 'isoformat') else str(x))
        }
        
    except Exception as e:
        logger.error(f"Handler error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }


# For local testing
if __name__ == "__main__":
    import sys
    
    try:
        # Read from stdin when called as a script
        if len(sys.argv) > 1:
            # Sample test data for direct execution
            test_event = {
                'body': '''flight_number,origin,timestamp,passenger_count,airline
ET301,London,2024-01-15 08:30:00,245,Ethiopian
LH564,Frankfurt,2024-01-15 14:20:00,189,Lufthansa
EK723,Dubai,2024-01-15 22:15:00,298,Emirates''',
                'queryStringParameters': {
                    'analysis_type': 'arrivals_analysis',
                    'format': 'csv',
                    'insights': 'true'
                }
            }
        else:
            # Read event from stdin
            input_data = sys.stdin.read()
            test_event = json.loads(input_data)
        
        result = handler(test_event, None)
        print(json.dumps(result))
        
    except Exception as e:
        error_response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Script execution error',
                'message': str(e)
            })
        }
        print(json.dumps(error_response)) 