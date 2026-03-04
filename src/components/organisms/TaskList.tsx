"use client";

import React from 'react';
import { CheckCircle2, Circle, Clock, Tag, MoreVertical } from 'lucide-react';
import { useTaskStore } from '@/application/useStore';
import { motion, AnimatePresence } from 'framer-motion';

import { TaskCategory } from '@/domain/types';

interface TaskListProps {
    projectId?: string;
    category?: TaskCategory;
    date?: Date;
    showProjectLabel?: boolean;
}

import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskModal from './TaskModal';

const TaskList = ({ projectId, category, date, showProjectLabel = true }: TaskListProps) => {
    const { tasks, activeCategory, toggleTaskStatus } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const effectiveCategory = category || activeCategory;

    const filteredTasks = tasks.filter(t => {
        if (date) {
            if (!t.dueDate) return false;
            const taskDate = new Date(t.dueDate);
            return taskDate.toDateString() === date.toDateString();
        }
        if (projectId) return t.projectId === projectId;

        // Dashboard/Today Smart Filter
        if (effectiveCategory === 'today') {
            const isToday = t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString();
            return t.category === 'today' || isToday;
        }

        return t.category === effectiveCategory;
    });

    const listTitle = projectId ? "Project Tasks" : effectiveCategory;

    const openEditModal = (id: string) => {
        setSelectedTaskId(id);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setSelectedTaskId(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-4 max-w-4xl">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Tasks</p>
                    <h2 className="text-4xl font-black capitalize tracking-tight leading-none">{listTitle}</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-5 py-2 btn-gradient rounded-xl text-xs font-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                        <Plus size={14} />
                        New Mission
                    </button>
                    <div className="px-5 py-2 premium-glass rounded-2xl text-xs font-bold text-slate-400 border border-white/5">
                        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className={`premium-glass p-6 pr-8 flex items-center gap-6 group hover:translate-x-2 transition-all duration-500 cursor-pointer border border-white/5 ${task.status === 'completed' ? 'opacity-40' : ''
                            }`}
                        onClick={() => openEditModal(task.id)}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskStatus(task.id);
                            }}
                            className="relative flex items-center justify-center shrink-0"
                        >
                            {task.status === 'completed' ? (
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/20">
                                    <CheckCircle2 size={24} />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-slate-700 group-hover:border-accent-blue flex items-center justify-center transition-all duration-300">
                                    <div className="w-0 h-0 group-hover:w-3 group-hover:h-3 bg-accent-blue rounded-full transition-all duration-300"></div>
                                </div>
                            )}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-bold tracking-tight truncate transition-all duration-500 ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'
                                }`}>
                                {task.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2">
                                {task.projectId && showProjectLabel && !projectId && (
                                    <div className="flex items-center gap-1.5 text-xs text-accent-blue font-bold px-3 py-1 bg-accent-blue/5 rounded-lg border border-accent-blue/10">
                                        <Tag size={12} />
                                        <span className="uppercase tracking-widest">{task.projectId}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    <Clock size={12} />
                                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Due Today'}</span>
                                </div>
                            </div>
                        </div>

                        <button className="p-2 text-slate-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                            <MoreVertical size={20} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>

            {filteredTasks.length === 0 && (
                <div className="premium-glass py-24 text-center rounded-[32px] opacity-50 border border-white/5 border-dashed">
                    <p className="text-xl font-bold text-slate-500 italic">No missions found. Time to plan.</p>
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                taskId={selectedTaskId}
                initialData={
                    date ? { dueDate: date.toISOString().split('T')[0], category: 'upcoming' } :
                        projectId ? { projectId } :
                            { category: effectiveCategory }
                }
            />
        </div>
    );
};

export default TaskList;
