import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { Contact, ContactInput } from "./types";

const contactsRef = collection(db, "contacts");

export const subscribeToContacts = (
  ownerId: string,
  connectionId: string,
  onData: (contacts: Contact[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const q = query(
    contactsRef,
    where("ownerId", "==", ownerId),
    where("connectionId", "==", connectionId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Contact)),
    onError
  );
};

export const createContact = (ownerId: string, connectionId: string, { name, phone }: ContactInput) =>
  addDoc(contactsRef, { ownerId, connectionId, name, phone, createdAt: serverTimestamp() });

export const updateContact = (contactId: string, { name, phone }: ContactInput) =>
  updateDoc(doc(db, "contacts", contactId), { name, phone });

export const deleteContact = (contactId: string) => deleteDoc(doc(db, "contacts", contactId));