import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data for TypeScript
interface PredictionContextType {
    inputText: string;
    setInputText: (text: string) => void;
    prediction: string[] | null;
    setPrediction: (prediction: string[] | null) => void;
    startPrediction: boolean;
    setStartPrediction: (start: boolean) => void;
    startAutocomplete: boolean;
    setStartAutocomplete: (start: boolean) => void;
    isAutocompleting: boolean;
    setIsAutocompleting: (isCompleting: boolean) => void;
}

// Create the context. It will hold the global state.
const PredictionContext = createContext<PredictionContextType | null>(null);

/**
 * The Provider component is responsible for creating the state and passing it
 * to all children components via the Context.
 */
export const PredictionProvider = ({ children }: { children: ReactNode }) => {
    // All the state that was previously in App.tsx is now managed here.
    const [inputText, setInputText] = useState(''); 
    const [prediction, setPrediction] = useState<string[] | null>(null); 
    const [startPrediction, setStartPrediction] = useState(false);
    const [startAutocomplete, setStartAutocomplete] = useState(false);
    const [isAutocompleting, setIsAutocompleting] = useState(false);

    // The value object holds all the state and functions to be shared.
    const value = {
        inputText,
        setInputText,
        prediction,
        setPrediction,
        startPrediction,
        setStartPrediction,
        startAutocomplete,
        setStartAutocomplete,
        isAutocompleting,
        setIsAutocompleting
    };

    return (
        <PredictionContext.Provider value={value}>
            {children}
        </PredictionContext.Provider>
    );
};

/**
 * A custom hook for easy access to the context data.
 * This avoids having to write useContext(PredictionContext) in every component.
 */
export const usePredictionContext = () => {
    const context = useContext(PredictionContext);
    if (!context) {
        // This error will be thrown if a component tries to use the context
        // without being a child of the PredictionProvider.
        throw new Error('usePredictionContext must be used within a PredictionProvider');
    }
    return context;
};
