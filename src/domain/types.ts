export type TaskStatus = 'pending' | 'completed';
export type TaskCategory = 'inbox' | 'today' | 'upcoming' | 'anytime' | 'someday';

export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    category: TaskCategory;
    projectId?: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    userId: string;
    title: string;
    color: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
}

export interface VoiceAction {
    action: 'add_task' | 'move_task' | 'complete_task' | 'search';
    params: Record<string, any>;
}
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning';
    read: boolean;
    createdAt: string;
}
