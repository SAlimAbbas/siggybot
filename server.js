import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// ADD THIS LINE after app.use(cors()):
app.use(express.static(__dirname)); // serves all files in folder
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/chat", async (req, res) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // free & powerful
        messages: [
          { role: "system", content: req.body.system },
          ...req.body.messages,
        ],
        max_tokens: 1000,
      }),
    },
  );
  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Siggy proxy running on port ${PORT}`));


const RENDER_URL = "https://siggybot.onrender.com";
setInterval(() => {
  fetch(`${RENDER_URL}/health`)
    .then(() => console.log("✅ Keep-alive ping sent"))
    .catch(() => console.log("⚠️ Ping failed"));
}, 840000); // every 14 minutes