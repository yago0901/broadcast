import type { Timestamp } from "firebase/firestore";

export type ActiveStatus = "scheduled" | "sent";
export type MessageStatus = ActiveStatus | "deleted";
export type MessageFilter = "all" | ActiveStatus;
export type SendMode = "now" | "schedule";

export type MessageRecipient = {
  id: string;
  name: string;
  phone: string;
};

export type Message = {
  id: string;
  ownerId: string;
  connectionId: string;
  contactIds: string[];
  recipients: MessageRecipient[];
  text: string;
  status: MessageStatus;
  scheduledAt: Timestamp | null;
  sentAt: Timestamp | null;
  deletedAt: Timestamp | null;
  createdAt: Timestamp | null;
};

export type MessageInput = {
  text: string;
  recipients: MessageRecipient[];
  mode: SendMode;
  scheduledAt: Date | null;
};

export type MessageFormErrors = {
  recipients?: string;
  text?: string;
  scheduledAt?: string;
};