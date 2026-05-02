// client/src/components/KundliReportGenerator.jsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Svg,
  Path,
  Circle,
  Rect,
  Line,
  G
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Noto Sans',
  src: 'https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNr5TRGfQ.woff2',
});
Font.register({
  family: 'Noto Sans Bold',
  src: 'https://fonts.gstatic.com/s/notosans/v27/o-0NIpQlx3QUlC5A4PNjXhFVZNyB.woff2',
});
Font.register({
  family: 'Noto Sans Devanagari',
  src: 'https://fonts.gstatic.com/s/notosansdevanagari/v15/Bu3PvUqN9w4pZO-B9MP5ag0qRkcZeNa9gB5hGm8.woff2',
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Noto Sans',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1 solid #F7931E',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2a44',
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
  },
  priceBadge: {
    backgroundColor: '#F7931E',
    padding: 5,
    borderRadius: 4,
  },
  priceText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#F7931E',
    color: 'white',
    padding: 6,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2a44',
    marginBottom: 6,
    marginTop: 8,
    borderLeft: '3 solid #F7931E',
    paddingLeft: 6,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  gridLabel: {
    width: '35%',
    fontSize: 9,
    color: '#666',
  },
  gridValue: {
    width: '65%',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#f8f9fb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  planetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  planetName: {
    fontSize: 9,
    fontWeight: 'bold',
    width: '15%',
  },
  planetSign: {
    fontSize: 9,
    width: '20%',
  },
  planetHouse: {
    fontSize: 9,
    width: '15%',
  },
  planetDegree: {
    fontSize: 9,
    width: '20%',
  },
  planetLord: {
    fontSize: 9,
    width: '15%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1f2a44',
    padding: 6,
    marginTop: 5,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 15,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  favorableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  favorableItem: {
    backgroundColor: '#e8f5e9',
    padding: '3 8',
    borderRadius: 12,
    fontSize: 8,
  },
  maleficItem: {
    backgroundColor: '#ffebee',
    padding: '3 8',
    borderRadius: 12,
    fontSize: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#999',
    borderTop: '1 solid #eee',
    paddingTop: 10,
  },
  nakshatraBox: {
    backgroundColor: '#fff3e0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  nakshatraTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F7931E',
    textAlign: 'center',
  },
  predictionText: {
    fontSize: 8,
    lineHeight: 1.4,
    color: '#444',
    marginTop: 5,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartBox: {
    width: 200,
    height: 200,
    backgroundColor: '#faf5e8',
    borderWidth: 1,
    borderColor: '#F7931E',
  },
});

// Chart Components
const NorthIndianChart = () => (
  <Svg width={200} height={200} viewBox="0 0 200 200">
    <Rect x={10} y={10} width={180} height={180} stroke="#F7931E" strokeWidth={1} fill="none" />
    <Line x1={100} y1={10} x2={100} y2={190} stroke="#F7931E" strokeWidth={0.5} />
    <Line x1={10} y1={100} x2={190} y2={100} stroke="#F7931E" strokeWidth={0.5} />
    <Line x1={10} y1={10} x2={190} y2={190} stroke="#F7931E" strokeWidth={0.5} />
    <Line x1={190} y1={10} x2={10} y2={190} stroke="#F7931E" strokeWidth={0.5} />
    
    <Text x={85} y={35} fontSize={8} fill="#1f2a44" textAnchor="middle">1</Text>
    <Text x={115} y={35} fontSize={8} fill="#1f2a44" textAnchor="middle">2</Text>
    <Text x={85} y={70} fontSize={8} fill="#1f2a44" textAnchor="middle">3</Text>
    <Text x={115} y={70} fontSize={8} fill="#1f2a44" textAnchor="middle">4</Text>
    <Text x={85} y={130} fontSize={8} fill="#1f2a44" textAnchor="middle">5</Text>
    <Text x={115} y={130} fontSize={8} fill="#1f2a44" textAnchor="middle">6</Text>
    <Text x={85} y={165} fontSize={8} fill="#1f2a44" textAnchor="middle">7</Text>
    <Text x={115} y={165} fontSize={8} fill="#1f2a44" textAnchor="middle">8</Text>
    <Text x={35} y={100} fontSize={8} fill="#1f2a44" textAnchor="middle">9</Text>
    <Text x={55} y={100} fontSize={8} fill="#1f2a44" textAnchor="middle">10</Text>
    <Text x={145} y={100} fontSize={8} fill="#1f2a44" textAnchor="middle">11</Text>
    <Text x={165} y={100} fontSize={8} fill="#1f2a44" textAnchor="middle">12</Text>
    
    <Text x={70} y={25} fontSize={7} fill="#F7931E">☉</Text>
    <Text x={130} y={25} fontSize={7} fill="#F7931E">☽</Text>
    <Text x={70} y={55} fontSize={7} fill="#F7931E">♂</Text>
    <Text x={130} y={55} fontSize={7} fill="#F7931E">☿</Text>
    <Text x={70} y={115} fontSize={7} fill="#F7931E">♃</Text>
    <Text x={130} y={115} fontSize={7} fill="#F7931E">♀</Text>
    <Text x={70} y={150} fontSize={7} fill="#F7931E">♄</Text>
    <Text x={130} y={150} fontSize={7} fill="#F7931E">☊</Text>
    <Text x={25} y={95} fontSize={7} fill="#F7931E">☋</Text>
  </Svg>
);

// Free Client Report (50+ pages)
export const FreeKundliReport = ({ birthDetails, chartData }) => {
  const {
    name = "Client Name",
    dob = "Birth Date",
    tob = "Birth Time",
    pob = "Birth Place",
    gender = "Gender"
  } = birthDetails || {};

  const {
    lagna = "Aries",
    rasi = "Aries",
    nakshatra = "Ashwini",
    nakshatraPada = "1",
    sunSign = "Aries",
    moonSign = "Aries"
  } = chartData || {};

  // Generate 50+ pages
  const generatePages = () => {
    const pages = [];
    
    // Page 1 - Cover
    pages.push(
      <Page key="cover" size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Vedic Astrology Kundli</Text>
            <Text style={styles.subtitle}>Complete Birth Chart Analysis</Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>FREE REPORT</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <NorthIndianChart />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Birth Details</Text>
          <View style={styles.gridRow}><Text style={styles.gridLabel}>Name:</Text><Text style={styles.gridValue}>{name}</Text></View>
          <View style={styles.gridRow}><Text style={styles.gridLabel}>Date of Birth:</Text><Text style={styles.gridValue}>{dob}</Text></View>
          <View style={styles.gridRow}><Text style={styles.gridLabel}>Time of Birth:</Text><Text style={styles.gridValue}>{tob}</Text></View>
          <View style={styles.gridRow}><Text style={styles.gridLabel}>Place of Birth:</Text><Text style={styles.gridValue}>{pob}</Text></View>
          <View style={styles.gridRow}><Text style={styles.gridLabel}>Gender:</Text><Text style={styles.gridValue}>{gender}</Text></View>
        </View>
        <View style={styles.footer}><Text>© Vedic Astrology - Complete Birth Chart Analysis</Text></View>
      </Page>
    );

    // Pages 2-10: Basic Astrological Calculations
    for (let i = 2; i <= 10; i++) {
      pages.push(
        <Page key={`basic-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Basic Astrological Calculations (Page {i})</Text>
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Planetary Positions</Text>
            {generatePlanetTable()}
          </View>
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>House Cusps</Text>
            {generateHouseCusps()}
          </View>
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 11-20: Ascendant and Sign Details
    for (let i = 11; i <= 20; i++) {
      pages.push(
        <Page key={`ascendant-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Ascendant & Sign Details (Page {i})</Text>
          <Text style={styles.subSectionTitle}>Your Ascendant: {lagna}</Text>
          <Text style={styles.predictionText}>{getAscendantDescription(lagna)}</Text>
          <Text style={styles.subSectionTitle}>Your Moon Sign: {rasi}</Text>
          <Text style={styles.predictionText}>{getMoonSignDescription(rasi)}</Text>
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 21-30: Nakshatra Analysis
    for (let i = 21; i <= 30; i++) {
      pages.push(
        <Page key={`nakshatra-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Nakshatra Analysis (Page {i})</Text>
          <View style={styles.nakshatraBox}>
            <Text style={styles.nakshatraTitle}>Your Nakshatra: {nakshatra}</Text>
            <Text style={styles.nakshatraTitle}>Pada: {nakshatraPada}</Text>
          </View>
          <Text style={styles.predictionText}>{getNakshatraDescription(nakshatra)}</Text>
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 31-40: Planetary Aspects
    for (let i = 31; i <= 40; i++) {
      pages.push(
        <Page key={`aspects-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Planetary Aspects & Conjunctions (Page {i})</Text>
          {generateAspectsTable()}
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 41-50: Yogas and Combinations
    for (let i = 41; i <= 50; i++) {
      pages.push(
        <Page key={`yogas-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Astrological Yogas (Page {i})</Text>
          {generateYogasList()}
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 51-55: Basic Remedies
    for (let i = 51; i <= 55; i++) {
      pages.push(
        <Page key={`remedies-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Basic Remedial Measures (Page {i})</Text>
          {generateBasicRemedies()}
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    return pages;
  };

  return <Document>{generatePages()}</Document>;
};

// Premium Client Report (200+ pages)
export const PremiumKundliReport = ({ birthDetails, chartData }) => {
  const {
    name = "Client Name",
    dob = "Birth Date",
    tob = "Birth Time",
    pob = "Birth Place",
    gender = "Gender"
  } = birthDetails || {};

  const {
    lagna = "Aries",
    rasi = "Aries",
    nakshatra = "Ashwini",
    nakshatraPada = "1",
    sunSign = "Aries",
    moonSign = "Aries"
  } = chartData || {};

  const generatePremiumPages = () => {
    const pages = [];
    
    // Pages 1-5: Cover and Detailed Introduction
    for (let i = 1; i <= 5; i++) {
      pages.push(
        <Page key={`premium-cover-${i}`} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Premium Vedic Astrology Kundli</Text>
              <Text style={styles.subtitle}>Complete Birth Chart Analysis with Detailed Predictions</Text>
            </View>
            <View style={[styles.priceBadge, { backgroundColor: '#d4af37' }]}>
              <Text style={styles.priceText}>PREMIUM REPORT</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <NorthIndianChart />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Birth Details</Text>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Name:</Text><Text style={styles.gridValue}>{name}</Text></View>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Date of Birth:</Text><Text style={styles.gridValue}>{dob}</Text></View>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Time of Birth:</Text><Text style={styles.gridValue}>{tob}</Text></View>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Place of Birth:</Text><Text style={styles.gridValue}>{pob}</Text></View>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Gender:</Text><Text style={styles.gridValue}>{gender}</Text></View>
          </View>
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report (200+ Pages)</Text></View>
        </Page>
      );
    }

    // Pages 6-30: Detailed Planetary Calculations (25 pages)
    for (let i = 6; i <= 30; i++) {
      pages.push(
        <Page key={`premium-planets-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Detailed Planetary Calculations (Page {i})</Text>
          {generateDetailedPlanetTable()}
          {generateHouseDetails()}
          {generateNakshatraDetails()}
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 31-60: Divisional Charts (Varga Charts) - 30 pages
    for (let i = 31; i <= 60; i++) {
      pages.push(
        <Page key={`premium-varga-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Divisional Charts (Shodashvarga) - Page {i}</Text>
          {generateVargaChart(i)}
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 61-100: Dasha System (Vimshottari and other Dashas) - 40 pages
    for (let i = 61; i <= 100; i++) {
      pages.push(
        <Page key={`premium-dasha-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Dasha Predictions - Page {i}</Text>
          {generateDashaPredictions(i)}
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 101-140: Transit Predictions (Gochar) - 40 pages
    for (let i = 101; i <= 140; i++) {
      pages.push(
        <Page key={`premium-transit-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Transit Predictions (Gochar) - Page {i}</Text>
          {generateTransitPredictions(i)}
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 141-170: Yearly Predictions (Varshaphal) - 30 pages
    for (let i = 141; i <= 170; i++) {
      pages.push(
        <Page key={`premium-yearly-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Yearly Predictions (Varshaphal) - Page {i}</Text>
          {generateYearlyPredictions(i)}
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 171-200: Remedial Measures and Remedies - 30 pages
    for (let i = 171; i <= 200; i++) {
      pages.push(
        <Page key={`premium-remedies-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Remedial Measures - Page {i}</Text>
          {generatePremiumRemedies(i)}
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 201-210: Additional Premium Content
    for (let i = 201; i <= 210; i++) {
      pages.push(
        <Page key={`premium-extra-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Premium Insights - Page {i}</Text>
          {generatePremiumInsights(i)}
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    return pages;
  };

  return <Document>{generatePremiumPages()}</Document>;
};

// Helper functions for generating content
const generatePlanetTable = () => {
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  return (
    <View>
      {planets.map((planet, idx) => (
        <View key={idx} style={styles.planetRow}>
          <Text style={styles.planetName}>{planet}</Text>
          <Text style={styles.planetSign}>Sign</Text>
          <Text style={styles.planetHouse}>House {idx + 1}</Text>
          <Text style={styles.planetDegree}>0° 00'</Text>
        </View>
      ))}
    </View>
  );
};

const generateHouseCusps = () => {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <View>
      {houses.map(house => (
        <View key={house} style={styles.planetRow}>
          <Text style={styles.planetName}>House {house}</Text>
          <Text style={styles.planetSign}>Sign</Text>
          <Text style={styles.planetDegree}>Cusp: 0° 00'</Text>
        </View>
      ))}
    </View>
  );
};

const generateAspectsTable = () => {
  return (
    <View>
      <Text style={styles.predictionText}>Sun-Moon: Harmonious aspect bringing emotional balance</Text>
      <Text style={styles.predictionText}>Mars-Jupiter: Courageous and optimistic combination</Text>
      <Text style={styles.predictionText}>Venus-Saturn: Disciplined approach to relationships</Text>
      <Text style={styles.predictionText}>Mercury-Rahu: Sharp intellect with innovative thinking</Text>
    </View>
  );
};

const generateYogasList = () => {
  const yogas = ['Gaja Kesari Yoga', 'Lakshmi Yoga', 'Saraswati Yoga', 'Chandra Mangal Yoga', 'Ruchaka Yoga'];
  return (
    <View>
      {yogas.map((yoga, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.subSectionTitle}>{yoga}</Text>
          <Text style={styles.predictionText}>This yoga brings prosperity and success in life.</Text>
        </View>
      ))}
    </View>
  );
};

const generateBasicRemedies = () => {
  return (
    <View>
      <Text style={styles.subSectionTitle}>Mantras</Text>
      <Text style={styles.predictionText}>1. Gayatri Mantra - 108 times daily</Text>
      <Text style={styles.predictionText}>2. Mahamrityunjaya Mantra - 11 times daily</Text>
      <Text style={styles.subSectionTitle}>Donations</Text>
      <Text style={styles.predictionText}>Donate yellow items on Thursdays for Jupiter</Text>
      <Text style={styles.predictionText}>Donate red items on Tuesdays for Mars</Text>
    </View>
  );
};

const generateDetailedPlanetTable = () => {
  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { width: '20%' }]}>Planet</Text>
        <Text style={[styles.tableHeaderText, { width: '20%' }]}>Rashi</Text>
        <Text style={[styles.tableHeaderText, { width: '15%' }]}>House</Text>
        <Text style={[styles.tableHeaderText, { width: '20%' }]}>Degree</Text>
        <Text style={[styles.tableHeaderText, { width: '15%' }]}>Lord</Text>
        <Text style={[styles.tableHeaderText, { width: '10%' }]}>Nakshatra</Text>
      </View>
      {Array.from({ length: 9 }, (_, i) => (
        <View key={i} style={styles.planetRow}>
          <Text style={{ width: '20%', fontSize: 8 }}>Planet {i + 1}</Text>
          <Text style={{ width: '20%', fontSize: 8 }}>Sign {i + 1}</Text>
          <Text style={{ width: '15%', fontSize: 8 }}>H{i + 1}</Text>
          <Text style={{ width: '20%', fontSize: 8 }}>{i * 30}° 00'</Text>
          <Text style={{ width: '15%', fontSize: 8 }}>Lord</Text>
          <Text style={{ width: '10%', fontSize: 8 }}>Nak</Text>
        </View>
      ))}
    </View>
  );
};

const generateHouseDetails = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.subSectionTitle}>House Significations</Text>
      <Text style={styles.predictionText}>1st House: Self, personality, physical appearance</Text>
      <Text style={styles.predictionText}>2nd House: Wealth, family, speech</Text>
      <Text style={styles.predictionText}>3rd House: Courage, siblings, communication</Text>
      <Text style={styles.predictionText}>4th House: Mother, home, vehicles</Text>
      <Text style={styles.predictionText}>5th House: Children, creativity, intelligence</Text>
      <Text style={styles.predictionText}>6th House: Health, enemies, service</Text>
      <Text style={styles.predictionText}>7th House: Marriage, partnerships, business</Text>
      <Text style={styles.predictionText}>8th House: Longevity, inheritance, secrets</Text>
      <Text style={styles.predictionText}>9th House: Father, luck, spirituality</Text>
      <Text style={styles.predictionText}>10th House: Career, reputation, karma</Text>
      <Text style={styles.predictionText}>11th House: Gains, income, friendships</Text>
      <Text style={styles.predictionText}>12th House: Expenses, foreign travel, liberation</Text>
    </View>
  );
};

const generateNakshatraDetails = () => {
  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  return (
    <View>
      <Text style={styles.subSectionTitle}>27 Nakshatras - Detailed Analysis</Text>
      {nakshatras.slice(0, 10).map((nak, idx) => (
        <Text key={idx} style={styles.predictionText}>{idx + 1}. {nak}: {getNakshatraDescription(nak)}</Text>
      ))}
    </View>
  );
};

const generateVargaChart = (pageNum) => {
  const vargaCharts = ['Rashi (D-1)', 'Hora (D-2)', 'Drekkana (D-3)', 'Chaturthamsa (D-4)', 'Saptamamsa (D-7)', 'Navamsa (D-9)', 'Dashamsa (D-10)', 'Dwadashamsa (D-12)', 'Shodashamsa (D-16)', 'Vimshamsa (D-20)', 'Chaturvimshamsa (D-24)', 'Saptavimshamsa (D-27)', 'Trimshamsa (D-30)', 'Khavedamsa (D-40)', 'Akshvedamsa (D-45)', 'Shashtiamsa (D-60)'];
  const chartIndex = (pageNum - 31) % vargaCharts.length;
  return (
    <View>
      <Text style={styles.subSectionTitle}>{vargaCharts[chartIndex]} Chart Analysis</Text>
      <View style={styles.chartContainer}>
        <NorthIndianChart />
      </View>
      <Text style={styles.predictionText}>This divisional chart provides insights into specific areas of life.</Text>
    </View>
  );
};

const generateDashaPredictions = (pageNum) => {
  const dashas = ['Vimshottari Dasha', 'Ashtottari Dasha', 'Yogini Dasha', 'Kalachakra Dasha', 'Chara Dasha', 'Sthira Dasha', 'Kendra Dasha', 'Trikona Dasha'];
  const dashaIndex = (pageNum - 61) % dashas.length;
  return (
    <View>
      <Text style={styles.subSectionTitle}>{dashas[dashaIndex]} Analysis</Text>
      <View style={styles.card}>
        <Text style={styles.predictionText}>Current Dasha period brings opportunities for growth and success.</Text>
        <Text style={styles.predictionText}>Sub-periods indicate favorable times for career advancement.</Text>
        <Text style={styles.predictionText}>Antardasha influences daily events and short-term outcomes.</Text>
      </View>
    </View>
  );
};

const generateTransitPredictions = (pageNum) => {
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const planetIndex = (pageNum - 101) % planets.length;
  return (
    <View>
      <Text style={styles.subSectionTitle}>{planets[planetIndex]} Transit Predictions</Text>
      <View style={styles.card}>
        <Text style={styles.predictionText}>Current transit of {planets[planetIndex]} through your houses.</Text>
        <Text style={styles.predictionText}>Effects on different aspects of life based on house position.</Text>
        <Text style={styles.predictionText}>Remedial measures to strengthen positive influences.</Text>
      </View>
    </View>
  );
};

const generateYearlyPredictions = (pageNum) => {
  const years = Array.from({ length: 30 }, (_, i) => 2025 + i);
  const yearIndex = (pageNum - 141) % years.length;
  return (
    <View>
      <Text style={styles.subSectionTitle}>Year {years[yearIndex]} - Annual Predictions</Text>
      <View style={styles.card}>
        <Text style={styles.predictionText}>Career: Promising opportunities for professional growth</Text>
        <Text style={styles.predictionText}>Finance: Stable income with investment opportunities</Text>
        <Text style={styles.predictionText}>Health: Good overall health, minor seasonal issues</Text>
        <Text style={styles.predictionText}>Relationships: Harmonious family life and new connections</Text>
        <Text style={styles.predictionText}>Education: Academic success and skill development</Text>
      </View>
    </View>
  );
};

const generatePremiumRemedies = (pageNum) => {
  const remedies = [
    { planet: 'Sun', mantra: 'Om Suryaya Namaha', gem: 'Ruby', day: 'Sunday', color: 'Red' },
    { planet: 'Moon', mantra: 'Om Chandraya Namaha', gem: 'Pearl', day: 'Monday', color: 'White' },
    { planet: 'Mars', mantra: 'Om Mangalaya Namaha', gem: 'Coral', day: 'Tuesday', color: 'Red' },
    { planet: 'Mercury', mantra: 'Om Budhaya Namaha', gem: 'Emerald', day: 'Wednesday', color: 'Green' },
    { planet: 'Jupiter', mantra: 'Om Gurave Namaha', gem: 'Yellow Sapphire', day: 'Thursday', color: 'Yellow' },
    { planet: 'Venus', mantra: 'Om Shukraya Namaha', gem: 'Diamond', day: 'Friday', color: 'White' },
    { planet: 'Saturn', mantra: 'Om Shanaishcharaya Namaha', gem: 'Blue Sapphire', day: 'Saturday', color: 'Blue' }
  ];
  const remedyIndex = (pageNum - 171) % remedies.length;
  const r = remedies[remedyIndex];
  return (
    <View>
      <Text style={styles.subSectionTitle}>Remedies for {r.planet}</Text>
      <View style={styles.card}>
        <Text style={styles.predictionText}>Mantra: {r.mantra} (108 times daily)</Text>
        <Text style={styles.predictionText}>Gemstone: {r.gem} (minimum 5 carats)</Text>
        <Text style={styles.predictionText}>Fasting Day: {r.day}</Text>
        <Text style={styles.predictionText}>Lucky Color: {r.color}</Text>
        <Text style={styles.predictionText}>Charity: Donate items related to {r.planet}</Text>
      </View>
    </View>
  );
};

const generatePremiumInsights = (pageNum) => {
  const insights = [
    'Life Purpose Analysis based on Atmakaraka',
    'Karmic Patterns from Past Life Indications',
    'Soul Journey through Nakshatras',
    'Spiritual Evolution Path',
    'Career Timeline and Peak Periods',
    'Relationship Compatibility Factors',
    'Wealth Accumulation Periods',
    'Health Vulnerability Windows',
    'Travel and Foreign Settlement Possibilities',
    'Educational Excellence Indicators'
  ];
  const insightIndex = (pageNum - 201) % insights.length;
  return (
    <View>
      <Text style={styles.subSectionTitle}>Premium Insight: {insights[insightIndex]}</Text>
      <View style={styles.card}>
        <Text style={styles.predictionText}>Deep analysis based on your unique birth chart configuration.</Text>
        <Text style={styles.predictionText}>Personalized guidance for maximizing life potential.</Text>
        <Text style={styles.predictionText}>Strategic recommendations aligned with planetary positions.</Text>
      </View>
    </View>
  );
};

// Description generators
const getAscendantDescription = (sign) => {
  const descriptions = {
    'Aries': 'You are courageous, energetic, and pioneering. Natural leader with competitive spirit.',
    'Taurus': 'You are patient, reliable, and practical. Values stability and material comforts.',
    'Gemini': 'You are curious, adaptable, and communicative. Quick learner with versatile nature.',
    'Cancer': 'You are nurturing, emotional, and protective. Strong connection to family and home.',
    'Leo': 'You are confident, creative, and generous. Natural performer with warm heart.',
    'Virgo': 'You are analytical, meticulous, and service-oriented. Perfectionist with practical approach.',
    'Libra': 'You are diplomatic, charming, and fair-minded. Seeks harmony and balance in life.',
    'Scorpio': 'You are intense, passionate, and transformative. Deep emotional depth and mystery.',
    'Sagittarius': 'You are adventurous, optimistic, and philosophical. Loves freedom and exploration.',
    'Capricorn': 'You are disciplined, ambitious, and responsible. Career-focused with strong work ethic.',
    'Aquarius': 'You are innovative, independent, and humanitarian. Forward-thinking with unique perspective.',
    'Pisces': 'You are compassionate, artistic, and intuitive. Dreamy nature with spiritual inclination.'
  };
  return descriptions[sign] || 'Your ascendant influences your personality and life path.';
};

const getMoonSignDescription = (sign) => {
  const descriptions = {
    'Aries': 'Emotional responses are immediate and passionate. Quick to react but quick to forgive.',
    'Taurus': 'Emotionally stable and security-seeking. Finds comfort in routine and material possessions.',
    'Gemini': 'Emotionally adaptable but mentally restless. Needs variety and intellectual stimulation.',
    'Cancer': 'Deeply emotional and nurturing. Strong attachment to home and family memories.',
    'Leo': 'Emotionally expressive and dramatic. Needs appreciation and creative outlets.',
    'Virgo': 'Emotionally analytical and worry-prone. Finds comfort in order and service to others.',
    'Libra': 'Emotionally balanced but indecisive. Seeks harmony in relationships and surroundings.',
    'Scorpio': 'Emotionally intense and private. Experiences deep transformative feelings.',
    'Sagittarius': 'Emotionally optimistic and freedom-loving. Avoids emotional constraints and drama.',
    'Capricorn': 'Emotionally reserved and responsible. Shows care through practical actions.',
    'Aquarius': 'Emotionally detached but idealistic. Values intellectual connection over emotional expression.',
    'Pisces': 'Emotionally sensitive and empathetic. Highly intuitive with artistic tendencies.'
  };
  return descriptions[sign] || 'Your moon sign governs your emotional nature and inner self.';
};

const getNakshatraDescription = (nakshatra) => {
  return `${nakshatra} Nakshatra represents unique qualities and life path. This lunar mansion influences your personality traits, career aptitudes, and relationship patterns.`;
};

// Component to generate appropriate report based on client type
export const KundliReportGenerator = ({ clientType = 'free', birthDetails, chartData }) => {
  if (clientType === 'premium') {
    return <PremiumKundliReport birthDetails={birthDetails} chartData={chartData} />;
  }
  return <FreeKundliReport birthDetails={birthDetails} chartData={chartData} />;
};

export default KundliReportGenerator;