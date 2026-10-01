import { Alert, Button, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useMessagesTab } from "./hooks/useMessagesTab";
import { MessageFormDialog } from "./MessageFormDialog";
import { MessageItem } from "./MessageItem";
import type { MessageFilter } from "./types";

type Props = { connectionId: string };

const emptyText: Record<MessageFilter, string> = {
    all: "Nenhuma mensagem ainda. Crie a primeira.",
    scheduled: "Nenhuma mensagem agendada.",
    sent: "Nenhuma mensagem enviada.",
};

export function MessagesTab({ connectionId }: Props) {
    const {
        contacts, contactsLoading,
        visibleMessages, counts, loading, error, actionError,
        filter, setFilter,
        form, openCreate, openEdit, closeForm, save,
        toDelete, setToDelete, deleting, confirmDelete,
    } = useMessagesTab(connectionId);

    const noContacts = !contactsLoading && contacts.length === 0;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Typography variant="subtitle1">Mensagens</Typography>
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={openCreate}
                    disabled={contactsLoading || noContacts}
                >
                    Nova mensagem
                </Button>
            </div>

            {noContacts && (
                <Alert severity="info">
                    Cadastre contatos na aba Contatos para poder enviar mensagens.
                </Alert>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {actionError && <Alert severity="error">{actionError}</Alert>}

            <Tabs value={filter} onChange={(_, value: MessageFilter) => setFilter(value)} variant="fullWidth">
                <Tab value="all" label={`Todas (${counts.all})`} />
                <Tab value="scheduled" label={`Agendadas (${counts.scheduled})`} />
                <Tab value="sent" label={`Enviadas (${counts.sent})`} />
            </Tabs>

            {loading ? (
                <div className="flex justify-center p-6"><CircularProgress /></div>
            ) : visibleMessages.length === 0 && !error ? (
                <Typography color="text.secondary" className="py-6 text-center">
                    {emptyText[filter]}
                </Typography>
            ) : (
                <div className="flex flex-col gap-2">
                    {visibleMessages.map((message) => (
                        <MessageItem key={message.id} message={message} onEdit={openEdit} onDelete={setToDelete} />
                    ))}
                </div>
            )}

            {form.open && (
                <MessageFormDialog
                    message={form.message}
                    contacts={contacts}
                    onSubmit={save}
                    onClose={closeForm}
                />
            )}

            <ConfirmDialog
                open={!!toDelete}
                title="Excluir mensagem"
                message={
                    toDelete?.status === "scheduled"
                        ? "Esta mensagem agendada será cancelada e não será enviada. Ela continua guardada no registro, mas some da lista."
                        : "Esta mensagem sairá da lista, mas continua guardada no registro."
                }
                confirmLabel="Excluir"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}