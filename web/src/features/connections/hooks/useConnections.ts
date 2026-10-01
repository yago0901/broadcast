import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { subscribeToConnections } from "../api";
import type { Connection } from "../types";

export function useConnections() {
    const { user } = useAuth();
    const uid = user?.uid;
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!uid) return;

        const unsubscribe = subscribeToConnections(
            uid,
            (data) => {
                setConnections(data);
                setError("");
                setLoading(false);
            },
            (err) => {
                console.error("Erro ao carregar conexões:", err);
                setError("Não foi possível carregar suas conexões.");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [uid]);

    return { connections, loading, error };
}