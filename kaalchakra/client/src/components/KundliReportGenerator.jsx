// client/src/components/KundliReportGenerator.jsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Rect,
  Line,
  Circle
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

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#FFFFFF', fontFamily: 'Noto Sans' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottom: '1 solid #F7931E' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1f2a44' },
  subtitle: { fontSize: 10, color: '#666' },
  priceBadge: { backgroundColor: '#F7931E', padding: 5, borderRadius: 4 },
  priceText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', backgroundColor: '#F7931E', color: 'white', padding: 6, marginBottom: 10 },
  subSectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#1f2a44', marginBottom: 6, marginTop: 8, borderLeft: '3 solid #F7931E', paddingLeft: 6 },
  gridRow: { flexDirection: 'row', marginBottom: 4 },
  gridLabel: { width: '35%', fontSize: 9, color: '#666' },
  gridValue: { width: '65%', fontSize: 9, fontWeight: 'bold', color: '#333' },
  card: { backgroundColor: '#f8f9fb', padding: 10, borderRadius: 8, marginBottom: 10 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 7, color: '#999', borderTop: '1 solid #eee', paddingTop: 10 },
  nakshatraBox: { backgroundColor: '#fff3e0', padding: 10, borderRadius: 8, marginBottom: 10 },
  nakshatraTitle: { fontSize: 12, fontWeight: 'bold', color: '#F7931E', textAlign: 'center' },
  predictionText: { fontSize: 8, lineHeight: 1.4, color: '#444', marginTop: 5 },
  chartContainer: { alignItems: 'center', marginVertical: 10 },
  planetRow: { flexDirection: 'row', marginBottom: 4, padding: 4, backgroundColor: '#fff', borderRadius: 4, borderBottom: '1 solid #eee' },
  planetName: { fontSize: 9, fontWeight: 'bold', width: '20%' },
  planetDetail: { fontSize: 9, width: '40%' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1f2a44', padding: 6, marginTop: 5, marginBottom: 5 },
  tableHeaderText: { fontSize: 8, fontWeight: 'bold', color: 'white' },
});

// North Indian Chart Component
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

// Helper: Extract data from chartData
const getFromChartData = (chartData, key, defaultValue) => {
  if (!chartData) return defaultValue;
  return chartData[key] !== undefined ? chartData[key] : defaultValue;
};

