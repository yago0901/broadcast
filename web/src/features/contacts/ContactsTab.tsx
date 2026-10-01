import { Alert, Button, CircularProgress, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ContactFormDialog } from "./ContactFormDialog";
import { useContactsTab } from "./hooks/useContactsTab";
import { formatPhone } from "../../utils/formatPhone";

type Props = { connectionId: string };

export function ContactsTab({ connectionId }: Props) {
    const {
        contacts, loading, error, actionError,
        form, openCreate, openEdit, closeForm, save,
        toDelete, setToDelete, deleting, confirmDelete,
    } = useContactsTab(connectionId);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Typography variant="subtitle1">
                    {loading ? "Contatos" : `Contatos (${contacts.length})`}
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                    Novo contato
                </Button>
            </div>

            {error && <Alert severity="error">{error}</Alert>}
            {actionError && <Alert severity="error">{actionError}</Alert>}

            {loading ? (
                <div className="flex justify-center p-6"><CircularProgress /></div>
            ) : contacts.length === 0 && !error ? (
                <Typography color="text.secondary" className="py-6 text-center">
                    Nenhum contato nesta conexão. Adicione o primeiro.
                </Typography>
            ) : (
                <List disablePadding>
                    {contacts.map((contact) => (
                        <ListItem
                            key={contact.id}
                            divider
                            secondaryAction={
                                <>
                                    <IconButton aria-label="Editar" onClick={() => openEdit(contact)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="Excluir" onClick={() => setToDelete(contact)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText primary={contact.name} secondary={formatPhone(contact.phone)} />
                        </ListItem>
                    ))}
                </List>
            )}

            {form.open && <ContactFormDialog contact={form.contact} onSubmit={save} onClose={closeForm} />}

            <ConfirmDialog
                open={!!toDelete}
                title="Excluir contato"
                message={`Deseja excluir o contato "${toDelete?.name ?? ""}"?`}
                confirmLabel="Excluir"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}