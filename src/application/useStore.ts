import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Project, TaskCategory, TaskStatus, Notification } from '../domain/types';
import { syncService } from '@/infrastructure/firebase/sync';

interface UserState {
    xp: number;
    uid: string | null;
    displayName: string;
    email: string;
    avatarSeed: string;
}

interface TaskState {
    tasks: Task[];
    projects: Project[];
    notifications: Notification[];
    activeCategory: TaskCategory;
    isVoiceActive: boolean;
    transcription: string;
    user: UserState;

    setUser: (uid: string | null) => Promise<void>;
    setTasks: (tasks: Task[]) => void;
    setProjects: (projects: Project[]) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
    updateTask: (id: string, data: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>) => void;
    deleteTask: (id: string) => void;
    toggleTaskStatus: (id: string) => void;
    setActiveCategory: (category: TaskCategory) => void;
    setVoiceActive: (active: boolean) => void;
    setTranscription: (text: string) => void;
    updateUser: (data: Partial<UserState>) => void;
    clearTasks: () => void;

    // Notification Actions
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'userId' | 'read'>) => void;
    markNotificationAsRead: (id: string) => void;
    deleteNotification: (id: string) => void;
    clearNotifications: () => void;

    // Project Actions
    addProject: (project: Omit<Project, 'id' | 'progress' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
    updateProject: (id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'userId'>>) => void;
    deleteProject: (id: string) => void;
    recalculateProjectProgress: (projectId: string) => void;
    checkDeadlines: () => void;
}

// Session tracking outside the store state to avoid persistence issues
const notifiedTasks = new Set<string>();

