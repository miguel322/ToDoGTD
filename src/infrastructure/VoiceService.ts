"use client";

import { useEffect, useCallback, useRef } from 'react';
import { useTaskStore } from '../application/useStore';

export const useVoiceRecognition = () => {
    const { setVoiceActive, setTranscription, addTask, activeCategory } = useTaskStore();
    const recognitionRef = useRef<any>(null);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Tu navegador no soporta el reconocimiento de voz.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        recognition.onstart = () => {
            setVoiceActive(true);
            setTranscription("");
        };

        recognition.onresult = (event: any) => {
            let interimTranscription = '';
            let finalTranscription = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscription += event.results[i][0].transcript;
                } else {
                    interimTranscription += event.results[i][0].transcript;
                }
            }

            const text = finalTranscription || interimTranscription;
            setTranscription(text);

            if (finalTranscription) {
                processCommand(finalTranscription);
                // Keep overlay visible for 1.5s so user can read the final text
                setTimeout(() => setVoiceActive(false), 1500);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Voice Error:", event.error);
            if (event.error !== 'no-speech') {
                setVoiceActive(false);
            }
        };

        const processCommand = (transcript: string) => {
            const lower = transcript.toLowerCase();
            console.log("Processing command:", lower);

            // Palabras clave de acción
            const actionKeywords = ["añade", "crea", "pon", "recordatorio", "tarea", "nueva"];

            const shouldAddTask = actionKeywords.some(keyword => lower.includes(keyword));

            if (shouldAddTask) {
                // Limpiar el texto: quitamos las keywords y palabras de relleno
                let taskTitle = lower;

                actionKeywords.forEach(keyword => {
                    taskTitle = taskTitle.replace(keyword, "");
                });

                // Limpieza extra de conectores comunes
                taskTitle = taskTitle
                    .replace(/la tarea|una tarea|un recordatorio|el recordatorio/gi, "")
                    .replace(/para hoy|mañana|hoy/gi, "")
                    .trim();

                if (taskTitle) {
                    // Capitalizar primera letra
                    const finalTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);

                    console.log("Voice Engine: Creating task ->", finalTitle);

                    addTask({
                        title: finalTitle,
                        status: 'pending',
                        category: activeCategory === 'inbox' || activeCategory === 'today' ? activeCategory : 'today',
                    });
                }
            }
        };

        try {
            recognition.start();
        } catch (e) {
            setVoiceActive(false);
        }
    }, [setVoiceActive, setTranscription, addTask, activeCategory]);

    return { startListening };
};
