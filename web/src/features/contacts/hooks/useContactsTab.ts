import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { createContact, deleteContact, updateContact } from "../api";
import type { Contact, ContactInput } from "../types";
import { useContacts } from "./useContacts";

type FormState = { open: boolean; contact: Contact | null };

export function useContactsTab(connectionId: string) {
  const { user } = useAuth();
  const { contacts, loading, error } = useContacts(connectionId);

  const [form, setForm] = useState<FormState>({ open: false, contact: null });
  const [toDelete, setToDelete] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const openCreate = () => setForm({ open: true, contact: null });
  const openEdit = (contact: Contact) => setForm({ open: true, contact });
  const closeForm = () => setForm({ open: false, contact: null });

  const save = async (input: ContactInput) => {
    if (!user) return;
    if (form.contact) {
      await updateContact(form.contact.id, input);
    } else {
      await createContact(user.uid, connectionId, input);
    }
    closeForm();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setActionError("");
    try {
      await deleteContact(toDelete.id);
      setToDelete(null);
    } catch {
      setActionError("Não foi possível excluir o contato. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  return {
    contacts, loading, error, actionError,
    form, openCreate, openEdit, closeForm, save,
    toDelete, setToDelete, deleting, confirmDelete,
  };
}