import { collection, doc, setDoc, deleteDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { Task, Project, Notification } from '@/domain/types';

export const syncService = {
    // TASKS
    async setTask(task: Task) {
        if (!task.userId || task.userId === 'anonymous') return;
        const taskRef = doc(db, 'tasks', task.id);
        await setDoc(taskRef, task, { merge: true });
    },

    async deleteTask(taskId: string) {
        const taskRef = doc(db, 'tasks', taskId);
        await deleteDoc(taskRef);
    },

    async fetchUserTasks(userId: string): Promise<Task[]> {
        const q = query(collection(db, 'tasks'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Task);
    },

    // PROJECTS
    async setProject(project: Project) {
        if (!project.userId || project.userId === 'anonymous') return;
        const projectRef = doc(db, 'projects', project.id);
        await setDoc(projectRef, project, { merge: true });
    },

    async fetchUserProjects(userId: string): Promise<Project[]> {
        const q = query(collection(db, 'projects'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Project);
    },

    async deleteProjectAndTasks(projectId: string, userId: string) {
        // Find tasks referencing this project
        const q = query(collection(db, 'tasks'), where('projectId', '==', projectId), where('userId', '==', userId));
        const snapshot = await getDocs(q);

        const batch = writeBatch(db);

        // Delete tasks
        snapshot.docs.forEach((docSnap) => {
            batch.delete(docSnap.ref);
        });

        // Delete project
        const projectRef = doc(db, 'projects', projectId);
        batch.delete(projectRef);

        await batch.commit();
    },

    // USER PROFILE
    async setUserProfile(userId: string, data: any) {
        if (!userId || userId === 'anonymous') return;
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...data,
            uid: userId,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    },

    async fetchUserProfile(userId: string): Promise<any> {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    },

    async setUserXP(userId: string, xp: number) {
        return this.setUserProfile(userId, { xp });
    },

    async fetchUserXP(userId: string): Promise<number> {
        const profile = await this.fetchUserProfile(userId);
        return profile?.xp || profile?.totalXP || 0;
    },

    // NOTIFICATIONS
    async setNotification(notification: Notification) {
        if (!notification.userId || notification.userId === 'anonymous') return;
        const ref = doc(db, 'notifications', notification.id);
        await setDoc(ref, notification, { merge: true });
    },

    async fetchUserNotifications(userId: string): Promise<Notification[]> {
        const q = query(collection(db, 'notifications'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Notification);
    },

    async deleteNotification(id: string) {
        const ref = doc(db, 'notifications', id);
        await deleteDoc(ref);
    }
};
