import { useState, type FormEvent } from "react";
import type { Contact } from "../../contacts/types";
import type { Message, MessageFormErrors, MessageInput, SendMode } from "../types";
import {
    fromDatetimeLocalValue, getMessageErrorMessage, toDatetimeLocalValue, validateMessageForm,
} from "../utils";

export function useMessageForm(
    initial: Message | null,
    contacts: Contact[],
    onSubmit: (input: MessageInput) => Promise<void>
) {
    const [selected, setSelected] = useState<Contact[]>(() =>
        initial ? contacts.filter((c) => initial.contactIds.includes(c.id)) : []
    );
    const [text, setText] = useState(initial?.text ?? "");
    const [mode, setMode] = useState<SendMode>(initial ? "schedule" : "now");
    const [scheduledAt, setScheduledAt] = useState(
        initial?.scheduledAt ? toDatetimeLocalValue(initial.scheduledAt.toDate()) : ""
    );
    const [errors, setErrors] = useState<MessageFormErrors>({});
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const selectAll = () => setSelected(contacts);
    const clearSelection = () => setSelected([]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const input: MessageInput = {
            text: text.trim(),
            recipients: selected.map(({ id, name, phone }) => ({ id, name, phone })),
            mode,
            scheduledAt: mode === "schedule" ? fromDatetimeLocalValue(scheduledAt) : null,
        };

        const validationErrors = validateMessageForm(input);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitError("");
        setSubmitting(true);
        try {
            await onSubmit(input);
        } catch (err) {
            setSubmitError(getMessageErrorMessage(err));
            setSubmitting(false);
        }
    };

    return {
        selected, setSelected, selectAll, clearSelection,
        text, setText, mode, setMode, scheduledAt, setScheduledAt,
        errors, submitError, submitting, handleSubmit,
    };
}