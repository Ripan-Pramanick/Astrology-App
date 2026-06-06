import express from "express";
import { generateFreeReport, generatePremiumReport } from "../services/reportGenerator.js";

const router = express.Router();

// --- 1. Free Report Route ---
router.post("/generate-free-report", async (req, res) => {
    try {
        const pdfBuffer = await generateFreeReport(req.body);
        
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="free_report.pdf"',
            "Content-Length": pdfBuffer.length
        });
        
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Free Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate free report." });
    }
});

// --- 2. Premium Report Route ---
router.post("/generate-premium-report", async (req, res) => {
    try {
        const pdfBuffer = await generatePremiumReport(req.body);
        
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="premium_report.pdf"',
            "Content-Length": pdfBuffer.length
        });
        
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Premium Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate premium report." });
    }
});

export default router;