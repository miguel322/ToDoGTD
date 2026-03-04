"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Zap, Info, AlertCircle } from 'lucide-react';
import { useTaskStore } from '@/application/useStore';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const { notifications, markNotificationAsRead, deleteNotification, clearNotifications } = useTaskStore();
    const unreadCount = notifications.filter(n => !n.read).length;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <Zap size={16} className="text-emerald-500" />;
            case 'warning': return <AlertCircle size={16} className="text-amber-500" />;
            default: return <Info size={16} className="text-accent-blue" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'border-emerald-500/20 bg-emerald-500/5';
            case 'warning': return 'border-amber-500/20 bg-amber-500/5';
            default: return 'border-accent-blue/20 bg-accent-blue/5';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full max-w-md z-100 bg-[#0A0D14] border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-accent-blue/10 rounded-2xl relative">
                                    <Bell size={20} className="text-accent-blue" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#0A0D14] rounded-full text-[8px] flex items-center justify-center font-black">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight">Intelligence Center</h2>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                                        {notifications.length} System Updates
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {notifications.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <Bell size={48} className="mb-4 text-slate-700" />
                                    <p className="text-sm font-bold">Silence is golden.</p>
                                    <p className="text-xs uppercase tracking-widest mt-2">No updates at this time</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <motion.div
                                        key={n.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`group premium-glass p-5 rounded-3xl border ${getTypeColor(n.type)} ${n.read ? 'opacity-60' : ''} transition-all relative overflow-hidden`}
                                    >
                                        {!n.read && (
                                            <div className="absolute top-0 right-0 w-2 h-2 bg-accent-blue m-3 rounded-full blur-xs animate-pulse"></div>
                                        )}

                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5`}>
                                                {getTypeIcon(n.type)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-black tracking-tight mb-1">{n.title}</h3>
                                                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-3">{n.message}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                                                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        {!n.read && (
                                                            <button
                                                                onClick={() => markNotificationAsRead(n.id)}
                                                                className="p-1 px-3 bg-white/5 hover:bg-accent-blue/20 hover:text-accent-blue rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                            >
                                                                Read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNotification(n.id)}
                                                            className="p-1 px-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-8 border-t border-white/5">
                                <button
                                    onClick={clearNotifications}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2 text-slate-400 hover:text-white"
                                >
                                    Clear Intelligence Feed
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationCenter;
