"use client";

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Target, Zap, Clock } from 'lucide-react';
import { useTaskStore } from '@/application/useStore';
import { Project, Task } from '@/domain/types';

const InsightsPage = () => {
    const { projects, tasks, user } = useTaskStore();

    // Category Breakdown Calculation (Focus Distribution)
    const unassignedTasks = tasks.filter(t => !t.projectId).length;

    const projectsDistribution = projects.map((p: Project) => {
        const projectTasks = tasks.filter((t: Task) => t.projectId === p.id);
        return {
            name: p.title,
            value: projectTasks.length,
            color: p.color,
            progress: p.progress // We'll use this for the bars
        };
    }).filter((d: any) => d.value > 0);

    // Add "Inbox/Other" if there are unassigned tasks
    if (unassignedTasks > 0) {
        projectsDistribution.push({
            name: 'Inbox / Other',
            value: unassignedTasks,
            color: '#475569', // Slate-600
            progress: 0
        } as any);
    }

    // Productivity Calculation
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Performance label based on score
    const getPerformanceLabel = (score: number) => {
        if (score >= 90) return { text: 'God Mode', color: 'text-emerald-500', icon: <Zap size={14} fill="currentColor" /> };
        if (score >= 70) return { text: 'Excellent', color: 'text-blue-500', icon: <Zap size={14} fill="currentColor" /> };
        if (score >= 50) return { text: 'Great', color: 'text-amber-500', icon: <Zap size={14} fill="currentColor" /> };
        return { text: 'In Progress', color: 'text-slate-500', icon: <Clock size={14} /> };
    };

    const performance = getPerformanceLabel(productivityScore);

    return (
        <div className="p-12 max-w-7xl mx-auto pb-32">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-accent-blue/20 rounded-lg">
                        <Sparkles className="text-accent-blue" size={24} />
                    </div>
                    <span className="text-sm font-bold text-accent-blue uppercase tracking-widest">Analytics Dashboard</span>
                </div>
                <h1 className="text-6xl font-black tracking-tight mb-6">Productivity <span className="text-accent-purple">Insights</span></h1>
                <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                    The "Visual Soul" of your journey. Tracking <span className="text-white font-bold">{user.xp} XP</span> and <span className="text-white font-bold">{completedTasks} completed missions</span>.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                {/* Productivity Score Gauge */}
                <div className="lg:col-span-1 glass-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-premium"></div>
                    <h3 className="text-slate-500 uppercase tracking-[0.2em] text-[11px] font-black mb-10">Productivity Score</h3>
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="112" cy="112" r="100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="16" />
                            <motion.circle
                                cx="112" cy="112" r="100" fill="none" stroke="url(#gradientScore)" strokeWidth="16"
                                strokeDasharray="628"
                                initial={{ strokeDashoffset: 628 }}
                                animate={{ strokeDashoffset: 628 * (1 - productivityScore / 100) }}
                                transition={{ duration: 2.5, ease: "circOut" }}
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_15px_rgba(37,106,244,0.5)]"
                            />
                            <defs>
                                <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#256af4" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-7xl font-black tracking-tighter">{productivityScore}</span>
                            <div className={`flex items-center gap-1 font-bold text-sm mt-1 ${performance.color}`}>
                                {performance.icon}
                                <span>{performance.text}</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-10 text-slate-400 font-medium">Capture <span className="text-white">{(totalTasks - completedTasks)} more</span> missions to peak!</p>
                </div>

                {/* Category Breakdown */}
                <div className="lg:col-span-2 glass-card p-10 relative overflow-hidden transition-all hover:border-white/20">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h3 className="text-slate-500 uppercase tracking-[0.2em] text-[11px] font-black mb-2">Focus Allocation</h3>
                            <p className="text-2xl font-bold">Project Breakdown</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end max-w-[300px]">
                            {projectsDistribution.length > 0 ? projectsDistribution.map((cat: any) => (
                                <div key={cat.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">{cat.name}</span>
                                </div>
                            )) : <span className="text-[10px] text-slate-500 font-black">Assign tasks to projects</span>}
                        </div>
                    </div>

                    <div className="h-64 w-full flex items-center">
                        <div className="w-1/2 h-full">
                            {projectsDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={projectsDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={10}
                                            dataKey="value"
                                            animationBegin={500}
                                            animationDuration={1500}
                                        >
                                            {projectsDistribution.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-full aspect-square m-auto">
                                    <span className="text-xs text-slate-600 font-bold uppercase tracking-widest text-center px-10">No project data yet</span>
                                </div>
                            )}
                        </div>
                        <div className="w-1/2 space-y-4 pl-10 max-h-64 overflow-y-auto custom-scrollbar">
                            {projectsDistribution.map((cat: any) => (
                                <div key={cat.name} className="group cursor-default">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors truncate pr-2">{cat.name}</span>
                                        <span className="text-lg font-black text-white">{cat.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.progress}%` }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: cat.color, boxShadow: `0 0 10px ${cat.color}44` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">
                                        {cat.value} {cat.value === 1 ? 'Mission' : 'Missions'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Evolution Journey */}
            <div className="glass-card p-12 w-full relative overflow-hidden min-h-[400px]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <Trophy className="text-amber-500" size={20} />
                        <h3 className="text-slate-500 uppercase tracking-[0.2em] text-[11px] font-black">Evolution Journey</h3>
                    </div>

                    <div className="mb-16">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-4xl font-black tracking-tight">Mission Progress</p>
                                <p className="text-slate-400 font-medium mt-1">Completion rate according to your active projects</p>
                            </div>
                            <div className="text-right">
                                <span className="text-5xl font-black text-white">{productivityScore}%</span>
                            </div>
                        </div>

                        {/* THE BAR: Reflects global completed/total ratio as requested */}
                        <div className="relative h-6 w-full bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/5">
                            <motion.div
                                className="h-full bg-linear-to-r from-accent-blue via-accent-purple to-pink-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${productivityScore}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                            />
                        </div>
                    </div>

                    <div className="relative flex items-center justify-between px-10">
                        {[
                            { label: 'Rookie', threshold: 0, icon: <Target size={16} /> },
                            { label: 'Operational', threshold: 25, icon: <Sparkles size={16} /> },
                            { label: 'Strategist', threshold: 75, icon: <Zap size={16} /> },
                            { label: 'Grandmaster', threshold: 100, icon: <Trophy size={16} /> },
                        ].map((m, idx) => {
                            const active = productivityScore >= m.threshold;
                            return (
                                <div key={idx} className="relative z-10 flex flex-col items-center">
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${active
                                            ? 'bg-bg-deep border-accent-blue text-white shadow-[0_0_25px_rgba(37,106,244,0.4)]'
                                            : 'bg-white/5 border-white/10 text-slate-700'
                                            }`}
                                    >
                                        {m.icon}
                                    </motion.div>
                                    <div className="absolute top-14 text-center w-32">
                                        <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${active ? 'text-white' : 'text-slate-700'}`}>
                                            {m.label}
                                        </span>
                                        <span className={`text-[9px] font-bold ${active ? 'text-accent-blue' : 'text-slate-800'}`}>{m.threshold}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;
