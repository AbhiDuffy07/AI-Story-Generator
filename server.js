import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = 5500;
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json()); // ✅ Allows JSON requests!

// ✅ FIX: Make sure this is a POST request!
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required!" });
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5pro" });
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = response.text();

        res.json({ story: text });
    } catch (error) {
        console.error("Error generating story:", error);
        res.status(500).json({ error: "Unable to generate story." });
    }
});

// ✅ FIX: Add a GET route for testing
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});


