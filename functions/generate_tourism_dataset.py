"""
    generate_tourism_dataset.py

Generates a mock tourism dataset, writes 'tourism_dataset.csv', 
and upserts records into the 'tourism_data' table on Supabase.

Prerequisites:
    pip install pandas numpy supabase

Make sure to set environment variables:
    SUPABASE_URL   - your Supabase project URL
    SUPABASE_KEY   - your Supabase service role key (for upserts)

Usage:
    python generate_tourism_dataset.py
"""

import os
import pandas as pd
import numpy as np
from supabase import create_client

# --- Configuration ---
SECTORS = ['airlines','hotels','regional_tourism','travel_agencies','other']
N_PER_SECTOR = 100000
TOTAL = len(SECTORS) * N_PER_SECTOR

# Demographic pools
ages = np.random.randint(18, 80, size=TOTAL)
sexes = np.random.choice(['Male', 'Female'], size=TOTAL)
nationalities = np.random.choice([
     'UK','China','India','Germany','France','Italy','Brazil','Canada',
    'Australia','Japan','South Korea','Russia','Turkey','Egypt','Morocco','Algeria','Morocco','Algeria','Saudi Arabia','United Kingdom','United States','Canada','Australia','Ethiopia', 'Spain', 'Mexico', 'South Africa', 'Switzerland', 'Netherlands',
    'Thailand', 'Indonesia', 'Vietnam', 'Malaysia', 'Singapore',
    'New Zealand', 'Argentina', 'Chile', 'Colombia', 'Peru'],
    size=TOTAL
)
regions = np.random.choice(
    ['Addis Ababa','Oromia','Amhara','Tigray','Somali','SNNPR','Afar','Harari'],
    size=TOTAL
)


# 2. Define per-region destinations
region_destinations = {
    "Addis Ababa": [
        "National Museum of Ethiopia",
        "Entoto Hills",
        "Red Terror Martyrs' Memorial Museum",
        "Holy Trinity Cathedral",
        "Friendship Park",
        "Unity Park",
        "Adwa Victory Monument",
    
    ],
    "Oromia": [
        "Bale Mountains",
        "Awash National Park",
        "Wonchi",
        "Sof Omar Caves",
        "Wenchi Crater Lake",
        "Lake Langano",
        "Rift Valley Lakes",
        "Aba Jifar Palace",
        "Jimma Museum",
        "Melka Kunture",
        "Babugaya"

    ],
    "Amhara": [
        "Lalibela Churches",
        "Blue Nile Gorge",
        "Gondar & Fasil Ghebbi",
        "Tiya Stelae Field",
        "Simien Mountains National Park",
        "Gorgora",
        "Lake Tana",
        "Blue Nile Falls"
    ],
    "Tigray": [
        "Axum Obelisks",
        "Gheralta Rock-Hewn Churches",
        "Rock-Hewn Churches of Tigray",
        "Yeha&apos;s Temple",
        "Northern Stelae Field",
        "Monastery of Debre Damo",
        "Gheralta Rock"
    ],
    "Somali": [
        "Sodore Hot Springs",
        "Laas Geel",
        "Gode",
        "Kebri Dar"
    ],
    "SNNPR": [
        "Omo Valley",
        "Konso Cultural Landscape",
        "Lake Abaya",
        "Lakes Chamo and Abaya",
        "Nechisar National Park",
        "Arba Minch",
        "Dorze Village",
        "Abijatta-Shalla Lakes National Park",
        "Koysha"
    ],
    "Afar": [
        "Danakil Depression",
        "Erta Ale volcano",
        "Yangudi Rassa National Park"
    ],
  
    "Harari": [
        "Harar Old City"
    ]
}
tourist_destinations = np.array([
    np.random.choice(region_destinations[reg])
    for reg in regions
])


# Sentiment pools
sentiments = ['positive', 'negative', 'neutral']
weights = [0.60, 0.25, 0.15]
positive_comments = ["Excellent experience","Loved it","Highly recommended","Fantastic service","Will return"]
negative_comments = ["Very disappointed","Not worth it","Terrible service","Would not recommend","Poor experience"]
neutral_comments = ["It was okay","Average","Nothing special","Mediocre","So-so"]

records = []
idx = 0
for sector in SECTORS:
    for _ in range(N_PER_SECTOR):
        age = ages[idx]
        sex = sexes[idx]
        nationality = nationalities[idx]
        region = regions[idx]
        tourist_destination = tourist_destinations[idx]
        # Core metrics
        spend = round(np.random.gamma(2, 1000), 2)
        duration = round(np.random.exponential(3) + 1, 1)
        satisfaction = int(np.random.randint(1,6))
        infra = int(np.random.randint(1,6))
        local_spend = round(spend * np.random.uniform(0.1, 0.5), 2)
        
        # Sentiment
        sentiment = np.random.choice(sentiments, p=weights)
        if sentiment=='positive':
            comment = np.random.choice(positive_comments)
        elif sentiment=='negative':
            comment = np.random.choice(negative_comments)
        else:
            comment = np.random.choice(neutral_comments)
        
        rec = {
            'sector': sector,
            'age': age,
            'sex': sex,
            'nationality': nationality,
            'home_region': region,
            'tourist_destination': tourist_destination,
            'spend_amount': spend,
            'visit_duration_days': duration,
            'satisfaction_score': satisfaction,
            'infrastructure_rating': infra,
            'local_business_spend': local_spend,
            'review_sentiment': sentiment,
            'review_comment': comment
        }
        
        # Sector-specific
        if sector=='airlines':
            rec.update({
                'flight_delay_minutes': int(np.random.poisson(15)),
                'flight_spend': round(spend * np.random.uniform(0.5,1),2)
            })
        elif sector=='hotels':
            rec.update({
                'hotel_nights': int(duration),
                'hotel_rating': int(np.random.randint(1,6)),
                'hotel_spend': round(spend * np.random.uniform(0.5,1),2)
            })
        elif sector=='regional_tourism':
            rec.update({
                'activities_count': int(np.random.randint(1,10)),
                'activity_spend': round(spend * np.random.uniform(0.4,0.9),2)
            })
        elif sector=='travel_agencies':
            rec.update({
                'package_type': np.random.choice(['budget','standard','premium']),
                'package_spend': round(spend * np.random.uniform(0.6,1),2)
            })
        else:
            rec.update({
                'souvenir_spend': round(spend * np.random.uniform(0.2,0.6),2),
                'other_service_rating': int(np.random.randint(1,6))
            })
        
        records.append(rec)
        idx += 1

# Create DataFrame
df = pd.DataFrame(records)

# 1) Write to CSV
csv_path = 'tourism_dataset.csv'
df.to_csv(csv_path, index=False)
print(f"✅ CSV written: {csv_path}")

# 2) Upload to Supabase
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
if not url or not key:
    raise RuntimeError("Set SUPABASE_URL and SUPABASE_KEY environment variables")

df.replace([np.inf, -np.inf], np.nan, inplace=True)

# 2) Either fill NaNs (e.g. with 0) or drop them. Here we fill:
df.fillna(0, inplace=True)

# 3) Cast numeric columns to plain Python floats/ints
for col in df.select_dtypes(include=['float64','int64']).columns:
    df[col] = df[col].astype(float)

supabase = create_client(url, key)
response = supabase.table("tourism_data").upsert(df.to_dict(orient="records")).execute()

if response.error:
    print("❌ Supabase upsert error:", response.error)
else:
    print(f"✅ Upserted {len(df)} records to 'tourism_data' table")


   