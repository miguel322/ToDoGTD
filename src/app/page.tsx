"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductivityPulse from '@/components/molecules/ProductivityPulse';
import TaskList from '@/components/organisms/TaskList';
import NotificationCenter from '@/components/organisms/NotificationCenter';
import { Mic, Search, Bell } from 'lucide-react';
import { useVoiceRecognition } from '@/infrastructure/VoiceService';
import { useTaskStore } from '@/application/useStore';

export default function Home() {
  const { startListening } = useVoiceRecognition();
  const { setActiveCategory, user, notifications, tasks, checkDeadlines } = useTaskStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Real-time calculations
  const tasksToday = tasks.filter(t => t.category === 'today');
  const completedToday = tasksToday.filter(t => t.status === 'completed').length;
  const pendingToday = tasksToday.filter(t => t.status === 'pending').length;
  const totalToday = tasksToday.length;
  const progressToday = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const upcomingCount = tasks.filter(t => (t.category === 'upcoming' || (t.dueDate && new Date(t.dueDate) > new Date())) && t.status === 'pending').length;

  useEffect(() => {
    setActiveCategory('today');
    checkDeadlines();
  }, [setActiveCategory, checkDeadlines]);

  // Periodic deadline check every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      checkDeadlines();
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkDeadlines]);

  // Re-check when tasks change
  useEffect(() => {
    checkDeadlines();
  }, [tasks, checkDeadlines]);

  return (
    <div className="min-h-screen p-12 max-w-7xl mx-auto pb-40">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-20 text-white">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-blue transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search tasks or command..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-accent-blue/50 focus:bg-white/8 transition-all"
          />
        </div>

        <div className="flex items-center gap-8 pl-10">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <Bell size={20} className={`transition-colors ${unreadCount > 0 ? 'text-white' : 'text-slate-400'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-accent-blue rounded-full shadow-[0_0_8px_#256af4] animate-pulse"></span>
            )}
          </button>

          <div className="h-10 w-px bg-white/10"></div>

          <Link href="/profile" className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right">
              <p className="text-sm font-black tracking-tight">{user.displayName}</p>
              <p className="text-[10px] text-accent-blue font-black uppercase tracking-widest">{user.xp} XP • Premium</p>
            </div>
            <div className="w-12 h-12 rounded-2xl p-px bg-linear-to-br from-white/20 to-transparent">
              <div className="w-full h-full rounded-[15px] bg-bg-deep overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}&backgroundColor=transparent`} alt="avatar" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <header className="mb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-accent-blue font-bold text-sm bg-accent-blue/10 w-fit px-4 py-1 rounded-full border border-accent-blue/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
              </span>
              Activo ahora
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.9]">
              Focus on <br />
              <span className="text-accent-blue text-glow">Today</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed">
              Master your flow. You've completed {completedToday} tasks today. <br />
              {pendingToday > 0 ? (
                <>Only <span className="text-white font-bold">{pendingToday} critical items</span> remain on your radar.</>
              ) : (
                <>You're all caught up for today! <span className="text-accent-blue font-bold">Incredible job.</span></>
              )}
            </p>
          </div>

          <div className="flex gap-8">
            <div className="premium-glass p-8 rounded-[32px] flex flex-col items-center min-w-[160px] group hover:scale-105 transition-all duration-500 border border-white/5 shadow-2xl">
              <span className="text-5xl font-black text-accent-blue group-hover:scale-110 transition-transform">{progressToday}%</span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mt-4 italic">Daily Progress</span>
            </div>
            <div className="premium-glass p-8 rounded-[32px] flex flex-col items-center min-w-[160px] group hover:scale-105 transition-all duration-500 border border-white/5 shadow-2xl">
              <span className="text-5xl font-black text-accent-purple group-hover:scale-110 transition-transform">{upcomingCount}</span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mt-4 italic">Upcoming</span>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-20">
        <ProductivityPulse />
        <div>
          <TaskList />
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-12 right-12 z-50">
        <button
          onClick={startListening}
          className="w-24 h-24 rounded-[32px] btn-gradient flex items-center justify-center text-white transition-all duration-500 animate-float hover:scale-110 group relative"
        >
          <div className="absolute inset-0 rounded-[32px] bg-white/20 blur-2xl scale-0 group-hover:scale-100 transition-transform duration-700"></div>
          <Mic size={36} className="relative z-10" />
        </button>
      </div>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  );
}
