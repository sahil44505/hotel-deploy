import axios from "axios";
import { NextResponse } from "next/server";
import querystring from "querystring"; // Required for URL-encoded data

// Helper function for retrying requests on rate limit errors
async function fetchWithRetries(options, retries = 3) {
    try {
        return await axios.request(options);
    } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
            console.warn("Rate limited. Retrying...");
            const retryAfter = error.response.headers["retry-after"]
                ? parseInt(error.response.headers["retry-after"], 10) * 1000
                : 2000;

            await new Promise((resolve) => setTimeout(resolve, retryAfter));
            return fetchWithRetries(options, retries - 1);
        }
        throw error;
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { title } = body;
        const query = title

      
        const formData = querystring.stringify({ query });
         
        const options = {
            method: "POST",
            url: "https://google-api-unlimited.p.rapidapi.com/search_image",
            headers: {
                "X-Rapidapi-Key": process.env.RAPIDAPI_KEY || "0fa4e821e0msh1a136ff99f1c923p1d5819jsn32f3e7c2fc5b",
                "X-Rapidapi-Host": "google-api-unlimited.p.rapidapi.com",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: formData, // Send data as URL-encoded
        };
         
        // Fetch images with retry mechanism
        const response = await fetchWithRetries(options);
        const images = response.data || [];
        const previewUrls = images.slice(0, 10).map((img) => img.preview?.url || "");
         console.log(previewUrls)
        return NextResponse.json(previewUrls);
    } catch (error) {
        console.error("Error fetching images:", error.response?.data || error.message);
        return NextResponse.json({ error: "Failed to fetch images." }, { status: error.response?.status || 500 });
    }
}
