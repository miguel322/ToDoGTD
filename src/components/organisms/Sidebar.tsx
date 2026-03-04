"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Inbox,
    CalendarRange,
    LayoutGrid,
    Archive,
    Star,
    Settings,
    Circle,
    BarChart3,
    Command,
    Plus,
    User as UserIcon
} from 'lucide-react';
import { useTaskStore } from '@/application/useStore';

const Sidebar = () => {
    const { projects, addProject } = useTaskStore();
    const pathname = usePathname();
    const [isAddingProject, setIsAddingProject] = React.useState(false);
    const [newProjectTitle, setNewProjectTitle] = React.useState('');

    const handleAddProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProjectTitle.trim()) {
            addProject({
                title: newProjectTitle,
                color: ['#256af4', '#a855f7', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]
            });
            setNewProjectTitle('');
            setIsAddingProject(false);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Star size={20} />, href: '/' },
        { id: 'insights', label: 'Insights', icon: <BarChart3 size={20} />, href: '/insights' },
        { id: 'inbox', label: 'Inbox', icon: <Inbox size={20} />, href: '/inbox' },
        { id: 'upcoming', label: 'Upcoming', icon: <CalendarRange size={20} />, href: '/upcoming' },
    ];

    return (
        <aside className="w-80 h-screen sidebar-glass flex flex-col p-10 sticky top-0 z-40">
            <div className="flex items-center gap-4 mb-20">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center shadow-[0_0_20px_rgba(37,106,244,0.3)] group-hover:scale-110 transition-transform">
                        <Command className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter">
                        ToDoGTD
                    </h1>
                </Link>
            </div>

            <nav className="flex-1 space-y-12">
                <section>
                    <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Navigation</p>
                    <div className="space-y-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`group w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 ${pathname === item.href
                                    ? 'bg-white/10 text-white shadow-2xl translate-x-1 outline-1 outline-white/5'
                                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className={`transition-all duration-300 group-hover:scale-110 ${pathname === item.href ? 'text-accent-blue' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="text-[15px] font-bold">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section>
                    <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Projects</p>
                    <div className="space-y-4 px-2">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/project/${project.id}`}
                                className={`w-full flex items-center group gap-5 px-4 py-1.5 transition-all transform hover:translate-x-1 ${pathname === `/project/${project.id}`
                                    ? 'text-white'
                                    : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-150"
                                    style={{ backgroundColor: project.color, boxShadow: `0 0 15px ${project.color}` }}
                                />
                                <span className="text-[14px] font-bold">{project.title}</span>
                            </Link>
                        ))}

                        {isAddingProject ? (
                            <form onSubmit={handleAddProject} className="mt-4 px-4">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Project Title..."
                                    value={newProjectTitle}
                                    onChange={(e) => setNewProjectTitle(e.target.value)}
                                    onBlur={() => !newProjectTitle && setIsAddingProject(false)}
                                    className="w-full bg-white/5 border border-accent-blue/30 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-accent-blue transition-all text-white font-bold"
                                />
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsAddingProject(true)}
                                className="w-full flex items-center group gap-5 px-4 py-2 mt-4 text-slate-500 hover:text-accent-blue transition-all border border-dashed border-white/10 rounded-xl hover:border-accent-blue/50 hover:bg-accent-blue/5"
                            >
                                <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-accent-blue/10 transition-colors">
                                    <Plus size={14} />
                                </div>
                                <span className="text-[13px] font-bold">New Project</span>
                            </button>
                        )}
                    </div>
                </section>
            </nav>

            <div className="mt-auto pt-10 border-t border-white/5 space-y-2">
                <Link
                    href="/profile"
                    className={`group w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 ${pathname === '/profile'
                        ? 'bg-white/10 text-white shadow-2xl outline-1 outline-white/5'
                        : 'text-slate-500 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <UserIcon size={20} className={pathname === '/profile' ? 'text-accent-blue' : ''} />
                    <span className="text-[15px] font-bold">Profile</span>
                </Link>
                <button className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                    <Settings size={20} />
                    <span className="text-[15px] font-bold">Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
