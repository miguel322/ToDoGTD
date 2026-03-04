"use client";

import React, { useEffect } from 'react';
import { useTaskStore } from '@/application/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Command, MessageSquare } from 'lucide-react';

const VoiceOverlay = () => {
    const { isVoiceActive, transcription, setVoiceActive, setTranscription, addTask, activeCategory } = useTaskStore();

    useEffect(() => {
        if (!isVoiceActive) return;

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
            setTranscription("API de voz no soportada en este navegador.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;

        let finalTimeout: NodeJS.Timeout;

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const currentText = finalTranscript || interimTranscript;
            setTranscription(currentText);

            if (event.results[event.results.length - 1].isFinal) {
                clearTimeout(finalTimeout);
                finalTimeout = setTimeout(() => {
                    const textToSave = currentText.trim();
                    if (textToSave) {
                        const today = new Date().toISOString().split('T')[0];
                        addTask({
                            title: textToSave,
                            status: 'pending',
                            category: 'inbox',
                            dueDate: today // Set as today's mission by default
                        });
                    }
                    setTranscription('');
                    setVoiceActive(false);
                }, 800);
            }
        };

        recognition.start();

        return () => {
            recognition.stop();
            clearTimeout(finalTimeout);
        };
    }, [isVoiceActive, setTranscription, addTask, setVoiceActive]);

    return (
        <AnimatePresence>
            {isVoiceActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 flex items-center justify-center bg-bg-deep/80 backdrop-blur-2xl"
                >
                    {/* Decorative backgrounds inside overlay */}
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-blue/10 blur-[150px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-purple/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="absolute top-12 right-12">
                        <button
                            onClick={() => setVoiceActive(false)}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group"
                        >
                            <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="text-center max-w-4xl w-full px-12 relative z-10">
                        <div className="relative mb-20 flex justify-center">
                            {/* Central Pulsating Orb */}
                            <div className="w-48 h-48 rounded-[64px] bg-accent-blue/10 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-[64px] border-2 border-accent-blue/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                                <div className="absolute inset-0 rounded-[64px] border-2 border-accent-purple/20 animate-ping" style={{ animationDuration: '4.5s' }}></div>

                                <div className="w-32 h-32 rounded-[48px] btn-gradient flex items-center justify-center relative z-10 shadow-[0_0_60px_rgba(37,106,244,0.4)]">
                                    <Mic size={56} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                                <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Escuchando...</span>
                            </div>

                            <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter min-h-[160px] max-w-3xl mx-auto">
                                {transcription ? (
                                    <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-white to-white/40">
                                        {transcription}
                                    </span>
                                ) : (
                                    <span className="text-slate-700">Dime qué necesitas recordar...</span>
                                )}
                            </h2>
                        </div>

                        <div className="mt-20 flex justify-center gap-8">
                            <div className="premium-glass px-8 py-4 flex items-center gap-4 text-accent-blue group hover:scale-110 transition-transform cursor-pointer">
                                <Command size={18} />
                                <span className="text-sm font-black uppercase tracking-widest">Añadir Tarea</span>
                            </div>
                            <div className="premium-glass px-8 py-4 flex items-center gap-4 text-accent-purple group hover:scale-110 transition-transform cursor-pointer">
                                <MessageSquare size={18} />
                                <span className="text-sm font-black uppercase tracking-widest">Nueva Nota</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoiceOverlay;
