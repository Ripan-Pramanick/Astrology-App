// client/src/utils/pdf.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generate PDF from a given HTML element.
 * @param {HTMLElement} element - The DOM element to render as PDF.
 * @param {string} filename - Name of the output file (without extension).
 * @param {Object} options - Additional options (scale, orientation, etc.)
 */
export const generatePDF = async (element, filename = 'kundali', options = {}) => {
  const {
    scale = 2,
    orientation = 'portrait',
    unit = 'mm',
    format = 'a4',
  } = options;

  if (!element) {
    throw new Error('No element provided for PDF generation');
  }

  // Capture the element as canvas
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true, // if images are cross-origin
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF(orientation, unit, format);
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${filename}.pdf`);
};

/**
 * Generate Kundali PDF with a specific layout.
 * @param {HTMLElement} kundliElement - The chart element.
 * @param {HTMLElement} detailsElement - The planet table/details element.
 * @param {string} filename - Output filename.
 */
export const generateKundaliPDF = async (kundliElement, detailsElement, filename = 'kundali') => {
  // If only one element, use it; otherwise combine.
  if (!detailsElement) {
    return generatePDF(kundliElement, filename);
  }

  // Create a wrapper div for both sections (assuming they are separate)
  const wrapper = document.createElement('div');
  wrapper.style.padding = '20px';
  wrapper.style.backgroundColor = '#fff';
  wrapper.appendChild(kundliElement.cloneNode(true));
  wrapper.appendChild(detailsElement.cloneNode(true));
  document.body.appendChild(wrapper);

  try {
    await generatePDF(wrapper, filename);
  } finally {
    document.body.removeChild(wrapper);
  }
};