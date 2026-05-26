curl --location 'https://pdf.astrologyapi.com/v1/natal_horoscope_report/tropical' \
  --header 'Content-Type: application/json' \
  --header 'x-astrologyapi-key: ak-1255c8e55390b0b0e2f9040139532e4f017a706b' \
  --data '{
    "name": "Ajeet",
    "gender": "male",
    "day": 15,
    "month": 8,
    "year": 1990,
    "hour": 10,
    "minute": 30,
    "latitude": 39.9526,
    "longitude": -75.1652,
    "language": "en",
    "timezone": -5,
    "place": "Mumbai,Maharashtra India",
    "footer_link": "https:",
    "logo_url": "LOGO_URL",
    "company_name": "company name",
    "company_info": "company info",
    "domain_url": "https:",
    "company_email": "company email",
    "company_landline": "123456789",
    "company_mobile": "123456789"
}'