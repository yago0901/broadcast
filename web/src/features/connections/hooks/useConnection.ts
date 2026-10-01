import { useEffect, useState } from "react";
import { subscribeToConnection } from "../api";
import type { Connection } from "../types";

export function useConnection(connectionId: string | undefined) {
    const [connection, setConnection] = useState<Connection | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!connectionId) return;

        const unsubscribe = subscribeToConnection(
            connectionId,
            (data) => {
                setConnection(data);
                setNotFound(data === null);
                setLoading(false);
            },
            () => {
                setConnection(null);
                setNotFound(true);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [connectionId]);

    return { connection, loading, notFound };
}