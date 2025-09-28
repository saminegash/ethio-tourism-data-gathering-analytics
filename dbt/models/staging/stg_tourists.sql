{{ config(
    materialized='view',
    indexes=[
        {'columns': ['tourist_id'], 'type': 'btree'},
        {'columns': ['nationality'], 'type': 'btree'},
        {'columns': ['registration_date'], 'type': 'btree'}
    ]
) }}

WITH raw_tourists AS (
    SELECT
        id AS tourist_id,
        passport_number,
        national_id,
        document_type,
        full_name,
        date_of_birth,
        nationality,
        gender,
        phone_number,
        email,
        purpose_of_visit,
        intended_stay_duration,
        group_size,
        special_requirements,
        emergency_contact,
        registration_source,
        registration_agent_id,
        registration_location,
        immigration_data,
        fayda_data,
        last_external_sync,
        data_collection_consent,
        marketing_consent,
        photo_consent,
        is_active,
        verification_status,
        created_at,
        updated_at,
        expires_at
    FROM {{ source('raw', 'tourists') }}
),

cleaned_tourists AS (
    SELECT
        tourist_id,
        
        -- Personal information (anonymized for analytics)
        CASE 
            WHEN passport_number IS NOT NULL THEN 'passport'
            WHEN national_id IS NOT NULL THEN 'national_id'
            ELSE 'unknown'
        END AS document_type_clean,
        
        -- Demographics
        COALESCE(nationality, 'Unknown') AS nationality,
        CASE 
            WHEN gender IN ('male', 'female', 'other', 'prefer_not_to_say') THEN gender
            ELSE 'unknown'
        END AS gender_clean,
        
        -- Age group calculation (privacy-preserving)
        CASE 
            WHEN date_of_birth IS NULL THEN 'unknown'
            WHEN dateDiff('year', date_of_birth, today()) < 18 THEN 'minor'
            WHEN dateDiff('year', date_of_birth, today()) BETWEEN 18 AND 30 THEN 'young_adult'
            WHEN dateDiff('year', date_of_birth, today()) BETWEEN 31 AND 50 THEN 'adult'
            WHEN dateDiff('year', date_of_birth, today()) BETWEEN 51 AND 65 THEN 'middle_aged'
            ELSE 'senior'
        END AS age_group,
        
        -- Travel information
        COALESCE(purpose_of_visit, 'other') AS purpose_of_visit,
        COALESCE(intended_stay_duration, 1) AS intended_stay_duration,
        COALESCE(group_size, 1) AS group_size,
        
        -- Registration details
        registration_source,
        registration_location,
        registration_agent_id,
        
        -- Consent flags
        COALESCE(data_collection_consent, false) AS data_collection_consent,
        COALESCE(marketing_consent, false) AS marketing_consent,
        COALESCE(photo_consent, false) AS photo_consent,
        
        -- Status
        is_active,
        verification_status,
        
        -- Timestamps
        DATE(created_at) AS registration_date,
        created_at AS registration_timestamp,
        updated_at,
        expires_at,
        
        -- Derived fields
        CASE 
            WHEN registration_source IN ('immigration', 'fayda') THEN 'api_integration'
            WHEN registration_source = 'on_site' THEN 'manual_registration'
            ELSE 'other'
        END AS registration_method_category,
        
        -- Data quality score
        (
            CASE WHEN nationality != 'Unknown' THEN 1 ELSE 0 END +
            CASE WHEN gender_clean != 'unknown' THEN 1 ELSE 0 END +
            CASE WHEN age_group != 'unknown' THEN 1 ELSE 0 END +
            CASE WHEN purpose_of_visit != 'other' THEN 1 ELSE 0 END +
            CASE WHEN registration_location IS NOT NULL THEN 1 ELSE 0 END
        ) / 5.0 AS data_quality_score

    FROM raw_tourists
    WHERE is_active = true  -- Only include active tourists
)

SELECT *
FROM cleaned_tourists
