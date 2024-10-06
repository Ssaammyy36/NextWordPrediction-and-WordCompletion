import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

// bootstrap 
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";

// transformer
import { pipeline } from '@xenova/transformers';
import { HfInference } from "@huggingface/inference";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
