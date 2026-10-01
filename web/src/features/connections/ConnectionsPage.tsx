import { useNavigate } from "react-router-dom";
import {
  Alert, Button, CircularProgress, IconButton, List, ListItem,
  ListItemButton, ListItemText, Paper, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ConnectionFormDialog } from "./ConnectionFormDialog";
import { useConnectionsPage } from "./hooks/useConnectionsPage";

export function ConnectionsPage() {
  const navigate = useNavigate();
  const {
    connections, loading, error, actionError,
    form, openCreate, openEdit, closeForm, save,
    toDelete, setToDelete, deleting, confirmDelete,
  } = useConnectionsPage();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography variant="h5">Minhas conexões</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nova conexão
        </Button>
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {actionError && <Alert severity="error">{actionError}</Alert>}

      {loading ? (
        <div className="flex justify-center p-8"><CircularProgress /></div>
      ) : connections.length === 0 ? (
        <Paper className="p-8 text-center">
          <Typography color="text.secondary">
            Você ainda não tem conexões. Crie a primeira para começar.
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List disablePadding>
            {connections.map((connection) => (
              <ListItem
                key={connection.id}
                divider
                disablePadding
                secondaryAction={
                  <>
                    <IconButton aria-label="Editar" onClick={() => openEdit(connection)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="Excluir" onClick={() => setToDelete(connection)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemButton onClick={() => navigate(`/connections/${connection.id}`)}>
                  <ListItemText primary={connection.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {form.open && (
        <ConnectionFormDialog connection={form.connection} onSubmit={save} onClose={closeForm} />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir conexão"
        message={`Ao excluir "${toDelete?.name ?? ""}", os contatos dela serão apagados e as mensagens agendadas serão canceladas. As mensagens já enviadas continuam guardadas no registro. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}