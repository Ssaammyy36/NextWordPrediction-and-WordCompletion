import { useState } from 'react';

// Hinweis: API-Schlüssel sollte sicher als Umgebungsvariable gespeichert werden!
const API_KEY = "";

function OpenAi() {
  const [tweet, setTweet] = useState("");
  const [sentiment, setSentiment] = useState(""); // "Negative" or "Positive"
  const [error, setError] = useState<string | null>(null);

  async function callOpenAIAPI() {
    console.log("Calling the OpenAI API");
    setError(null);

    const APIBody = {
      model: "gpt-4", // Nutze ein aktuelles Modell
      messages: [
        { role: "system", content: "You are a helpful assistant that analyzes tweet sentiments." },
        { role: "user", content: `What is the sentiment of this tweet? "${tweet}"` }
      ],
      temperature: 0, // Präzision maximieren
      max_tokens: 60 // Antwort kurz halten
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify(APIBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        setError(`Error: ${response.status} - ${errorData.error.message}`);
        return;
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content?.trim();
      setSentiment(aiResponse || "No sentiment detected.");
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="App">
      <div>
        <textarea
          onChange={(e) => setTweet(e.target.value)}
          placeholder="Paste your tweet here!"
          cols={50}
          rows={10}
        />
      </div>
      <div>
        <button onClick={callOpenAIAPI}>Get The Tweet Sentiment From OpenAI API</button>
        {sentiment !== "" && !error ? (
          <h3>This Tweet Is: {sentiment}</h3>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : null}
      </div>
    </div>
  );
}

export default OpenAi;
