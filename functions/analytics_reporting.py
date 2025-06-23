"""
analytics_reporting.py

Loads the mock tourism dataset and generates summary reports and charts.

Usage:
    pip install pandas matplotlib openpyxl
    python analytics_reporting.py

Outputs:
    - tourism_report.xlsx with summary sheets
    - spend_by_sector.png
    - sentiment_distribution.png
    - age_distribution.png
"""
import pandas as pd
import matplotlib.pyplot as plt

# 1. Load data
df = pd.read_csv('tourism_dataset.csv')

# 2. Summary metrics
# 2.1 Total spend and average satisfaction per sector
sector_summary = df.groupby('sector').agg(
    total_spend=('spend_amount', 'sum'),
    avg_satisfaction=('satisfaction_score', 'mean'),
    avg_infra_rating=('infrastructure_rating', 'mean'),
    count=('sector', 'count')
).reset_index()

# 2.2 Review sentiment distribution overall
sentiment_overall = df['review_sentiment'].value_counts(normalize=True).mul(100).round(2)

# 2.3 Top nationalities by total spend
top_nationalities = df.groupby('nationality').agg(
    total_spend=('spend_amount', 'sum'),
    visit_count=('nationality', 'count')
).sort_values('total_spend', ascending=False).head(10)

# 2.4 Visitor age distribution
age_counts = df['age']

# 3. Export to Excel
with pd.ExcelWriter('tourism_report.xlsx', engine='openpyxl') as writer:
    sector_summary.to_excel(writer, sheet_name='Sector_Summary', index=False)
    sentiment_overall.to_frame('percentage').to_excel(writer, sheet_name='Sentiment_Distribution')
    top_nationalities.to_excel(writer, sheet_name='Top_Nationalities')
    # raw data sample
    df.sample(1000).to_excel(writer, sheet_name='Sample_Data', index=False)

print("✅ Excel report generated: tourism_report.xlsx")

# 4. Charts
# 4.1 Spend by sector
plt.figure()
plt.bar(sector_summary['sector'], sector_summary['total_spend'] / 1e6)
plt.title('Total Spend by Sector (Millions)')
plt.ylabel('Spend (Million USD)')
plt.xlabel('Sector')
plt.tight_layout()
plt.savefig('spend_by_sector.png')
print("✅ Chart saved: spend_by_sector.png")

# 4.2 Sentiment distribution pie chart
plt.figure()
sentiment_overall.plot.pie(autopct='%1.1f%%', startangle=90)
plt.title('Review Sentiment Distribution')
plt.ylabel('')
plt.tight_layout()
plt.savefig('sentiment_distribution.png')
print("✅ Chart saved: sentiment_distribution.png")

# 4.3 Age distribution histogram
plt.figure()
plt.hist(age_counts, bins=15)
plt.title('Visitor Age Distribution')
plt.xlabel('Age')
plt.ylabel('Count')
plt.tight_layout()
plt.savefig('age_distribution.png')
print("✅ Chart saved: age_distribution.png")

print("All analytics and reporting complete.")