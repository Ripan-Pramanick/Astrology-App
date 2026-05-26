import express from "express";
import { generateFreeReport } from "../services/reportGenerator.js";

const router = express.Router();

router.post("/generate-report", async (req, res) => {
    try {
        const userData = req.body;

        // ১. বেসিক ভ্যালিডেশন
        if (!userData.day || !userData.month || !userData.year || !userData.lat || !userData.lon) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required birth details (date, time, location coordinates)."
            });
        }

        // ২. পিডিএফ বাফার জেনারেট করা
        const pdfBuffer = await generateFreeReport(userData);

        // ৩. ইউজারের নাম অনুযায়ী ডাইনামিক ফাইলের নাম তৈরি করা (স্পেস থাকলে আন্ডারস্কোর হবে)
        const fileName = userData.name 
            ? `${userData.name.replace(/\s+/g, '_')}_Kundli_Report.pdf` 
            : "Premium_Kundli_Report.pdf";

        // ৪. রেসপন্স হেডার সেট করা (attachment দিলে সরাসরি ডাউনলোড হবে)
        res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Length": pdfBuffer.length,
            "Content-Disposition": `attachment; filename="${fileName}"` 
            // নোট: ব্রাউজারে শুধু ওপেন করতে চাইলে 'attachment' এর জায়গায় 'inline' লিখতে পারেন।
        });

        res.end(pdfBuffer);

    } catch (error) {
        console.error("FULL ERROR in generate-report:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate astrology report.",
            error: error.message
        });
    }
});

export default router;