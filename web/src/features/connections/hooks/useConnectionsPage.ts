import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { createConnection, deleteConnectionWithRelations, updateConnection } from "../api";
import type { Connection } from "../types";
import { useConnections } from "./useConnections";

type FormState = { open: boolean; connection: Connection | null };

export function useConnectionsPage() {
  const { user } = useAuth();
  const { connections, loading, error } = useConnections();

  const [form, setForm] = useState<FormState>({ open: false, connection: null });
  const [toDelete, setToDelete] = useState<Connection | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const openCreate = () => setForm({ open: true, connection: null });
  const openEdit = (connection: Connection) => setForm({ open: true, connection });
  const closeForm = () => setForm({ open: false, connection: null });


  const save = async (name: string) => {
    if (!user) return;
    if (form.connection) {
      await updateConnection(form.connection.id, name);
    } else {
      await createConnection(user.uid, name);
    }
    closeForm();
  };

  const confirmDelete = async () => {
    if (!user || !toDelete) return;
    setDeleting(true);
    setActionError("");
    try {
      await deleteConnectionWithRelations(user.uid, toDelete.id);
      setToDelete(null);
    } catch {
      setActionError("Não foi possível excluir a conexão. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  return {
    connections, loading, error, actionError,
    form, openCreate, openEdit, closeForm, save,
    toDelete, setToDelete, deleting, confirmDelete,
  };
}