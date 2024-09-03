from homeharvest import scrape_property
from datetime import datetime

# Generate filename based on current timestamp
filename = f"Austin_Sold_20240101.csv"

properties = scrape_property(
  location="Austin, TX",
  listing_type="sold",  # or (for_sale, for_rent, pending)
  #past_days=30,  # sold in last 30 days - listed in last 30 days if (for_sale, for_rent)

  date_from="2024-01-01", # alternative to past_days
  date_to="2024-07-10",
  # foreclosure=True
  mls_only=True,# only fetch MLS listings
  extra_property_data = True
)
print(f"Number of properties: {len(properties)}")

# Export to csv
properties.to_csv(filename, index=False)
print(properties.head())