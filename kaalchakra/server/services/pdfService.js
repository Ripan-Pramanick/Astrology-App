import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent) => {
    let browser = null;
    
    try {
        console.log("🚀 Starting PDF Generation Engine (Low-RAM Mode)...");
        
       
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', 
                '--disable-gpu',
                '--no-zygote',
                '--single-process', // RAM HALF
                '--js-flags="--max-old-space-size=256"' // MEMORY LIMITED
            ]
        });

        const page = await browser.newPage();
        console.log("📄 Page created, setting HTML content...");

        
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 0 });

        console.log("🖨️ Printing 200+ Pages to PDF. Please wait...");
        
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

        console.log("✅ PDF Generated successfully! Size:", Math.round(pdfBuffer.length / 1024 / 1024), "MB");
        return pdfBuffer;

    } catch (error) {
        console.error("❌ Puppeteer PDF generation failed:", error);
        throw new Error("Failed to generate PDF document.");
    } finally {
        if (browser) {
            await browser.close();
            console.log("🧹 Browser closed securely.");
        }
    }
};