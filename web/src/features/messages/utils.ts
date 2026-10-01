import type { Timestamp } from "firebase/firestore";
import type {
  Message, MessageFilter, MessageFormErrors, MessageInput, MessageRecipient,
} from "./types";

export const MAX_MESSAGE_LENGTH = 1000;

export const validateMessageForm = (
  { text, recipients, mode, scheduledAt }: MessageInput,
  now: Date = new Date()
): MessageFormErrors => {
  const errors: MessageFormErrors = {};

  if (recipients.length === 0) errors.recipients = "Selecione pelo menos um contato.";

  const trimmed = text.trim();
  if (trimmed.length === 0) errors.text = "Escreva a mensagem.";
  else if (trimmed.length > MAX_MESSAGE_LENGTH) {
    errors.text = `A mensagem pode ter no máximo ${MAX_MESSAGE_LENGTH} caracteres.`;
  }

  if (mode === "schedule") {
    if (!scheduledAt) errors.scheduledAt = "Informe a data e o horário do envio.";
    else if (scheduledAt.getTime() <= now.getTime()) {
      errors.scheduledAt = "Escolha uma data e um horário no futuro.";
    }
  }

  return errors;
};

const pad = (n: number) => String(n).padStart(2, "0");

export const toDatetimeLocalValue = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const fromDatetimeLocalValue = (value: string): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (timestamp: Timestamp | null): string =>
  timestamp
    ? timestamp.toDate().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : "";

export const canEditMessage = (message: Message): boolean => message.status === "scheduled";

export const excludeDeleted = (messages: Message[]): Message[] =>
  messages.filter((m) => m.status !== "deleted");

export const filterMessages = (messages: Message[], filter: MessageFilter): Message[] =>
  filter === "all" ? messages : messages.filter((m) => m.status === filter);

const toMillis = (timestamp: Timestamp | null): number =>
  timestamp ? timestamp.toMillis() : Date.now();

export const sortMessages = (messages: Message[]): Message[] => {
  const scheduled = messages
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => toMillis(a.scheduledAt) - toMillis(b.scheduledAt));
  const sent = messages
    .filter((m) => m.status === "sent")
    .sort((a, b) => toMillis(b.sentAt) - toMillis(a.sentAt));
  return [...scheduled, ...sent];
};

export const countByStatus = (messages: Message[]): Record<MessageFilter, number> => ({
  all: messages.length,
  scheduled: messages.filter((m) => m.status === "scheduled").length,
  sent: messages.filter((m) => m.status === "sent").length,
});

export const recipientsLabel = (recipients: MessageRecipient[]): string => {
  const names = recipients.map((r) => r.name);
  if (names.length <= 2) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
};

export const getMessageErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;
  if (code === "permission-denied") {
    return "Não foi possível salvar. A mensagem pode já ter sido enviada e não aceita mais edição.";
  }
  return "Não foi possível salvar. Tente novamente.";
};

export const getDeleteErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;
  if (code === "permission-denied") {
    return "Esta mensagem não pode mais ser excluída. Ela pode já ter sido excluída em outra janela.";
  }
  return "Não foi possível excluir a mensagem. Tente novamente.";
};