{{ config(
    materialized='table',
    indexes=[
        {'columns': ['tourist_id', 'journey_date'], 'type': 'btree'},
        {'columns': ['destination_id'], 'type': 'btree'},
        {'columns': ['journey_date'], 'type': 'btree'}
    ]
) }}

WITH tourist_events AS (
    SELECT
        actor_id AS tourist_id,
        event_date AS journey_date,
        topic,
        occurred_at,
        payload,
        location,
        ROW_NUMBER() OVER (PARTITION BY actor_id, event_date ORDER BY occurred_at) AS event_sequence
    FROM {{ ref('stg_events') }}
    WHERE topic IN (
        'tourist.check_in',
        'poi.interaction',
        'purchase.completed',
        'wristband.linked'
    )
),

checkin_events AS (
    SELECT
        tourist_id,
        journey_date,
        occurred_at AS checkin_time,
        JSONExtractString(payload, 'registration_method') AS registration_method,
        JSONExtractInt(payload, 'group_size') AS group_size,
        JSONExtractString(payload, 'purpose_of_visit') AS purpose_of_visit,
        JSONExtractString(payload, 'nationality') AS nationality,
        location AS checkin_location
    FROM tourist_events
    WHERE topic = 'tourist.check_in'
),

poi_interactions AS (
    SELECT
        tourist_id,
        journey_date,
        COUNT(*) AS total_poi_visits,
        COUNT(DISTINCT JSONExtractString(payload, 'poi_id')) AS unique_pois_visited,
        SUM(JSONExtractInt(payload, 'dwell_time_minutes')) AS total_dwell_time_minutes,
        AVG(JSONExtractInt(payload, 'dwell_time_minutes')) AS avg_dwell_time_minutes,
        MAX(JSONExtractInt(payload, 'satisfaction_rating')) AS max_satisfaction_rating,
        AVG(JSONExtractInt(payload, 'satisfaction_rating')) AS avg_satisfaction_rating,
        MIN(occurred_at) AS first_poi_visit,
        MAX(occurred_at) AS last_poi_visit
    FROM tourist_events
    WHERE topic = 'poi.interaction'
        AND JSONExtractString(payload, 'interaction_type') = 'entry_scan'
    GROUP BY tourist_id, journey_date
),

purchase_summary AS (
    SELECT
        tourist_id,
        journey_date,
        COUNT(*) AS total_purchases,
        SUM(JSONExtractFloat(payload, 'amount')) AS total_spend,
        AVG(JSONExtractFloat(payload, 'amount')) AS avg_transaction_amount,
        COUNT(DISTINCT JSONExtractString(payload, 'merchant_category')) AS unique_merchant_categories,
        SUM(CASE WHEN JSONExtractString(payload, 'payment_method') = 'wristband_nfc' THEN 1 ELSE 0 END) AS wristband_payments,
        MIN(occurred_at) AS first_purchase,
        MAX(occurred_at) AS last_purchase
    FROM tourist_events
    WHERE topic = 'purchase.completed'
    GROUP BY tourist_id, journey_date
),

wristband_info AS (
    SELECT
        tourist_id,
        journey_date,
        MIN(occurred_at) AS wristband_linked_time,
        MAX(JSONExtractFloat(payload, 'wallet_balance')) AS initial_wallet_balance
    FROM tourist_events
    WHERE topic = 'wristband.linked'
    GROUP BY tourist_id, journey_date
),

