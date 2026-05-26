import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/test-api", async (req, res) => {

    try {

        const userId = process.env.ASTROLOGY_USER_ID;
        const apiKey = process.env.ASTROLOGY_API_KEY;

        const auth = Buffer
            .from(`${userId}:${apiKey}`)
            .toString("base64");

        const response = await axios({
            method: "post",
            url: "https://json.astrologyapi.com/v1/birth_details",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json"
            },
            data: {
                day: 12,
                month: 8,
                year: 2004,
                hour: 17,
                min: 45,
                lat: 23.4,
                lon: 88.5,
                tzone: 5.5
            }
        });

        res.json(response.data);

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: error.response?.data || error.message
        });
    }
});

export default router;