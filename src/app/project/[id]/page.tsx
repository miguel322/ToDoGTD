"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useTaskStore } from '@/application/useStore';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import { ArrowLeft, Edit2, Plus, Target } from 'lucide-react';
import Link from 'next/link';

const ProjectPage = () => {
    const { id } = useParams();
    const { projects } = useTaskStore();
    const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

    const project = projects.find(p => p.id === id);

    if (!project) {
        return (
            <div className="min-h-screen p-12 flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-black mb-6">Project not found</h1>
                <Link href="/" className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-12 max-w-7xl mx-auto pb-40">
            {/* Project Header */}
            <header className="mb-24">
                <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-bold text-sm uppercase tracking-widest">
                    <ArrowLeft size={16} />
                    Back
                </Link>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full shadow-lg"
                                style={{ backgroundColor: project.color, boxShadow: `0 0 20px ${project.color}` }}
                            ></div>
                            <span className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Project Mission</span>
                        </div>

                        <h1 className="text-7xl font-black tracking-tighter leading-[0.9]">
                            {project.title}
                        </h1>

                        <div className="flex items-center gap-6 pt-4">
                            <button className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-slate-300">
                                <Edit2 size={14} />
                                Edit Project
                            </button>
                            <button
                                onClick={() => setIsTaskModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2 btn-gradient rounded-xl hover:scale-105 transition-all text-sm font-bold text-white shadow-lg"
                            >
                                <Plus size={14} />
                                New Task
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="premium-glass p-10 rounded-[40px] flex flex-col items-center min-w-[200px] group transition-all duration-500 border border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none"></div>
                            <Target className="text-slate-500 mb-4" size={24} style={{ color: project.color }} />
                            <span className="text-6xl font-black text-white group-hover:scale-110 transition-transform duration-500" style={{ color: project.color }}>
                                {project.progress}%
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mt-4 italic">Completion</span>

                            {/* Progress bar background */}
                            <div className="w-full h-1 bg-white/5 mt-6 rounded-full overflow-hidden">
                                <div
                                    className="h-full transition-all duration-1000"
                                    style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="space-y-20">
                <TaskList projectId={project.id} showProjectLabel={false} />
            </section>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                initialData={{ projectId: project.id }}
            />
        </div>
    );
};

export default ProjectPage;
