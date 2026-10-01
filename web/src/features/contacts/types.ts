import type { Timestamp } from "firebase/firestore";

export type Contact = {
  id: string;
  ownerId: string;
  connectionId: string;
  name: string;
  phone: string;
  createdAt: Timestamp | null;
};

export type ContactInput = {
  name: string;
  phone: string;
};

export type ContactFormErrors = {
  name?: string;
  phone?: string;
};