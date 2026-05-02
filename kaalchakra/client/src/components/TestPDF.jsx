// client/src/components/TestPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, marginBottom: 20 },
  text: { fontSize: 12, marginBottom: 10 }
});

export const TestPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Test PDF</Text>
      <Text style={styles.text}>If you can see this, PDF generation is working!</Text>
    </Page>
  </Document>
);