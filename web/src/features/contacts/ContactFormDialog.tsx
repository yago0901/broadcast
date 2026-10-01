import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useContactForm } from "./hooks/useContactForm";
import type { Contact, ContactInput } from "./types";

type Props = {
  contact: Contact | null;
  onSubmit: (input: ContactInput) => Promise<void>;
  onClose: () => void;
};

export function ContactFormDialog({ contact, onSubmit, onClose }: Props) {
  const { name, setName, phone, handlePhoneChange, errors, submitError, submitting, handleSubmit } =
    useContactForm(contact, onSubmit);

  return (
    <Dialog open onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{contact ? "Editar contato" : "Novo contato"}</DialogTitle>
        <DialogContent className="flex flex-col gap-2">
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Telefone"
            placeholder="(11) 91234-5678"
            type="tel"
            slotProps={{ htmlInput: { inputMode: "tel" } }}
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          {submitError && <Alert severity="error">{submitError}</Alert>}
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