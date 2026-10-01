import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { setGlobalOptions } from "firebase-functions/v2";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { processDueMessages } from "./processDueMessages";

initializeApp();

setGlobalOptions({ region: "southamerica-east1", maxInstances: 5 });

export const sendScheduledMessages = onSchedule(
  { schedule: "every 1 minutes", timeZone: "America/Sao_Paulo" },
  async () => {
    const count = await processDueMessages(getFirestore(), Timestamp.now());
    logger.info(`Mensagens marcadas como enviadas: ${count}`);
  }
);