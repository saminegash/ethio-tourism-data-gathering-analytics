{{ config(
    materialized='table',
    indexes=[
        {'columns': ['tourist_id'], 'type': 'btree'},
        {'columns': ['feature_date'], 'type': 'btree'},
        {'columns': ['nationality'], 'type': 'btree'}
    ]
) }}

WITH tourist_base AS (
    SELECT
        tourist_id,
        nationality,
        age_group,
        gender_clean AS gender,
        purpose_of_visit,
        group_size,
        registration_method_category,
        data_collection_consent,
        marketing_consent,
        registration_date
    FROM {{ ref('stg_tourists') }}
),

journey_features AS (
    SELECT
        tourist_id,
        journey_date,
        
        -- Visit patterns
        total_poi_visits,
        unique_pois_visited,
        total_dwell_time_minutes,
        avg_dwell_time_minutes,
        
        -- Spending behavior
        total_spend,
        total_purchases,
        avg_transaction_amount,
        unique_merchant_categories,
        
        -- Technology adoption
        used_wristband,
        wristband_payments,
        CASE WHEN wristband_payments > 0 THEN wristband_payments::FLOAT / total_purchases ELSE 0 END AS wristband_payment_ratio,
        
        -- Satisfaction
        avg_satisfaction_rating,
        
        -- Engagement
        engagement_score,
        journey_type,
        total_journey_duration_minutes
        
    FROM {{ ref('tourist_journey') }}
),

historical_aggregates AS (
    SELECT
        tourist_id,
        COUNT(DISTINCT journey_date) AS total_visits,
        AVG(total_poi_visits) AS avg_poi_visits_per_day,
        AVG(total_spend) AS avg_spend_per_day,
        AVG(engagement_score) AS avg_engagement_score,
        AVG(avg_satisfaction_rating) AS overall_satisfaction,
        
        -- Visit frequency
        CASE 
            WHEN COUNT(DISTINCT journey_date) = 1 THEN 'first_time'
            WHEN COUNT(DISTINCT journey_date) BETWEEN 2 AND 5 THEN 'occasional'
            WHEN COUNT(DISTINCT journey_date) > 5 THEN 'frequent'
        END AS visitor_frequency,
        
        -- Spending category
        CASE 
            WHEN AVG(total_spend) = 0 THEN 'non_spender'
            WHEN AVG(total_spend) BETWEEN 0.01 AND 100 THEN 'low_spender'
            WHEN AVG(total_spend) BETWEEN 100.01 AND 500 THEN 'medium_spender'
            WHEN AVG(total_spend) > 500 THEN 'high_spender'
        END AS spending_category,
        
        -- Preferred journey type
        argMax(journey_type, journey_date) AS preferred_journey_type,
        
        -- Technology adoption
        AVG(used_wristband::Float) AS wristband_adoption_rate,
        
        -- Temporal patterns
        MIN(journey_date) AS first_visit_date,
        MAX(journey_date) AS last_visit_date,
        dateDiff('day', MIN(journey_date), MAX(journey_date)) AS days_between_first_last_visit

    FROM journey_features
    GROUP BY tourist_id
),

seasonal_preferences AS (
    SELECT
        tourist_id,
        
        -- Season preferences (based on visit patterns)
        SUM(CASE WHEN toMonth(journey_date) IN (12, 1, 2) THEN 1 ELSE 0 END) AS winter_visits,
        SUM(CASE WHEN toMonth(journey_date) IN (3, 4, 5) THEN 1 ELSE 0 END) AS spring_visits,
        SUM(CASE WHEN toMonth(journey_date) IN (6, 7, 8) THEN 1 ELSE 0 END) AS summer_visits,
        SUM(CASE WHEN toMonth(journey_date) IN (9, 10, 11) THEN 1 ELSE 0 END) AS autumn_visits,
        
        -- Day of week preferences
        SUM(CASE WHEN toDayOfWeek(journey_date) IN (1, 7) THEN 1 ELSE 0 END) AS weekend_visits,
        SUM(CASE WHEN toDayOfWeek(journey_date) IN (2, 3, 4, 5, 6) THEN 1 ELSE 0 END) AS weekday_visits
        
    FROM journey_features
    GROUP BY tourist_id
),

