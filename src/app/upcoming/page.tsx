"use client";

import React, { useEffect, useState, useMemo } from 'react';
import TaskList from '@/components/organisms/TaskList';
import { CalendarRange, CalendarDays, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTaskStore } from '@/application/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function UpcomingPage() {
    const { setActiveCategory, tasks } = useTaskStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekOffset, setWeekOffset] = useState(0);

    // Calculate the dates for the visible 7-day strip based on weekOffset
    const visibleDates = useMemo(() => {
        const start = new Date();
        start.setDate(start.getDate() + (weekOffset * 7) - 2); // Show window starting from (today + offset - 2 days)
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return date;
        });
    }, [weekOffset]);

    useEffect(() => {
        setActiveCategory('upcoming');
    }, [setActiveCategory]);

    const formattedMonth = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Count REAL tasks for each visible date
    const getTaskCountForDate = (date: Date) => {
        return tasks.filter(t => {
            if (!t.dueDate) return false;
            return new Date(t.dueDate).toDateString() === date.toDateString();
        }).length;
    };

    // Availability Calculation based on REAL tasks
    // Assuming a cap of 8 tasks per day for 100% load
    const dayTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === selectedDate.toDateString());
    const completedDayTasks = dayTasks.filter(t => t.status === 'completed').length;

    const workHoursVal = Math.min(100, Math.round((dayTasks.length / 8) * 100));
    const completionRate = dayTasks.length > 0 ? Math.round((completedDayTasks / dayTasks.length) * 100) : 0;
    const bufferVal = Math.max(0, 100 - workHoursVal);

    return (
        <div className="min-h-screen p-12 max-w-7xl mx-auto pb-40">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-accent-purple/20 rounded-2xl">
                        <CalendarRange className="text-accent-purple" size={24} />
                    </div>
                    <span className="text-sm font-black text-accent-purple uppercase tracking-[0.3em]">Timeline Explorer</span>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="space-y-6">
                        <h1 className="text-7xl font-black tracking-tighter leading-[0.9]">
                            Future <br />
                            <span className="text-accent-purple text-glow-purple">Upcoming</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed">
                            Organize your future missions. You're viewing <span className="text-white font-bold">{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 premium-glass p-2 rounded-2xl">
                        <button
                            onClick={() => setWeekOffset(prev => prev - 1)}
                            className="p-2 hover:bg-white/5 rounded-xl transition-all"
                        >
                            <ChevronLeft size={20} className="text-slate-400" />
                        </button>
                        <span className="px-4 font-black text-sm uppercase tracking-widest min-w-[180px] text-center">{formattedMonth}</span>
                        <button
                            onClick={() => setWeekOffset(prev => prev + 1)}
                            className="p-2 hover:bg-white/5 rounded-xl transition-all"
                        >
                            <ChevronRight size={20} className="text-slate-400" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                <div className="xl:col-span-3 space-y-12">
                    {/* Functional Horizontal Calendar Strip */}
                    <div className="grid grid-cols-7 gap-4">
                        {visibleDates.map((date, i) => {
                            const isSelected = selectedDate.toDateString() === date.toDateString();
                            const taskCount = getTaskCountForDate(date);

                            return (
                                <div key={i} className="text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-4 transition-colors ${isSelected ? 'text-accent-purple' : 'text-slate-600'}`}>
                                        {weekDays[date.getDay()]}
                                    </p>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedDate(date)}
                                        className={`aspect-square rounded-[24px] flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer relative overflow-hidden ${isSelected
                                            ? 'bg-linear-to-br from-accent-purple to-accent-blue shadow-[0_15px_30px_rgba(168,85,247,0.4)]'
                                            : 'premium-glass hover:bg-white/5'
                                            }`}
                                    >
                                        <span className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                            {date.getDate()}
                                        </span>

                                        {/* Dynamic Dots based on REAL tasks */}
                                        <div className="flex gap-1">
                                            {Array.from({ length: Math.min(3, taskCount) }).map((_, dotIdx) => (
                                                <div key={dotIdx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-accent-purple/40'}`}></div>
                                            ))}
                                            {taskCount > 3 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/50' : 'bg-accent-purple/20'}`}></div>}
                                        </div>

                                        {/* Today indicator */}
                                        {date.toDateString() === new Date().toDateString() && !isSelected && (
                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-blue rounded-full"></div>
                                        )}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedDate.toDateString()}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TaskList date={selectedDate} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <aside className="space-y-8">
                    <div className="premium-glass p-8 rounded-[32px] overflow-hidden relative group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-purple/10 blur-3xl rounded-full"></div>
                        <div className="flex items-center gap-3 text-white mb-8">
                            <CalendarDays size={20} className="text-accent-purple" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Load Analysis</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Daily Load', val: workHoursVal, color: 'bg-accent-blue' },
                                { label: 'Completion', val: completionRate, color: 'bg-accent-purple' },
                                { label: 'Free Capacity', val: bufferVal, color: 'bg-emerald-500' },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-2">
                                        <span className="text-slate-500 font-bold">{item.label}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.val}%` }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="premium-glass p-8 rounded-[32px] border-emerald-500/20 bg-emerald-500/2 cursor-pointer"
                    >
                        <div className="flex items-center gap-3 text-emerald-500 mb-6">
                            <Clock size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest">Time Buffer</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                            You have <span className="text-emerald-500 font-bold">{Math.round((bufferVal / 100) * 8)} hours</span> of free capacity on this date.
                        </p>
                        <button className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                            Review Schedule
                        </button>
                    </motion.div>
                </aside>
            </div>
        </div>
    );
}