// Extremely safe UUID fallback
const generateSafeId = () => {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            tasks: [],
            projects: [],
            notifications: [],
            activeCategory: 'today',
            isVoiceActive: false,
            transcription: '',
            user: { xp: 0, uid: null, displayName: 'Miguel Angel', email: '', avatarSeed: 'Lucky' },

            setUser: async (uid: string | null) => {
                if (!uid) {
                    notifiedTasks.clear();
                    set((state) => ({
                        tasks: [],
                        projects: [],
                        notifications: [],
                        user: { ...state.user, uid: null, xp: 0 }
                    }));
                    return;
                }

                try {
                    const [remoteTasks, remoteProjects, remoteProfile, remoteNotifications] = await Promise.all([
                        syncService.fetchUserTasks(uid),
                        syncService.fetchUserProjects(uid),
                        syncService.fetchUserProfile(uid),
                        syncService.fetchUserNotifications(uid)
                    ]);

                    set((state) => {
                        const localTasks = state.tasks;

                        // Migrate anonymous tasks
                        localTasks.forEach(t => {
                            if (t.userId === 'anonymous') {
                                syncService.setTask({ ...t, userId: uid });
                            }
                        });

                        // Merge logic
                        const mergedTasks = [...remoteTasks];
                        localTasks.forEach(local => {
                            const isIdentical = mergedTasks.some(remote => remote.id === local.id);
                            if (!isIdentical) {
                                mergedTasks.push({ ...local, userId: uid });
                            }
                        });

                        return {
                            tasks: mergedTasks,
                            projects: remoteProjects || [],
                            notifications: remoteNotifications || [],
                            user: {
                                ...state.user,
                                uid,
                                xp: Math.max(state.user.xp, remoteProfile?.xp || 0),
                                displayName: remoteProfile?.displayName || state.user.displayName,
                                email: remoteProfile?.email || state.user.email,
                                avatarSeed: remoteProfile?.avatarSeed || state.user.avatarSeed
                            }
                        };
                    });
                } catch (error) {
                    console.error('Error syncing user:', error);
                }
            },

            setTasks: (tasks) => set({ tasks }),
            setProjects: (projects) => set({ projects }),

            addTask: (task) => {
                const now = new Date().toISOString();
                const id = generateSafeId();
                const userId = get().user.uid || 'anonymous';

                const newTask: Task = {
                    ...task,
                    id,
                    userId,
                    createdAt: now,
                    updatedAt: now
                };

                set((state) => {
                    const newTasks = [...state.tasks, newTask];
                    let newProjects = state.projects;

                    if (newTask.projectId) {
                        const projectTasks = newTasks.filter(t => t.projectId === newTask.projectId);
                        const progress = Math.round((projectTasks.filter(t => t.status === 'completed').length / (projectTasks.length || 1)) * 100);
                        newProjects = state.projects.map(p => p.id === newTask.projectId ? { ...p, progress } : p);

                        // Sync project progress if not anonymous
                        const up = newProjects.find(p => p.id === newTask.projectId);
                        if (up && up.userId !== 'anonymous') syncService.setProject(up);
                    }

                    return { tasks: newTasks, projects: newProjects };
                });

                if (userId !== 'anonymous') {
                    syncService.setTask(newTask);
                }

                get().addNotification({
                    title: 'Mission Captured',
                    message: `"${task.title}" added to your radar.`,
                    type: 'info'
                });
            },

            updateTask: (id, data) => {
                set((state) => {
                    const originalTask = state.tasks.find(t => t.id === id);
                    if (!originalTask) return state;

                    const newTasks = state.tasks.map(t =>
                        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
                    );

                    let newProjects = state.projects;
                    const projectIds = new Set<string>();
                    if (originalTask.projectId) projectIds.add(originalTask.projectId);
                    if (data.projectId) projectIds.add(data.projectId);

                    projectIds.forEach(pId => {
                        const projectTasks = newTasks.filter(t => t.projectId === pId);
                        const progress = projectTasks.length > 0 ? Math.round((projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100) : 0;
                        newProjects = newProjects.map(p => p.id === pId ? { ...p, progress } : p);

                        const up = newProjects.find(p => p.id === pId);
                        if (up && up.userId !== 'anonymous') syncService.setProject(up);
                    });

                    const updated = newTasks.find(t => t.id === id);
                    if (updated && updated.userId !== 'anonymous') syncService.setTask(updated);

                    return { tasks: newTasks, projects: newProjects };
                });
            },

            deleteTask: (id) => {
                set((state) => {
                    const taskToDelete = state.tasks.find(t => t.id === id);
                    if (!taskToDelete) return state;

                    const newTasks = state.tasks.filter(t => t.id !== id);
                    let newProjects = state.projects;

                    if (taskToDelete.projectId) {
                        const projectTasks = newTasks.filter(t => t.projectId === taskToDelete.projectId);
                        const progress = projectTasks.length > 0 ? Math.round((projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100) : 0;
                        newProjects = state.projects.map(p => p.id === taskToDelete.projectId ? { ...p, progress } : p);

                        const up = newProjects.find(p => p.id === taskToDelete.projectId);
                        if (up && up.userId !== 'anonymous') syncService.setProject(up);
                    }

                    syncService.deleteTask(id);
                    return { tasks: newTasks, projects: newProjects };
                });
            },

            toggleTaskStatus: (id) => {
                set((state) => {
                    const task = state.tasks.find(t => t.id === id);
                    if (!task) return state;

                    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
                    const xpDiff = newStatus === 'completed' ? 50 : -50;

                    const newTasks = state.tasks.map(t =>
                        t.id === id ? { ...t, status: newStatus as TaskStatus, updatedAt: new Date().toISOString() } : t
                    );

                    let newProjects = state.projects;
                    if (task.projectId) {
                        const projectTasks = newTasks.filter(t => t.projectId === task.projectId);
                        const progress = projectTasks.length > 0 ? Math.round((projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100) : 0;
                        newProjects = state.projects.map(p => p.id === task.projectId ? { ...p, progress } : p);

                        const up = newProjects.find(p => p.id === task.projectId);
                        if (up && up.userId !== 'anonymous') syncService.setProject(up);
                    }

                    const newXp = Math.max(0, state.user.xp + xpDiff);
                    const updated = newTasks.find(t => t.id === id);

                    if (updated && updated.userId !== 'anonymous') {
                        syncService.setTask(updated);
                        syncService.setUserXP(updated.userId, newXp);

                        if (xpDiff > 0) {
                            get().addNotification({
                                title: 'Mission Accomplished',
                                message: `You've earned +50 XP for completing "${updated.title}"`,
                                type: 'success'
                            });
                        }
                    }

                    return {
                        tasks: newTasks,
                        projects: newProjects,
                        user: { ...state.user, xp: newXp }
                    };
                });
            },

            setActiveCategory: (category) => set({ activeCategory: category }),
            setVoiceActive: (active) => set({ isVoiceActive: active }),
            setTranscription: (text) => set({ transcription: text }),

            updateUser: (data) => set((state) => {
                const newUser = { ...state.user, ...data };
                if (newUser.uid && newUser.uid !== 'anonymous') {
                    syncService.setUserProfile(newUser.uid, newUser);
                }
                return { user: newUser };
            }),

            addNotification: (notification) => {
                const id = generateSafeId();
                const userId = get().user.uid || 'anonymous';
                const newNotification: Notification = {
                    ...notification,
                    id,
                    userId,
                    read: false,
                    createdAt: new Date().toISOString()
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications]
                }));

                if (userId !== 'anonymous') {
                    syncService.setNotification(newNotification);
                }
            },

            markNotificationAsRead: (id) => {
                set((state) => {
                    const newNotifs = state.notifications.map(n =>
                        n.id === id ? { ...n, read: true } : n
                    );
                    const updated = newNotifs.find(n => n.id === id);
                    if (updated && updated.userId !== 'anonymous') {
                        syncService.setNotification(updated);
                    }
                    return { notifications: newNotifs };
                });
            },

            deleteNotification: (id) => {
                set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id)
                }));
                syncService.deleteNotification(id);
            },

            clearNotifications: () => set({ notifications: [] }),
            clearTasks: () => set({ tasks: [] }),

            addProject: (project) => {
                const id = generateSafeId();
                const userId = get().user.uid || 'anonymous';
                const newProject: Project = {
                    ...project,
                    id,
                    userId,
                    progress: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set((state) => ({
                    projects: [...state.projects, newProject]
                }));

                if (userId !== 'anonymous') {
                    syncService.setProject(newProject);
                }
            },

            updateProject: (id, data) => {
                set((state) => {
                    const newProjects = state.projects.map(p =>
                        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
                    );
                    const updated = newProjects.find(p => p.id === id);
                    if (updated && updated.userId !== 'anonymous') syncService.setProject(updated);
                    return { projects: newProjects };
                });
            },

            deleteProject: (id) => {
                const userId = get().user.uid || 'anonymous';
                set((state) => ({
                    projects: state.projects.filter(p => p.id !== id),
                    tasks: state.tasks.filter(t => t.projectId !== id)
                }));
                if (userId !== 'anonymous') syncService.deleteProjectAndTasks(id, userId);
            },

            recalculateProjectProgress: (projectId) => {
                set((state) => {
                    const projectTasks = state.tasks.filter(t => t.projectId === projectId);
                    const progress = projectTasks.length > 0
                        ? Math.round((projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100)
                        : 0;
                    return {
                        projects: state.projects.map(p => p.id === projectId ? { ...p, progress } : p)
                    };
                });
            },

            checkDeadlines: () => {
                const { tasks, addNotification } = get();
                const now = new Date();
                const TWELVE_HOURS = 12 * 60 * 60 * 1000;

                tasks.forEach(task => {
                    if (task.status === 'pending' && task.dueDate && !notifiedTasks.has(task.id)) {
                        let dueDateRaw = task.dueDate;
                        if (dueDateRaw.length === 10) dueDateRaw += 'T23:59:59';
                        const dueDate = new Date(dueDateRaw);

                        const diff = dueDate.getTime() - now.getTime();
                        if (diff > 0 && diff < TWELVE_HOURS) {
                            addNotification({
                                title: 'Critical Deadline',
                                message: `"${task.title}" is due in less than 12 hours!`,
                                type: 'warning'
                            });
                            notifiedTasks.add(task.id);
                        }
                    }
                });
            },
        }),
        {
            name: 'todogtd-storage',
            partialize: (state) => ({
                tasks: state.tasks,
                projects: state.projects,
                notifications: state.notifications,
                user: state.user
            }),
        }
    )
);
