import {
  addDoc, collection, doc, onSnapshot, query, serverTimestamp,
  Timestamp, updateDoc, where, type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { Message, MessageInput } from "./types";

const messagesRef = collection(db, "messages");

const buildFields = ({ text, recipients, mode, scheduledAt }: MessageInput) => {
  const sendNow = mode === "now";
  return {
    text,
    recipients,
    contactIds: recipients.map((r) => r.id),
    status: sendNow ? ("sent" as const) : ("scheduled" as const),
    scheduledAt: !sendNow && scheduledAt ? Timestamp.fromDate(scheduledAt) : null,
    sentAt: sendNow ? serverTimestamp() : null,
  };
};

export const subscribeToMessages = (
  ownerId: string,
  connectionId: string,
  onData: (messages: Message[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const q = query(
    messagesRef,
    where("ownerId", "==", ownerId),
    where("connectionId", "==", connectionId)
  );

  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Message)),
    onError
  );
};

export const createMessage = (ownerId: string, connectionId: string, input: MessageInput) =>
  addDoc(messagesRef, {
    ownerId,
    connectionId,
    ...buildFields(input),
    deletedAt: null,
    createdAt: serverTimestamp(),
  });

export const updateMessage = (messageId: string, input: MessageInput) =>
  updateDoc(doc(db, "messages", messageId), buildFields(input));

// Exclusão lógica: o documento permanece no banco como registro.
// sentAt e scheduledAt são preservados, então dá para saber se foi enviada ou cancelada.
export const markMessageAsDeleted = (messageId: string) =>
  updateDoc(doc(db, "messages", messageId), {
    status: "deleted" as const,
    deletedAt: serverTimestamp(),
  });