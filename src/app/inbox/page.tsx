"use client";

import React, { useEffect } from 'react';
import TaskList from '@/components/organisms/TaskList';
import { Inbox, Mail, Sparkles, Filter, ListFilter } from 'lucide-react';
import { useTaskStore } from '@/application/useStore';
import { motion } from 'framer-motion';

export default function InboxPage() {
    const { setActiveCategory, tasks } = useTaskStore();

    // Asegurar que la categoría activa sea 'inbox' al cargar
    useEffect(() => {
        setActiveCategory('inbox');
    }, [setActiveCategory]);

    // Calculate REAL processing stats
    const inboxTasks = tasks.filter(t => t.category === 'inbox');
    const processedTasks = inboxTasks.filter(t => t.projectId || t.dueDate).length;
    const processRate = inboxTasks.length > 0 ? Math.round((processedTasks / inboxTasks.length) * 100) : 100;

    return (
        <div className="min-h-screen p-12 max-w-7xl mx-auto pb-40">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-accent-blue/20 rounded-2xl">
                        <Inbox className="text-accent-blue" size={24} />
                    </div>
                    <span className="text-sm font-black text-accent-blue uppercase tracking-[0.3em]">Quick Capture</span>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="space-y-6">
                        <h1 className="text-7xl font-black tracking-tighter leading-[0.9]">
                            Your <br />
                            <span className="text-accent-blue text-glow">Inbox</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed">
                            The entry port for all your ideas. Capture everything that crosses your mind and process it later. <span className="text-white font-bold">{inboxTasks.length} missions</span> pending sorting.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="premium-glass px-6 py-4 rounded-2xl flex items-center gap-3 border border-white/5">
                            <span className="text-sm font-bold text-slate-400">Status:</span>
                            <span className="text-sm font-black text-accent-blue uppercase tracking-widest">
                                {processRate === 100 ? 'Clear' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="relative">
                {/* Decoración ambiental para el Inbox */}
                <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-accent-blue/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <TaskList category="inbox" />
                    </div>

                    <aside className="space-y-8">
                        <div className="premium-glass p-8 rounded-[32px] space-y-6">
                            <div className="flex items-center gap-3 text-amber-500">
                                <Sparkles size={20} />
                                <h3 className="text-sm font-black uppercase tracking-widest">Efficiency Tip</h3>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                Missions in the Inbox are waiting to be processed. Assign them to a project or date to integrate them into your workflow.
                            </p>
                            <div className="pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                                    <span>Processed Ratio</span>
                                    <span>{processRate}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${processRate}%` }}
                                        className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="premium-glass p-8 rounded-[32px] bg-linear-to-br from-accent-blue/10 to-transparent border-accent-blue/20">
                            <div className="flex items-center gap-3 text-white mb-6">
                                <Mail size={20} />
                                <h3 className="text-sm font-black uppercase tracking-widest">Mail Integration</h3>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                                Your unique capture address allows you to convert emails into missions automatically.
                            </p>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                Copy Identity URI
                            </button>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}
