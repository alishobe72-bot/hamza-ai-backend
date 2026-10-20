const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("HAMZA AI VISION Backend is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.DIFY_API_KEY;
    const query = req.body.query;

    if (!apiKey) {
      return res.status(500).json({
        error: "DIFY_API_KEY is not configured on the server."
      });
    }

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const response = await fetch(
      "https://api.dify.ai/v1/chat-messages",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: {},
          query: query,
          response_mode: "blocking",
          user: "hamza-ai-user"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Dify request failed."
      });
    }

    res.json({
      answer: data.answer || "Hamza ko jawab nahi mila."
    });

  } catch (error) {
    console.error("Hamza backend error:", error.message);

    res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Hamza backend running on port ${PORT}`);
});
