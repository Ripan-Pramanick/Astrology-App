import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent) => {
    let browser = null;
    
    try {
        // Launch Puppeteer browser
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        const page = await browser.newPage();

        // 🌟 Timeout 0 করে দেওয়া হলো যাতে ২০০ পেজ লোড হতে গিয়ে ক্র্যাশ না করে
        await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 0 });

        // 🌟 PDF জেনারেট হওয়ার জন্যও Timeout 0 করা হলো
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, 
            timeout: 0, 
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
        if (browser) {
            await browser.close();
        }
    }
};