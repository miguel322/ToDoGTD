"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Tag, Calendar, Layout, Type } from 'lucide-react';
import { useTaskStore } from '@/application/useStore';
import { Task, TaskCategory } from '@/domain/types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId?: string | null;
    initialData?: Partial<Task>;
}

const TaskModal = ({ isOpen, onClose, taskId, initialData }: TaskModalProps) => {
    const { tasks, projects, addTask, updateTask, deleteTask } = useTaskStore();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<TaskCategory>('today');
    const [projectId, setProjectId] = useState<string | undefined>('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                setTitle(task.title);
                setCategory(task.category);
                setProjectId(task.projectId || '');
                setDueDate(task.dueDate || '');
            }
        } else if (initialData) {
            setTitle(initialData.title || '');
            setCategory(initialData.category || 'inbox');
            setProjectId(initialData.projectId || '');
            setDueDate(initialData.dueDate || '');
        } else {
            setTitle('');
            setCategory('today');
            setProjectId('');
            setDueDate('');
        }
    }, [taskId, initialData, tasks, isOpen]);

    const handleSave = () => {
        if (!title.trim()) return;

        const data = {
            title,
            category,
            ...(projectId ? { projectId } : {}),
            dueDate: dueDate || undefined,
            status: (taskId ? tasks.find(t => t.id === taskId)?.status : 'pending') || 'pending'
        };

        if (taskId) {
            updateTask(taskId, data);
        } else {
            addTask(data as any);
        }
        onClose();
    };

    const handleDelete = () => {
        if (taskId) {
            deleteTask(taskId);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-bg-deep/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg premium-glass rounded-[32px] overflow-hidden border border-white/10 shadow-2xl"
                >
                    <div className="p-8 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                {taskId ? 'Edit Mission' : 'New Mission'}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                                    <Type size={12} />
                                    What's the mission?
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Task title..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                                        <Layout size={12} />
                                        Context
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as TaskCategory)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accent-blue/50 appearance-none transition-all cursor-pointer"
                                    >
                                        <option value="inbox">Inbox</option>
                                        <option value="today">Today</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="anytime">Anytime</option>
                                        <option value="someday">Someday</option>
                                    </select>
                                </div>

                                {/* Project */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                                        <Tag size={12} />
                                        Project
                                    </label>
                                    <select
                                        value={projectId}
                                        onChange={(e) => setProjectId(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accent-blue/50 appearance-none transition-all cursor-pointer"
                                    >
                                        <option value="">No Project</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                                    <Calendar size={12} />
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            {taskId ? (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-all"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            ) : (
                                <div />
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-10 py-3 rounded-2xl btn-gradient text-white font-black shadow-lg shadow-accent-blue/20 hover:scale-105 transition-all"
                                >
                                    <Save size={18} />
                                    {taskId ? 'Update' : 'Launch'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TaskModal;
