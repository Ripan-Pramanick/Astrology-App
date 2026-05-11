# --legacy-peer-deps

# https://kaalchakra-backend.onrender.com/api/articles


curl -X POST https://json.astrologyapi.com/v1/horo_chart \
  -H "Content-Type: application/json" \
  -H "x-astrologyapi-key: ak-057dda3709f0387d7972d9cbe6f6a834037d52f6" \
  -d '{
    "day": 12,
    "month": 08,
    "year": 2004,
    "hour": 17,
    "min": 45,
    "lat": 22.5726,
    "lon": 88.3639,
    "tzone": 5.5,
    "chartType": "north",
    "image_type": "svg",
    "ayanamsa": "lahiri"
  }'

curl --location 'https://json.astrologyapi.com/v1/birth_details' \
  --header 'Content-Type: application/json' \
  --header 'x-astrologyapi-key:ak-057dda3709f0387d7972d9cbe6f6a834037d52f6' \
  --data '{
    "day": 12,
    "month": 8,
    "year": 2004,
    "hour": 17,
    "min": 45,
    "lat": 22.5726,
    "lon": 88.3639,
    "tzone": 5.5
}'