recent_behavior AS (
    SELECT
        tourist_id,
        MAX(journey_date) AS feature_date,
        
        -- Recent behavior (last 30 days)
        AVG(CASE WHEN journey_date >= today() - INTERVAL 30 DAY THEN engagement_score END) AS recent_engagement_score,
        AVG(CASE WHEN journey_date >= today() - INTERVAL 30 DAY THEN total_spend END) AS recent_avg_spend,
        COUNT(CASE WHEN journey_date >= today() - INTERVAL 30 DAY THEN 1 END) AS recent_visit_count,
        
        -- Trend indicators
        CASE 
            WHEN COUNT(CASE WHEN journey_date >= today() - INTERVAL 30 DAY THEN 1 END) > 
                 COUNT(CASE WHEN journey_date >= today() - INTERVAL 60 DAY AND journey_date < today() - INTERVAL 30 DAY THEN 1 END)
            THEN 'increasing'
            WHEN COUNT(CASE WHEN journey_date >= today() - INTERVAL 30 DAY THEN 1 END) < 
                 COUNT(CASE WHEN journey_date >= today() - INTERVAL 60 DAY AND journey_date < today() - INTERVAL 30 DAY THEN 1 END)
            THEN 'decreasing'
            ELSE 'stable'
        END AS visit_trend
        
    FROM journey_features
    GROUP BY tourist_id
),

ml_features AS (
    SELECT
        tb.tourist_id,
        rb.feature_date,
        
        -- Demographic features
        tb.nationality,
        tb.age_group,
        tb.gender,
        tb.purpose_of_visit,
        tb.group_size,
        tb.registration_method_category,
        
        -- Behavioral features
        ha.total_visits,
        ha.avg_poi_visits_per_day,
        ha.avg_spend_per_day,
        ha.avg_engagement_score,
        ha.overall_satisfaction,
        ha.visitor_frequency,
        ha.spending_category,
        ha.preferred_journey_type,
        ha.wristband_adoption_rate,
        
        -- Temporal features
        dateDiff('day', tb.registration_date, rb.feature_date) AS days_since_registration,
        ha.days_between_first_last_visit,
        
        -- Seasonal preferences (normalized)
        sp.winter_visits::Float / ha.total_visits AS winter_preference,
        sp.spring_visits::Float / ha.total_visits AS spring_preference,
        sp.summer_visits::Float / ha.total_visits AS summer_preference,
        sp.autumn_visits::Float / ha.total_visits AS autumn_preference,
        sp.weekend_visits::Float / (sp.weekend_visits + sp.weekday_visits) AS weekend_preference,
        
        -- Recent behavior
        rb.recent_engagement_score,
        rb.recent_avg_spend,
        rb.recent_visit_count,
        rb.visit_trend,
        
        -- Derived features
        CASE 
            WHEN ha.avg_engagement_score >= 80 THEN 'high_engagement'
            WHEN ha.avg_engagement_score >= 60 THEN 'medium_engagement'
            ELSE 'low_engagement'
        END AS engagement_segment,
        
        -- Churn risk score (0-100)
        LEAST(100, GREATEST(0,
            50 + -- Base score
            (CASE WHEN rb.visit_trend = 'decreasing' THEN 30 ELSE 0 END) +
            (CASE WHEN dateDiff('day', ha.last_visit_date, today()) > 90 THEN 20 ELSE 0 END) +
            (CASE WHEN ha.overall_satisfaction < 3 THEN 20 ELSE 0 END) -
            (CASE WHEN ha.visitor_frequency = 'frequent' THEN 30 ELSE 0 END) -
            (CASE WHEN ha.avg_engagement_score > 70 THEN 20 ELSE 0 END)
        )) AS churn_risk_score,
        
        -- Lifetime value estimate
        ha.avg_spend_per_day * ha.total_visits * 
        (CASE ha.visitor_frequency 
            WHEN 'frequent' THEN 2.0 
            WHEN 'occasional' THEN 1.5 
            ELSE 1.0 
        END) AS estimated_ltv,
        
        -- Privacy flags
        tb.data_collection_consent,
        tb.marketing_consent

    FROM tourist_base tb
    JOIN historical_aggregates ha ON tb.tourist_id = ha.tourist_id
    JOIN seasonal_preferences sp ON tb.tourist_id = sp.tourist_id
    JOIN recent_behavior rb ON tb.tourist_id = rb.tourist_id
)

SELECT *
FROM ml_features
WHERE feature_date >= today() - INTERVAL 365 DAY  -- Keep last year of features
