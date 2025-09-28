{{ config(
    materialized='view',
    indexes=[
        {'columns': ['event_date'], 'type': 'btree'},
        {'columns': ['topic'], 'type': 'btree'},
        {'columns': ['actor_id'], 'type': 'btree'}
    ]
) }}

WITH raw_events AS (
    SELECT
        event_id,
        topic,
        version,
        occurred_at,
        actor_id,
        context,
        payload,
        pii_map,
        _ingested_at
    FROM {{ source('raw', 'events') }}
    WHERE occurred_at >= '2024-01-01'  -- Data quality filter
),

cleaned_events AS (
    SELECT
        event_id,
        topic,
        version,
        CAST(occurred_at AS TIMESTAMP) AS occurred_at,
        DATE(occurred_at) AS event_date,
        HOUR(occurred_at) AS event_hour,
        actor_id,
        
        -- Extract context fields
        JSONExtractString(context, 'app') AS app,
        JSONExtractString(context, 'device') AS device,
        JSONExtractString(context, 'session_id') AS session_id,
        JSONExtractString(context, 'location') AS location,
        JSONExtractString(context, 'operator_id') AS operator_id,
        
        -- Store full payload for downstream processing
        payload,
        pii_map,
        
        -- Metadata
        _ingested_at,
        
        -- Data quality flags
        CASE 
            WHEN event_id = '' OR event_id IS NULL THEN 1
            WHEN topic = '' OR topic IS NULL THEN 1
            WHEN occurred_at IS NULL THEN 1
            WHEN actor_id = '' OR actor_id IS NULL THEN 1
            ELSE 0
        END AS has_quality_issues

    FROM raw_events
)

SELECT *
FROM cleaned_events
WHERE has_quality_issues = 0  -- Filter out problematic records

-- Add data quality tests
{{ dbt_utils.generate_schema_name('staging') }}
