import { useMemo, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useContacts } from "../../contacts/hooks/useContacts";
import { createMessage, markMessageAsDeleted, updateMessage } from "../api";
import type { Message, MessageFilter, MessageInput } from "../types";
import {
  countByStatus, excludeDeleted, filterMessages, getDeleteErrorMessage, sortMessages,
} from "../utils";
import { useMessages } from "./useMessages";

type FormState = { open: boolean; message: Message | null };

export function useMessagesTab(connectionId: string) {
  const { user } = useAuth();
  const { messages, loading, error } = useMessages(connectionId);
  const { contacts, loading: contactsLoading } = useContacts(connectionId);

  const [filter, setFilter] = useState<MessageFilter>("all");
  const [form, setForm] = useState<FormState>({ open: false, message: null });
  const [toDelete, setToDelete] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const activeMessages = useMemo(() => excludeDeleted(messages), [messages]);

  const visibleMessages = useMemo(
    () => sortMessages(filterMessages(activeMessages, filter)),
    [activeMessages, filter]
  );
  const counts = useMemo(() => countByStatus(activeMessages), [activeMessages]);

  const openCreate = () => setForm({ open: true, message: null });
  const openEdit = (message: Message) => setForm({ open: true, message });
  const closeForm = () => setForm({ open: false, message: null });

  const save = async (input: MessageInput) => {
    if (!user) return;
    if (form.message) {
      await updateMessage(form.message.id, input);
    } else {
      await createMessage(user.uid, connectionId, input);
    }
    closeForm();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setActionError("");
    try {
      await markMessageAsDeleted(toDelete.id);
      setToDelete(null);
    } catch (err) {
      setActionError(getDeleteErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return {
    contacts, contactsLoading,
    visibleMessages, counts, loading, error, actionError,
    filter, setFilter,
    form, openCreate, openEdit, closeForm, save,
    toDelete, setToDelete, deleting, confirmDelete,
  };
}