import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

function TrainAiModel() {
  const [model, setModel] = useState(null); // Modell im State speichern
  const [tokenizer, setTokenizer] = useState(null);
  const [maxSequenceLen, setMaxSequenceLen] = useState(0);
  
  const textFile = '/example_text.txt'; 
  const topK = 5; // Anzahl der Top-Wörter

  // Funktion zum Laden des Datensatzes
  const loadData = async (textFile) => {
    try {
      const response = await fetch(textFile); 
      if (!response.ok) throw new Error('Fehler beim Laden der Datei');
      const data = await response.text();
      console.log(`Datensatz: ${data.slice(0, 250)}`);
      return data;
    } catch (error) {
      console.error('Fehler beim Laden des Datensatzes:', error);
      return null;
    }
  };

  // Tokenizer-Klasse
  class Tokenizer {
    constructor() {
      this.wordIndex = {};
      this.indexWord = {};
      this.wordCount = 0;
    }
    fitOnTexts(corpus) {
      corpus.forEach(sentence => {
        sentence.toLowerCase().split(/\s+/).forEach(word => {
          if (!(word in this.wordIndex)) {
            this.wordIndex[word] = ++this.wordCount;
            this.indexWord[this.wordCount] = word;
          }
        });
      });
    }
    textsToSequences(corpus) {
      return corpus.map(sentence =>
        sentence.toLowerCase().split(/\s+/).map(word => this.wordIndex[word] || 0)
      );
    }
  }

  const generateTokenizer = (data) => {
    const tokenizer = new Tokenizer();
    const corpus = data.trim().split('\n');
    tokenizer.fitOnTexts(corpus);
    const sequences = tokenizer.textsToSequences(corpus);
    setTokenizer(tokenizer);
    setMaxSequenceLen(Math.max(...sequences.map(seq => seq.length)));
    return sequences;
  };

  const createModel = (totalWords, maxSequenceLen) => {
    const model = tf.sequential();
    model.add(tf.layers.embedding({ inputDim: totalWords, outputDim: 100, inputLength: maxSequenceLen - 1 }));
    model.add(tf.layers.bidirectional({ layer: tf.layers.lstm({ units: 150 }) }));
    model.add(tf.layers.dense({ units: totalWords, activation: 'softmax' }));
    model.compile({ loss: 'categoricalCrossentropy', optimizer: tf.train.adam(0.01), metrics: ['accuracy'] });
    return model;
  };

  const trainModel = async (model, xs, ys) => {
    await model.fit(xs, ys, { epochs: 100, verbose: 1 });
    console.log('Training abgeschlossen');
  };

  const loadModelClick = async () => {
    const data = await loadData(textFile);
    if (data) {
      const sequences = generateTokenizer(data);
      const totalWords = Object.keys(tokenizer.wordIndex).length + 1;
      const xs = tf.tensor2d(sequences.map(seq => seq.slice(0, -1)));
      const ys = tf.tensor2d(sequences.map(seq => seq.slice(-1)));
      const model = createModel(totalWords, maxSequenceLen);
      setModel(model);
      await trainModel(model, xs, ys);
    }
  };
  loadModelClick();

  const predictNextWords = (seedText) => {
    const tokenList = tokenizer.textsToSequences([seedText])[0];
    const padded = Array(maxSequenceLen - 1).fill(0);
    tokenList.forEach((t, i) => (padded[padded.length - tokenList.length + i] = t));
    const inputTensor = tf.tensor2d([padded], [1, maxSequenceLen - 1]);

    const predictions = model.predict(inputTensor).arraySync()[0];
    const topWords = Array.from(predictions)
      .map((prob, index) => ({ word: tokenizer.indexWord[index], prob }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, topK);

    console.log(`Vorhersagen für "${seedText}":`);
    topWords.forEach(({ word, prob }) => console.log(`${word}: ${prob.toFixed(4) * 100}%`));
  };

  return (
    <div>
        <h1>TensorFlow.js Modell laden</h1>

        <div className="d-flex flex-wrap gap-3">
            <button className="btn btn-outline-primary mb-3" onClick={() => predictNextWords('Wie')}>Predict Next Word</button>
        </div>
    </div>
  );
}

export default TrainAiModel;
