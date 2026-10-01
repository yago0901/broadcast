import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Alert, Button, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useConnection } from "./hooks/useConnection";
import { ContactsTab } from "../contacts/ContactsTab";
import { MessagesTab } from "../messages/MessagesTab";

type TabKey = "contacts" | "broadcast";

export function ConnectionDetailPage() {
  const { connectionId } = useParams<{ connectionId: string }>();
  const { connection, loading, notFound } = useConnection(connectionId);
  const [tab, setTab] = useState<TabKey>("contacts");

  if (loading) {
    return <div className="flex justify-center p-8"><CircularProgress /></div>;
  }

  if (notFound || !connection) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Alert severity="error" className="w-full">Conexão não encontrada.</Alert>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>Voltar</Button>
        <Typography variant="h5">{connection.name}</Typography>
      </div>

      <Paper>
        <Tabs value={tab} onChange={(_, value: TabKey) => setTab(value)}>
          <Tab label="Contatos" value="contacts" />
          <Tab label="Broadcast" value="broadcast" />
        </Tabs>

        <div className="p-4">
          {tab === "contacts" && <ContactsTab connectionId={connection.id} />}
          {tab === "broadcast" && <MessagesTab connectionId={connection.id} />}
        </div>
      </Paper>
    </div>
  );
}