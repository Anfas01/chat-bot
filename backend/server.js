import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all origins (allows your Vercel frontend to communicate with it)
app.use(cors());
app.use(express.json());

// Your Groq API Key pulled securely from environment variables
const API_KEY = process.env.GROQ_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", 
        messages: [{ role: "user", content: req.body.message }]
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Groq API Error:", data);
      return res.status(response.status).json(data);
    }

    // Extract the text reply from Groq's structure
    const botText = data.choices[0].message.content;
    res.json({ text: botText });

  } catch (error) {
    console.error("Backend Catch Error:", error);
    res.status(500).json({ error: "Failed to fetch from Groq" });
  }
});

// CRITICAL FIX: Use Render's dynamic port environment variable, or fallback to 5000 locally
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));