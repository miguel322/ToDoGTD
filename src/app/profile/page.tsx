"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Settings,
    Shield,
    Bell,
    Zap,
    Trophy,
    Target,
    LogOut,
    Camera,
    Star,
    Check,
    Edit2,
    RefreshCw
} from 'lucide-react';
import { useTaskStore } from '@/application/useStore';
import { auth } from '@/infrastructure/firebase/config';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    const router = useRouter();
    const { user, tasks, updateUser } = useTaskStore();
    const [isEditing, setIsEditing] = useState(false);

    // Temp state for editing
    const [tempName, setTempName] = useState(user.displayName);
    const [tempEmail, setTempEmail] = useState(user.email);
    const [avatarSeed, setAvatarSeed] = useState(user.avatarSeed);

    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;

    // Calculate level based on XP formula
    const currentLevel = Math.floor(user.xp / 1000) + 1;
    const xpInCurrentLevel = user.xp % 1000;
    const progressToNextLevel = (xpInCurrentLevel / 1000) * 100;
    const mockBadges = ['Early Adopter', 'Goal Setter'];

    const handleSave = () => {
        updateUser({
            displayName: tempName,
            email: tempEmail,
            avatarSeed: avatarSeed
        });
        setIsEditing(false);
    };

    const handleRefreshAvatar = () => {
        const newSeed = Math.random().toString(36).substring(7);
        setAvatarSeed(newSeed);
        if (!isEditing) {
            updateUser({ avatarSeed: newSeed });
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
    };

    const stats = [
        { label: 'Completed', value: completedTasksCount, icon: <Trophy className="text-amber-500" />, color: 'bg-amber-500/10' },
        { label: 'Focus Score', value: Math.min(100, 60 + completedTasksCount * 2), icon: <Target className="text-accent-blue" />, color: 'bg-accent-blue/10' },
        { label: 'Current Level', value: currentLevel, icon: <Zap className="text-accent-purple" />, color: 'bg-accent-purple/10' },
    ];

    return (
        <div className="min-h-screen p-12 max-w-7xl mx-auto pb-40">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-accent-blue/20 rounded-2xl">
                        <User className="text-accent-blue" size={24} />
                    </div>
                    <span className="text-sm font-black text-accent-blue uppercase tracking-[0.3em]">User Identity</span>
                </div>
                <h1 className="text-7xl font-black tracking-tighter leading-[0.9] mb-4">
                    Profile <br />
                    <span className="text-white opacity-40">Settings</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Avatar & Main Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="premium-glass p-10 rounded-[40px] text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-premium opacity-20"></div>

                        <div className="relative mt-8 mb-8 inline-block">
                            <div className="w-40 h-40 rounded-[48px] p-1 bg-gradient-premium shadow-[0_20px_40px_rgba(37,106,244,0.3)] group-hover:scale-105 transition-transform duration-500">
                                <div className="w-full h-full rounded-[44px] bg-bg-deep overflow-hidden relative">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=transparent`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={handleRefreshAvatar}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        <RefreshCw className="text-white" size={24} />
                                    </button>
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 p-3 bg-white text-bg-deep rounded-2xl shadow-xl hover:scale-110 transition-transform">
                                <Camera size={18} />
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-4"
                                >
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-bold focus:outline-none focus:border-accent-blue"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 py-3 bg-accent-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            <Check size={14} /> Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-3 bg-white/5 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <h2 className="text-3xl font-black tracking-tight">{tempName}</h2>
                                    <p className="text-accent-blue font-bold uppercase tracking-widest text-xs mt-2">Premium Member</p>

                                    <div className="flex justify-center gap-2 mt-6">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} size={14} className={i <= (currentLevel % 5 || 5) ? "fill-amber-500 text-amber-500" : "text-slate-700"} />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
                                    >
                                        <Edit2 size={12} /> Edit Profile
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="premium-glass p-8 rounded-[32px] space-y-4">
                        <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                            <div className="flex items-center gap-4">
                                <Shield size={20} className="text-emerald-500" />
                                <span className="text-sm font-bold">Privacy & Security</span>
                            </div>
                            <div className="w-10 h-5 bg-emerald-500/20 rounded-full relative">
                                <div className="absolute top-1 left-1 w-3 h-3 bg-emerald-500 rounded-full"></div>
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                            <div className="flex items-center gap-4">
                                <Bell size={20} className="text-amber-500" />
                                <span className="text-sm font-bold">Notifications</span>
                            </div>
                            <div className="w-10 h-5 bg-white/10 rounded-full relative">
                                <div className="absolute top-1 right-1 w-3 h-3 bg-slate-500 rounded-full"></div>
                            </div>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 bg-red-500/5 rounded-2xl hover:bg-red-500/10 transition-all group text-red-500"
                        >
                            <div className="flex items-center gap-4">
                                <LogOut size={20} />
                                <span className="text-sm font-bold">Logout</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Column: Stats & Experience */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="premium-glass p-8 rounded-[32px] text-center group hover:translate-y-[-4px] transition-all"
                            >
                                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <p className="text-3xl font-black mb-1">{stat.value}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="premium-glass p-12 rounded-[40px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/5 blur-[120px] rounded-full"></div>

                        <h3 className="text-2xl font-black mb-10">Productivity Level</h3>

                        <div className="space-y-12">
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-accent-blue mb-1">Level {currentLevel}</p>
                                        <p className="text-lg font-bold">
                                            {currentLevel > 10 ? 'Senior Architect of Time' : 'Time Novice'}
                                        </p>
                                    </div>
                                    <p className="text-sm font-black text-slate-400">
                                        {xpInCurrentLevel} / 1000 XP
                                    </p>
                                </div>
                                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressToNextLevel}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-linear-to-r from-accent-blue via-accent-purple to-blue-400 rounded-full shadow-[0_0_20px_rgba(37,106,244,0.5)]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Achievements</h4>
                                    <div className="flex gap-4">
                                        {Array.from({ length: Math.min(4, Math.floor(completedTasksCount / 2)) }).map((_, i) => (
                                            <div key={i} className="w-12 h-12 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center cursor-help transition-all transform hover:scale-110 shadow-lg shadow-accent-blue/10 text-accent-blue">
                                                <Trophy size={20} />
                                            </div>
                                        ))}
                                        {Array.from({ length: Math.max(0, 4 - Math.floor(completedTasksCount / 2)) }).map((_, i) => (
                                            <div key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center grayscale opacity-30">
                                                <Star size={20} className="text-slate-700" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Badges</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {mockBadges.map((badge, i) => (
                                            <div key={i} className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                {badge}
                                            </div>
                                        ))}
                                        {completedTasksCount > 5 && (
                                            <div className="px-4 py-2 rounded-xl bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[10px] font-black uppercase tracking-widest animate-pulse">
                                                Task Crusher
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-glass p-10 rounded-[40px]">
                        <h3 className="text-2xl font-black mb-8 text-glow">Account Preference</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={tempEmail}
                                        onChange={(e) => setTempEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-accent-blue"
                                    />
                                ) : (
                                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-slate-400">
                                        {tempEmail}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Language</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-accent-blue appearance-none">
                                    <option>Spanish (ES)</option>
                                    <option>English (US)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
