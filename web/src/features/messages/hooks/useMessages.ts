import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { subscribeToMessages } from "../api";
import type { Message } from "../types";

export function useMessages(connectionId: string) {
  const { user } = useAuth();
  const uid = user?.uid;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = subscribeToMessages(
      uid,
      connectionId,
      (data) => {
        setMessages(data);
        setError("");
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar mensagens:", err);
        setError("Não foi possível carregar as mensagens.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [uid, connectionId]);

  return { messages, loading, error };
}