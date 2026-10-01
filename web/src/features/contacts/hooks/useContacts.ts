import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { subscribeToContacts } from "../api";
import type { Contact } from "../types";

export function useContacts(connectionId: string) {
  const { user } = useAuth();
  const uid = user?.uid;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = subscribeToContacts(
      uid,
      connectionId,
      (data) => {
        setContacts(data);
        setError("");
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar contatos:", err);
        setError("Não foi possível carregar os contatos.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [uid, connectionId]);

  return { contacts, loading, error };
}