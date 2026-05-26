import { generateFreeReport } from '../services/reportGenerator.js';

export const createFreeReport = async (req, res) => {
    try {
        // ফ্রন্টএন্ড থেকে পাঠানো ইউজারের ডেটা (day, month, year, hour, min, lat, lon, tzone, name)
        const userData = req.body;

        // বেসিক ভ্যালিডেশন (আপনি চাইলে আরও স্ট্রং ভ্যালিডেশন যোগ করতে পারেন)
        if (!userData.day || !userData.month || !userData.year || !userData.lat || !userData.lon) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide all required birth details (date, time, location coordinates)." 
            });
        }

        // PDF জেনারেট করার সার্ভিস কল করা
        const pdfBuffer = await generateFreeReport(userData);

        // ক্লায়েন্টের ব্রাউজারকে বোঝানো যে এটি একটি PDF ফাইল এবং এটি ডাউনলোড করতে হবে
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${userData.name || 'Kundli'}_Premium_Report.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        // PDF বাফার পাঠানো
        res.send(pdfBuffer);

    } catch (error) {
        console.error("Controller Error (createFreeReport):", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to generate astrology report.",
            error: error.message 
        });
    }
};