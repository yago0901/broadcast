import {
    addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query,
    serverTimestamp, updateDoc, where, writeBatch,
    type Unsubscribe, type WriteBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { Connection } from "./types";
import { chunk } from "./utils";

const connectionsRef = collection(db, "connections");

const toConnection = (id: string, data: object) => ({ id, ...data }) as Connection;

export const subscribeToConnections = (
    ownerId: string,
    onData: (connections: Connection[]) => void,
    onError: (error: Error) => void
): Unsubscribe => {
    const q = query(connectionsRef, where("ownerId", "==", ownerId), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => onData(snap.docs.map((d) => toConnection(d.id, d.data()))), onError);
};

export const subscribeToConnection = (
    connectionId: string,
    onData: (connection: Connection | null) => void,
    onError: (error: Error) => void
): Unsubscribe =>
    onSnapshot(
        doc(db, "connections", connectionId),
        (snap) => onData(snap.exists() ? toConnection(snap.id, snap.data()) : null),
        onError
    );

export const createConnection = (ownerId: string, name: string) =>
    addDoc(connectionsRef, { ownerId, name, createdAt: serverTimestamp() });

export const updateConnection = (connectionId: string, name: string) =>
    updateDoc(doc(db, "connections", connectionId), { name });

export const deleteConnectionWithRelations = async (ownerId: string, connectionId: string) => {
    const [contacts, scheduledMessages] = await Promise.all([
        getDocs(
            query(
                collection(db, "contacts"),
                where("ownerId", "==", ownerId),
                where("connectionId", "==", connectionId)
            )
        ),
        getDocs(
            query(
                collection(db, "messages"),
                where("ownerId", "==", ownerId),
                where("connectionId", "==", connectionId),
                where("status", "==", "scheduled")
            )
        ),
    ]);

    const operations: Array<(batch: WriteBatch) => void> = [
        ...contacts.docs.map((d) => (batch: WriteBatch) => batch.delete(d.ref)),
        ...scheduledMessages.docs.map((d) => (batch: WriteBatch) =>
            batch.update(d.ref, { status: "deleted", deletedAt: serverTimestamp() })
        ),
    ];

    for (const group of chunk(operations, 400)) {
        const batch = writeBatch(db);
        group.forEach((apply) => apply(batch));
        await batch.commit();
    }

    await deleteDoc(doc(db, "connections", connectionId));
};