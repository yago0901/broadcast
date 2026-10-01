import { Chip, IconButton, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Message } from "./types";
import { canEditMessage, formatDateTime, recipientsLabel } from "./utils";

type Props = {
  message: Message;
  onEdit: (message: Message) => void;
  onDelete: (message: Message) => void;
};

export function MessageItem({ message, onEdit, onDelete }: Props) {
  const isScheduled = message.status === "scheduled";

  return (
    <Paper variant="outlined" className="flex items-start gap-3 p-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <Chip
            size="small"
            label={isScheduled ? "Agendada" : "Enviada"}
            color={isScheduled ? "warning" : "success"}
          />
          <Typography variant="caption" color="text.secondary">
            {isScheduled
              ? `Para ${formatDateTime(message.scheduledAt)}`
              : `Em ${formatDateTime(message.sentAt) || "agora"}`}
          </Typography>
        </div>

        <Typography className="whitespace-pre-wrap break-words">{message.text}</Typography>

        <Typography variant="caption" color="text.secondary">
          Para: {recipientsLabel(message.recipients)}
          {" · "}
          {message.recipients.length} {message.recipients.length === 1 ? "contato" : "contatos"}
        </Typography>
      </div>

      <div className="flex shrink-0">
        {canEditMessage(message) && (
          <IconButton aria-label="Editar" onClick={() => onEdit(message)}>
            <EditIcon />
          </IconButton>
        )}
        <IconButton aria-label="Excluir" onClick={() => onDelete(message)}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Paper>
  );
}