journey_summary AS (
    SELECT
        c.tourist_id,
        c.journey_date,
        
        -- Tourist information
        c.registration_method,
        c.group_size,
        c.purpose_of_visit,
        c.nationality,
        c.checkin_location,
        c.checkin_time,
        
        -- Wristband information
        w.wristband_linked_time,
        w.initial_wallet_balance,
        CASE WHEN w.wristband_linked_time IS NOT NULL THEN 1 ELSE 0 END AS used_wristband,
        
        -- POI interaction metrics
        COALESCE(p.total_poi_visits, 0) AS total_poi_visits,
        COALESCE(p.unique_pois_visited, 0) AS unique_pois_visited,
        COALESCE(p.total_dwell_time_minutes, 0) AS total_dwell_time_minutes,
        COALESCE(p.avg_dwell_time_minutes, 0) AS avg_dwell_time_minutes,
        p.max_satisfaction_rating,
        p.avg_satisfaction_rating,
        p.first_poi_visit,
        p.last_poi_visit,
        
        -- Purchase metrics
        COALESCE(ps.total_purchases, 0) AS total_purchases,
        COALESCE(ps.total_spend, 0) AS total_spend,
        COALESCE(ps.avg_transaction_amount, 0) AS avg_transaction_amount,
        COALESCE(ps.unique_merchant_categories, 0) AS unique_merchant_categories,
        COALESCE(ps.wristband_payments, 0) AS wristband_payments,
        ps.first_purchase,
        ps.last_purchase,
        
        -- Journey duration
        CASE 
            WHEN p.last_poi_visit IS NOT NULL AND ps.last_purchase IS NOT NULL THEN
                GREATEST(p.last_poi_visit, ps.last_purchase)
            WHEN p.last_poi_visit IS NOT NULL THEN p.last_poi_visit
            WHEN ps.last_purchase IS NOT NULL THEN ps.last_purchase
            ELSE c.checkin_time
        END AS journey_end_time,
        
        -- Derived metrics
        CASE 
            WHEN p.last_poi_visit IS NOT NULL OR ps.last_purchase IS NOT NULL THEN
                dateDiff('minute', c.checkin_time, 
                    CASE 
                        WHEN p.last_poi_visit IS NOT NULL AND ps.last_purchase IS NOT NULL THEN
                            GREATEST(p.last_poi_visit, ps.last_purchase)
                        WHEN p.last_poi_visit IS NOT NULL THEN p.last_poi_visit
                        ELSE ps.last_purchase
                    END
                )
            ELSE NULL
        END AS total_journey_duration_minutes,
        
        -- Engagement score (0-100)
        LEAST(100, 
            (COALESCE(p.unique_pois_visited, 0) * 20) +
            (CASE WHEN ps.total_purchases > 0 THEN 20 ELSE 0 END) +
            (CASE WHEN w.wristband_linked_time IS NOT NULL THEN 20 ELSE 0 END) +
            (COALESCE(p.avg_satisfaction_rating, 0) * 20) +
            (CASE WHEN COALESCE(p.total_dwell_time_minutes, 0) > 60 THEN 20 ELSE 
                COALESCE(p.total_dwell_time_minutes, 0) / 3 END)
        ) AS engagement_score,
        
        -- Journey type classification
        CASE 
            WHEN COALESCE(p.total_poi_visits, 0) = 0 AND COALESCE(ps.total_purchases, 0) = 0 THEN 'registration_only'
            WHEN COALESCE(p.total_poi_visits, 0) > 0 AND COALESCE(ps.total_purchases, 0) = 0 THEN 'sightseeing_only'
            WHEN COALESCE(p.total_poi_visits, 0) = 0 AND COALESCE(ps.total_purchases, 0) > 0 THEN 'shopping_only'
            WHEN COALESCE(p.total_poi_visits, 0) > 0 AND COALESCE(ps.total_purchases, 0) > 0 THEN 'full_experience'
            ELSE 'unknown'
        END AS journey_type

    FROM checkin_events c
    LEFT JOIN poi_interactions p ON c.tourist_id = p.tourist_id AND c.journey_date = p.journey_date
    LEFT JOIN purchase_summary ps ON c.tourist_id = ps.tourist_id AND c.journey_date = ps.journey_date
    LEFT JOIN wristband_info w ON c.tourist_id = w.tourist_id AND c.journey_date = w.journey_date
)

SELECT *
FROM journey_summary
