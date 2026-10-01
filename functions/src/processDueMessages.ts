import { Timestamp, type Firestore } from "firebase-admin/firestore";

const BATCH_LIMIT = 200;

export async function processDueMessages(db: Firestore, now: Timestamp): Promise<number> {
  const snapshot = await db
    .collection("messages")
    .where("status", "==", "scheduled")
    .where("scheduledAt", "<=", now)
    .limit(BATCH_LIMIT)
    .get();

  const results = await Promise.all(
    snapshot.docs.map((doc) =>
      db.runTransaction(async (tx) => {
        const fresh = await tx.get(doc.ref);
        const data = fresh.data();

        if (!data || data.status !== "scheduled") return false;

        const scheduledAt = data.scheduledAt as Timestamp | null;
        if (!scheduledAt || scheduledAt.toMillis() > now.toMillis()) return false;

        tx.update(doc.ref, { status: "sent", sentAt: now });
        return true;
      })
    )
  );

  return results.filter(Boolean).length;
}