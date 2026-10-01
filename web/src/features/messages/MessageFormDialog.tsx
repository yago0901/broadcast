import {
  Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, Radio, RadioGroup, TextField, Typography,
} from "@mui/material";
import type { Contact } from "../contacts/types";
import { formatPhone } from "../../utils/formatPhone";
import { useMessageForm } from "./hooks/useMessageForm";
import type { Message, MessageInput, SendMode } from "./types";
import { MAX_MESSAGE_LENGTH } from "./utils";

type Props = {
  message: Message | null;
  contacts: Contact[];
  onSubmit: (input: MessageInput) => Promise<void>;
  onClose: () => void;
};

export function MessageFormDialog({ message, contacts, onSubmit, onClose }: Props) {
  const {
    selected, setSelected, selectAll, clearSelection,
    text, setText, mode, setMode, scheduledAt, setScheduledAt,
    errors, submitError, submitting, handleSubmit,
  } = useMessageForm(message, contacts, onSubmit);

  const submitLabel = mode === "now" ? "Enviar agora" : message ? "Salvar" : "Agendar";

  return (
    <Dialog open onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{message ? "Editar mensagem agendada" : "Nova mensagem"}</DialogTitle>

        <DialogContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 pt-2">
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={contacts}
              value={selected}
              onChange={(_, value) => setSelected(value)}
              getOptionLabel={(c) => `${c.name} (${formatPhone(c.phone)})`}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Destinatários"
                  error={!!errors.recipients}
                  helperText={errors.recipients}
                />
              )}
            />
            <div className="flex items-center gap-2">
              <Button size="small" onClick={selectAll} disabled={selected.length === contacts.length}>
                Selecionar todos
              </Button>
              <Button size="small" onClick={clearSelection} disabled={selected.length === 0}>
                Limpar
              </Button>
              <Typography variant="caption" color="text.secondary">
                {selected.length} de {contacts.length} selecionados
              </Typography>
            </div>
          </div>

          <TextField
            label="Mensagem"
            multiline
            minRows={3}
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            error={!!errors.text}
            helperText={errors.text ?? `${text.length}/${MAX_MESSAGE_LENGTH}`}
          />

          <div>
            <RadioGroup row value={mode} onChange={(e) => setMode(e.target.value as SendMode)}>
              <FormControlLabel value="now" control={<Radio />} label="Enviar agora" />
              <FormControlLabel value="schedule" control={<Radio />} label="Agendar" />
            </RadioGroup>

            {mode === "schedule" && (
              <TextField
                label="Data e horário"
                type="datetime-local"
                fullWidth
                margin="dense"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.scheduledAt}
                helperText={errors.scheduledAt}
              />
            )}
          </div>

          {submitError && <Alert severity="error">{submitError}</Alert>}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Salvando..." : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}