// ==================== FREE REPORT (50+ Pages) ====================
export const FreeKundliReport = ({ birthDetails, chartData }) => {
  console.log("📄 Generating FREE Report (50+ pages) with data:", chartData);

  const name = birthDetails?.name || "Client Name";
  const dob = birthDetails?.dob || "Birth Date";
  const tob = birthDetails?.tob || "Birth Time";
  const pob = birthDetails?.pob || "Birth Place";
  const gender = birthDetails?.gender || "Gender";

  // Extract from chartData (from database)
  const lagna = getFromChartData(chartData, 'lagna', getFromChartData(chartData?.basic, 'ascendant', 'Aries'));
  const rasi = getFromChartData(chartData, 'rasi', getFromChartData(chartData?.basic, 'moon_sign', 'Aries'));
  const nakshatra = getFromChartData(chartData, 'nakshatra', getFromChartData(chartData?.basic, 'nakshatra', 'Ashwini'));
  const nakshatraPada = getFromChartData(chartData, 'nakshatraPada', '1');
  const planets = getFromChartData(chartData, 'planets', []);
  const houses = getFromChartData(chartData, 'houses', []);
  const yogas = getFromChartData(chartData, 'yogas', []);
  const dasha = getFromChartData(chartData, 'dasha', []);

  const generatePlanetTableFromData = () => {
    if (planets.length === 0) {
      return (
        <View>
          <Text style={styles.predictionText}>Planetary data not available</Text>
        </View>
      );
    }
    return (
      <View>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Planet</Text>
          <Text style={[styles.tableHeaderText, { width: '30%' }]}>Sign</Text>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>House</Text>
          <Text style={[styles.tableHeaderText, { width: '30%' }]}>Degree</Text>
        </View>
        {planets.map((planet, idx) => (
          <View key={idx} style={styles.planetRow}>
            <Text style={[styles.planetName, { width: '20%' }]}>{planet.name}</Text>
            <Text style={[styles.planetDetail, { width: '30%' }]}>{planet.sign}</Text>
            <Text style={[styles.planetDetail, { width: '20%' }]}>{planet.house}</Text>
            <Text style={[styles.planetDetail, { width: '30%' }]}>{planet.degree}</Text>
          </View>
        ))}
      </View>
    );
  };

  const generateYogasFromData = () => {
    if (yogas.length === 0) {
      return <Text style={styles.predictionText}>No significant yogas found</Text>;
    }
    return yogas.map((yoga, idx) => (
      <View key={idx} style={styles.card}>
        <Text style={styles.subSectionTitle}>{yoga}</Text>
        <Text style={styles.predictionText}>This yoga influences your life positively.</Text>
      </View>
    ));
  };

  const generatePages = () => {
    const pages = [];

    // Pages 1-5: Cover and Introduction
    for (let i = 1; i <= 5; i++) {
      pages.push(
        <Page key={`free-cover-${i}`} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View><Text style={styles.title}>Vedic Astrology Kundli</Text><Text style={styles.subtitle}>Complete Birth Chart Analysis</Text></View>
            <View style={styles.priceBadge}><Text style={styles.priceText}>FREE REPORT</Text></View>
          </View>
          <View style={styles.chartContainer}><NorthIndianChart /></View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Birth Details</Text>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Name:</Text><Text style={styles.gridValue}>{name}</Text></View>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Date of Birth:</Text><Text style={styles.gridValue}>{dob}</Text></View>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Time of Birth:</Text><Text style={styles.gridValue}>{tob}</Text></View>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Place of Birth:</Text><Text style={styles.gridValue}>{pob}</Text></View>
            <View style={styles.gridRow}><Text style={styles.gridLabel}>Gender:</Text><Text style={styles.gridValue}>{gender}</Text></View>
          </View>
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report (50+ Pages)</Text></View>
        </Page>
      );
    }

    // Pages 6-20: Planetary Positions
    for (let i = 6; i <= 20; i++) {
      pages.push(
        <Page key={`free-planets-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Planetary Positions (Page {i})</Text>
          {generatePlanetTableFromData()}
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 21-35: House Analysis
    for (let i = 21; i <= 35; i++) {
      pages.push(
        <Page key={`free-houses-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>House Analysis (Page {i})</Text>
          <Text style={styles.subSectionTitle}>12 Houses & Their Significations</Text>
          <View style={styles.card}>
            <Text style={styles.predictionText}>1st House: Self, personality, physical appearance</Text>
            <Text style={styles.predictionText}>2nd House: Wealth, family, speech</Text>
            <Text style={styles.predictionText}>3rd House: Siblings, courage, communication</Text>
            <Text style={styles.predictionText}>4th House: Mother, home, vehicles</Text>
            <Text style={styles.predictionText}>5th House: Children, creativity, intelligence</Text>
            <Text style={styles.predictionText}>6th House: Health, enemies, service</Text>
            <Text style={styles.predictionText}>7th House: Marriage, partnerships</Text>
            <Text style={styles.predictionText}>8th House: Longevity, inheritance, secrets</Text>
            <Text style={styles.predictionText}>9th House: Father, luck, spirituality</Text>
            <Text style={styles.predictionText}>10th House: Career, reputation, karma</Text>
            <Text style={styles.predictionText}>11th House: Gains, income, friendships</Text>
            <Text style={styles.predictionText}>12th House: Expenses, foreign travel, liberation</Text>
          </View>
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 36-50: Nakshatra and Yogas
    for (let i = 36; i <= 50; i++) {
      pages.push(
        <Page key={`free-nakshatra-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Nakshatra & Yogas (Page {i})</Text>
          <View style={styles.nakshatraBox}>
            <Text style={styles.nakshatraTitle}>Your Nakshatra: {nakshatra}</Text>
            <Text style={styles.nakshatraTitle}>Pada: {nakshatraPada}</Text>
          </View>
          <Text style={styles.predictionText}>{getNakshatraDescription(nakshatra)}</Text>
          <Text style={styles.subSectionTitle}>Astrological Yogas</Text>
          {generateYogasFromData()}
          <View style={styles.footer}><Text>Page {i} of Free Kundli Report</Text></View>
        </Page>
      );
    }

    console.log(`✅ Free Report: ${pages.length} pages generated`);
    return pages;
  };

  return <Document>{generatePages()}</Document>;
};

// ==================== PREMIUM REPORT (200+ Pages) ====================
export const PremiumKundliReport = ({ birthDetails, chartData }) => {
  console.log("📄 Generating PREMIUM Report (200+ pages) with data:", chartData);

  const name = birthDetails?.name || "Client Name";
  const dob = birthDetails?.dob || "Birth Date";
  const tob = birthDetails?.tob || "Birth Time";
  const pob = birthDetails?.pob || "Birth Place";
  const gender = birthDetails?.gender || "Gender";

  const lagna = getFromChartData(chartData, 'lagna', getFromChartData(chartData?.basic, 'ascendant', 'Aries'));
  const rasi = getFromChartData(chartData, 'rasi', getFromChartData(chartData?.basic, 'moon_sign', 'Aries'));
  const nakshatra = getFromChartData(chartData, 'nakshatra', getFromChartData(chartData?.basic, 'nakshatra', 'Ashwini'));
  const nakshatraPada = getFromChartData(chartData, 'nakshatraPada', '1');
  const planets = getFromChartData(chartData, 'planets', []);
  const yogas = getFromChartData(chartData, 'yogas', []);
  const dasha = getFromChartData(chartData, 'dasha', []);

  const generatePlanetTableFromData = () => {
    if (planets.length === 0) return <Text style={styles.predictionText}>Planetary data not available</Text>;
    return (
      <View>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: '15%' }]}>Planet</Text>
          <Text style={[styles.tableHeaderText, { width: '15%' }]}>Rashi</Text>
          <Text style={[styles.tableHeaderText, { width: '10%' }]}>House</Text>
          <Text style={[styles.tableHeaderText, { width: '15%' }]}>Degree</Text>
          <Text style={[styles.tableHeaderText, { width: '15%' }]}>Lord</Text>
          <Text style={[styles.tableHeaderText, { width: '15%' }]}>Nakshatra</Text>
          <Text style={[styles.tableHeaderText, { width: '15%' }]}>Pada</Text>
        </View>
        {planets.map((planet, idx) => (
          <View key={idx} style={styles.planetRow}>
            <Text style={{ width: '15%', fontSize: 8 }}>{planet.name}</Text>
            <Text style={{ width: '15%', fontSize: 8 }}>{planet.sign}</Text>
            <Text style={{ width: '10%', fontSize: 8 }}>{planet.house}</Text>
            <Text style={{ width: '15%', fontSize: 8 }}>{planet.degree}</Text>
            <Text style={{ width: '15%', fontSize: 8 }}>{planet.lord}</Text>
            <Text style={{ width: '15%', fontSize: 8 }}>{planet.nakshatra}</Text>
            <Text style={{ width: '15%', fontSize: 8 }}>{planet.pada}</Text>
          </View>
        ))}
      </View>
    );
  };

  const generateDashaFromData = () => {
    if (dasha.length === 0) return <Text style={styles.predictionText}>Dasha data not available</Text>;
    return dasha.map((d, idx) => (
      <View key={idx} style={styles.planetRow}>
        <Text style={{ width: '25%', fontSize: 8 }}>{d.planet}</Text>
        <Text style={{ width: '25%', fontSize: 8 }}>{d.years} years</Text>
        <Text style={{ width: '25%', fontSize: 8 }}>{d.start}</Text>
        <Text style={{ width: '25%', fontSize: 8 }}>{d.end}</Text>
      </View>
    ));
  };

  const generatePremiumPages = () => {
    const pages = [];

    // Pages 1-10: Cover and Detailed Introduction
    for (let i = 1; i <= 10; i++) {
      pages.push(
        <Page key={`premium-cover-${i}`} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View><Text style={styles.title}>Premium Vedic Astrology Kundli</Text><Text style={styles.subtitle}>Complete Birth Chart Analysis</Text></View>
            <View style={[styles.priceBadge, { backgroundColor: '#d4af37' }]}><Text style={styles.priceText}>PREMIUM REPORT</Text></View>
          </View>
          <View style={styles.chartContainer}><NorthIndianChart /></View>
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

    // Pages 11-40: Detailed Planetary Calculations
    for (let i = 11; i <= 40; i++) {
      pages.push(
        <Page key={`premium-planets-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Detailed Planetary Calculations (Page {i})</Text>
          {generatePlanetTableFromData()}
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Planetary Strengths</Text>
            <Text style={styles.predictionText}>Based on Vedic astrology calculations</Text>
          </View>
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 41-80: Divisional Charts
    const vargaCharts = ['Rashi (D-1)', 'Navamsa (D-9)', 'Dashamsa (D-10)', 'Dwadashamsa (D-12)'];
    for (let i = 41; i <= 80; i++) {
      const chartIndex = (i - 41) % vargaCharts.length;
      pages.push(
        <Page key={`premium-varga-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Divisional Charts - {vargaCharts[chartIndex]} (Page {i})</Text>
          <View style={styles.chartContainer}><NorthIndianChart /></View>
          <Text style={styles.predictionText}>This divisional chart provides deep insights.</Text>
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 81-130: Dasha System
    for (let i = 81; i <= 130; i++) {
      pages.push(
        <Page key={`premium-dasha-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Dasha Predictions (Page {i})</Text>
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Mahadasha Periods</Text>
            {generateDashaFromData()}
          </View>
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 131-170: Transit Predictions
    for (let i = 131; i <= 170; i++) {
      pages.push(
        <Page key={`premium-transit-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Transit Predictions (Page {i})</Text>
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Current Transit Effects</Text>
            <Text style={styles.predictionText}>Career and professional opportunities</Text>
            <Text style={styles.predictionText}>Financial gains and investments</Text>
            <Text style={styles.predictionText}>Health and wellbeing considerations</Text>
          </View>
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 171-200: Yogas and Remedies
    for (let i = 171; i <= 200; i++) {
      pages.push(
        <Page key={`premium-yogas-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Yogas & Remedies (Page {i})</Text>
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Astrological Yogas</Text>
            {yogas.length > 0 ? yogas.map((y, idx) => <Text key={idx} style={styles.predictionText}>• {y}</Text>) : <Text style={styles.predictionText}>No specific yogas detected</Text>}
          </View>
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Remedial Measures</Text>
            <Text style={styles.predictionText}>Mantras and gemstones for planetary balance</Text>
          </View>
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    // Pages 201-210: Premium Insights
    for (let i = 201; i <= 210; i++) {
      pages.push(
        <Page key={`premium-extra-${i}`} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Premium Insights (Page {i})</Text>
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Life Purpose Analysis</Text>
            <Text style={styles.predictionText}>Based on your ascendant {lagna}</Text>
            <Text style={styles.subSectionTitle}>Karmic Patterns</Text>
            <Text style={styles.predictionText}>Understanding your life's journey</Text>
            <Text style={styles.subSectionTitle}>Spiritual Path</Text>
            <Text style={styles.predictionText}>Guidance for soul evolution</Text>
          </View>
          <View style={styles.footer}><Text>Page {i} of Premium Kundli Report</Text></View>
        </Page>
      );
    }

    console.log(`✅ Premium Report: ${pages.length} pages generated`);
    return pages;
  };

  return <Document>{generatePremiumPages()}</Document>;
};

// Helper functions
const getNakshatraDescription = (nakshatra) => {
  const descriptions = {
    'Ashwini': 'Quick action, healing abilities, and leadership qualities.',
    'Bharani': 'Creative, nurturing, and transformative energy.',
    'Rohini': 'Artistic, fertile, and materially prosperous.',
    'Mrigashira': 'Curious, seeking, and detail-oriented.',
    'Ardra': 'Analytical, transformative, and truth-seeking.',
    'Punarvasu': 'Optimistic, nurturing, and abundant.',
    'Pushya': 'Nourishing, protective, and traditional.',
  };
  return `${nakshatra} Nakshatra represents ${descriptions[nakshatra] || 'unique qualities and life path.'}`;
};

// Main component
export const KundliReportGenerator = ({ clientType = 'free', birthDetails, chartData }) => {
  if (clientType === 'premium') {
    return <PremiumKundliReport birthDetails={birthDetails} chartData={chartData} />;
  }
  return <FreeKundliReport birthDetails={birthDetails} chartData={chartData} />;
};

export default KundliReportGenerator;