import React, { useState } from "react";

export default function AegisPage() {
    const [symptoms, setSymptoms] = useState("");
    const [diagnosis, setDiagnosis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle the API call with exponential backoff
    const callApiWithBackoff = async (payload, apiUrl, maxRetries = 5, delay = 1000) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    return await response.json();
                } else if (response.status === 429) { // Too Many Requests
                    console.warn(`API rate limit exceeded. Retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                } else {
                    throw new Error(`API call failed with status: ${response.status}`);
                }
            } catch (e) {
                console.error(`Attempt ${i + 1} failed:`, e);
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                }
            }
        }
        throw new Error('API call failed after multiple retries.');
    };

    const handleDiagnoseClick = async () => {
        setDiagnosis(null);
        setError(null);
        setIsLoading(true);

        const prompt = `
            You are a helpful AI medical assistant named Aegis.
            Based on the following symptoms, provide a list of 3-5 possible causes or conditions.
            Also, provide a short, general health advice paragraph for the user.
            DO NOT provide any definitive medical diagnosis. The user is just looking for informational purposes.
            
            Symptoms: "${symptoms}"

            Format the response as a JSON object with the following schema:
            {
                "conditions": ["Condition 1", "Condition 2", ...],
                "advice": "General health advice paragraph."
            }
        `;

        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = {
                contents: chatHistory,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "conditions": {
                                "type": "ARRAY",
                                "items": { "type": "STRING" }
                            },
                            "advice": { "type": "STRING" }
                        },
                        "propertyOrdering": ["conditions", "advice"]
                    }
                }
            };

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const result = await callApiWithBackoff(payload, apiUrl);
            
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                const jsonString = result.candidates[0].content.parts[0].text;
                const parsedJson = JSON.parse(jsonString);
                setDiagnosis(parsedJson);
            } else {
                setError("Sorry, I could not generate a response. Please try again.");
            }
        } catch (e) {
            console.error("Error fetching diagnosis:", e);
            setError("Sorry, something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonDisabled = isLoading || symptoms.trim() === "";

    return (
        <main className="bg-white text-primary flex items-center justify-center min-h-screen p-4 font-poppins">
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl max-w-2xl w-full bg-neutral shadow-2xl animate-fade-in">
                
                <div className="mb-4 w-12 h-12 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 0L0 25V75L50 100L100 75V25L50 0ZM50 10L86 30V70L50 90L14 70V30L50 10Z" fill="#00ADB5"/>
                        <path d="M50 30L50 70M30 50H70" stroke="#00ADB5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                
                <h1 className="text-4xl font-bold mb-2 text-accent">Aegis</h1>
                <p className="text-lg text-primary mb-6">Your personal health assistant is ready to help.</p>

                <div className="mb-8 w-3/4 h-24 flex items-center justify-center perspective-1000">
                    <svg className="dna-helix w-full h-full" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{stopColor: '#00ADB5', stopOpacity: 1}} />
                                <stop offset="50%" style={{stopColor: '#393E46', stopOpacity: 1}} />
                                <stop offset="100%" style={{stopColor: '#222831', stopOpacity: 1}} />
                            </linearGradient>
                        </defs>
                        <path id="left-strand" d="M 40 10 C 20 30, 20 70, 40 90" stroke="url(#dnaGradient)" strokeWidth="6" fill="none" />
                        <path id="right-strand" d="M 110 10 C 130 30, 130 70, 110 90" stroke="url(#dnaGradient)" strokeWidth="6" fill="none" />
                        <line x1="40" y1="20" x2="110" y2="20" stroke="#00ADB5" strokeWidth="4" strokeLinecap="round" />
                        <line x1="40" y1="40" x2="110" y2="40" stroke="#00ADB5" strokeWidth="4" strokeLinecap="round" />
                        <line x1="40" y1="60" x2="110" y2="60" stroke="#00ADB5" strokeWidth="4" strokeLinecap="round" />
                        <line x1="40" y1="80" x2="110" y2="80" stroke="#00ADB5" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>

                <div className="w-full mb-6">
                    <textarea 
                        id="symptoms-input" 
                        className="w-full p-4 rounded-lg bg-white border border-gray-300 text-primary placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-accent" 
                        rows="5" 
                        placeholder="Enter your symptoms here... (e.g., 'I have a headache and a sore throat.')"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    ></textarea>
                </div>

                <button 
                    onClick={handleDiagnoseClick}
                    disabled={isButtonDisabled}
                    className={`fancy-button flex items-center justify-center w-full px-8 py-3 text-neutral font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-neutral disabled:bg-opacity-50 ${isButtonDisabled ? "disabled:animate-pulse" : ""}`}
                >
                    <span id="button-text" className="flex items-center gap-2">
                        {isLoading ? "Analyzing..." : "Get Diagnosis ✨"}
                    </span>
                </button>

                {isLoading && (
                    <div className="mt-8 text-lg font-semibold text-accent animate-pulse-thinking">
                        Aegis is thinking...
                    </div>
                )}

                {diagnosis && (
                    <div className="mt-8 w-full p-6 rounded-lg bg-secondary border border-accent text-left animate-fade-and-scale">
                        <h3 className="text-xl font-bold text-accent mb-2">Possible Conditions</h3>
                        <ul className="list-disc list-inside mb-4 text-neutral">
                            {diagnosis.conditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                            ))}
                        </ul>
                        <h3 className="text-xl font-bold text-accent mb-2">General Advice</h3>
                        <p className="text-neutral mb-4">{diagnosis.advice}</p>
                        <p className="text-sm text-yellow-400 font-semibold italic">
                            Disclaimer: This is for informational purposes only and is not a substitute for professional medical advice.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-8 w-full p-4 rounded-lg bg-red-800 border border-red-600 text-red-200 animate-fade-and-scale">
                        {error}
                    </div>
                )}
            </div>

            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

                .font-poppins {
                    font-family: 'Poppins', sans-serif;
                }

                .bg-primary { background-color: #222831; }
                .bg-secondary { background-color: #393E46; }
                .text-primary { color: #222831; }
                .text-accent { color: #00ADB5; }
                .text-neutral { color: #EEEEEE; }
                .bg-neutral { background-color: #EEEEEE; }
                .border-accent { border-color: #00ADB5; }
                .focus\\:ring-accent:focus { --tw-ring-color: #00ADB5; }

                @keyframes dna-glow {
                    0%, 100% {
                        stroke: #00ADB5;
                        stroke-width: 6;
                        filter: drop-shadow(0 0 2px #00ADB5);
                    }
                    50% {
                        stroke: #00FFF5;
                        stroke-width: 7;
                        filter: drop-shadow(0 0 6px #00FFF5);
                    }
                }

                @keyframes dna-wave {
                    0% {
                        transform: rotateY(0deg) translateY(0px);
                    }
                    50% {
                        transform: rotateY(180deg) translateY(-5px);
                    }
                    100% {
                        transform: rotateY(360deg) translateY(0px);
                    }
                }

                .dna-helix {
                    animation: dna-wave 6s ease-in-out infinite, dna-glow 2s ease-in-out infinite alternate;
                    transform-style: preserve-3d;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                
                @keyframes pulse-thinking {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }

                .animate-pulse-thinking {
                    animation: pulse-thinking 1.5s ease-in-out infinite;
                }

                @keyframes fade-and-scale {
                    0% {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-and-scale {
                    animation: fade-and-scale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                
                .fancy-button {
                    background: linear-gradient(90deg, #00ADB5 0%, #00969e 100%);
                    box-shadow: 0 4px 15px 0 rgba(0, 173, 181, 0.4);
                    border: none;
                    color: #EEEEEE;
                }

                .fancy-button:hover:not(:disabled) {
                    background: linear-gradient(90deg, #00FFF5 0%, #00ADB5 100%);
                    box-shadow: 0 6px 20px 0 rgba(0, 255, 245, 0.6);
                    transform: scale(1.05);
                }

                .fancy-button:active:not(:disabled) {
                    transform: scale(1);
                    box-shadow: 0 2px 5px 0 rgba(0, 173, 181, 0.4);
                }

                .fancy-button:disabled {
                    background: #393E46;
                    box-shadow: none;
                    color: #AAAAAA;
                }

                .fancy-button:disabled svg {
                    stroke: #AAAAAA;
                }
                `}
            </style>
        </main>
    );
}
