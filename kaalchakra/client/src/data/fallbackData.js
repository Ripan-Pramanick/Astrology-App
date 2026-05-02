// client/src/data/fallbackData.js
export const fallbackChartData = {
  lagna: "Taurus",
  rasi: "Virgo", 
  nakshatra: "Rohini",
  nakshatraPada: "1",
  sunSign: "Leo",
  moonSign: "Virgo",
  planets: [
    { name: "Sun", sign: "Leo", house: 5, degree: "15°30'", lord: "Sun", nakshatra: "Magha", pada: 4 },
    { name: "Moon", sign: "Virgo", house: 6, degree: "22°15'", lord: "Mercury", nakshatra: "Hasta", pada: 2 },
    { name: "Mars", sign: "Aries", house: 1, degree: "8°45'", lord: "Mars", nakshatra: "Ashwini", pada: 1 },
    { name: "Mercury", sign: "Leo", house: 5, degree: "12°20'", lord: "Sun", nakshatra: "Magha", pada: 3 },
    { name: "Jupiter", sign: "Sagittarius", house: 9, degree: "5°10'", lord: "Jupiter", nakshatra: "Purva Ashadha", pada: 4 },
    { name: "Venus", sign: "Libra", house: 7, degree: "18°35'", lord: "Venus", nakshatra: "Swati", pada: 1 },
    { name: "Saturn", sign: "Capricorn", house: 10, degree: "3°25'", lord: "Saturn", nakshatra: "Uttara Ashadha", pada: 2 },
    { name: "Rahu", sign: "Gemini", house: 3, degree: "20°50'", lord: "Mercury", nakshatra: "Ardra", pada: 3 },
    { name: "Ketu", sign: "Sagittarius", house: 9, degree: "20°50'", lord: "Jupiter", nakshatra: "Purva Ashadha", pada: 4 }
  ],
  houses: Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"][i],
    cusp: `${(i * 30)}° 00'`,
    lord: ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"][i]
  })),
  yogas: ["Gaja Kesari Yoga", "Lakshmi Yoga", "Saraswati Yoga"],
  dasha: [
    { planet: "Ketu", years: 7, start: "Birth", end: "Age 7" },
    { planet: "Venus", years: 20, start: "Age 7", end: "Age 27" },
    { planet: "Sun", years: 6, start: "Age 27", end: "Age 33" }
  ]
};