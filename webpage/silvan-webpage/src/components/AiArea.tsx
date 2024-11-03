import React, { useState, useEffect } from "react";
import { pipeline } from "@xenova/transformers";

const AiArea = () => {
  const [model, setModel] = useState(null);
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fester Eingabetext
  const fixedInputText =
    "Dies ist ein Beispieltext, der zur";

  // Modell laden und Pipeline einrichten
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        // Verwende die Pipeline für Textgenerierung mit dem BART-Modell
        const textGenerationPipeline = await pipeline(
          "text-generation",
          "HuggingFaceTB/SmolLM-135M"
        );
        setModel(textGenerationPipeline);
      } catch (error) {
        console.error("Fehler beim Laden des Modells:", error);
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  // Funktion zur Textgenerierung
  const generateText = async () => {
    if (!model) {
      console.warn("Das Modell ist noch nicht geladen.");
      return;
    }

    try {
      setLoading(true);
      // Generiere Text basierend auf dem festen Eingabetext
      const output = await model(fixedInputText, { max_length: 50 }); // max_length anpassen
      setGeneratedText(output[0]?.generated_text || ""); // Sicherheitscheck
    } catch (error) {
      console.error("Fehler bei der Textgenerierung:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>BART KI Textgenerator</h1>
      <p>
        <strong>Fester Input:</strong> {fixedInputText}
      </p>
      <p>
        <strong>Generierter Output:</strong> {generatedText}
      </p>
      <button
        className="btn btn-outline-primary mb-3"
        onClick={generateText}
        disabled={loading}
        style={{ padding: "10px 20px" }}
      >
        {loading ? "Generiere ..." : "Generieren"}
      </button>
      {generatedText && <p>{generatedText}</p>}
    </div>
  );
};

export default AiArea;
