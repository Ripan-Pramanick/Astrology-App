import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent) => {
    let browser = null;
    
    try {
        // Launch Puppeteer browser
        // Note: '--no-sandbox' is often required when running Node.js on cloud servers (like AWS, DigitalOcean, Heroku)
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        const page = await browser.newPage();

        // Inject the generated HTML content
        // 'networkidle0' ensures that any external fonts or images (if added later) are fully loaded before generating the PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF with A4 dimensions
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Extremely important for the Dark Luxury background and Gold CSS
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        return pdfBuffer;

    } catch (error) {
        console.error("Puppeteer PDF generation failed:", error);
        throw new Error("Failed to generate PDF document.");
    } finally {
        // Ensure browser is closed to prevent memory leaks
        if (browser) {
            await browser.close();
        }
    }
};