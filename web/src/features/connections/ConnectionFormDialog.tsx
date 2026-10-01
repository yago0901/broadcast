import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useConnectionForm } from "./hooks/useConnectionForm";
import type { Connection } from "./types";

type Props = {
  connection: Connection | null;
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
};

export function ConnectionFormDialog({ connection, onSubmit, onClose }: Props) {
  const { name, setName, error, submitting, handleSubmit } = useConnectionForm(connection?.name ?? "", onSubmit);

  return (
    <Dialog open onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{connection ? "Editar conexão" : "Nova conexão"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Nome da conexão"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}