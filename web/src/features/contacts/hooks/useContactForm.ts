import { useState, type FormEvent } from "react";
import type { Contact, ContactFormErrors, ContactInput } from "../types";
import { validateContactForm } from "../utils";
import { formatPhone, normalizePhone } from "../../../utils/formatPhone";

export function useContactForm(initial: Contact | null, onSubmit: (input: ContactInput) => Promise<void>) {
    const [name, setName] = useState(initial?.name ?? "");
    const [phone, setPhone] = useState(formatPhone(initial?.phone ?? ""));
    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handlePhoneChange = (value: string) => setPhone(formatPhone(value));

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const input: ContactInput = { name: name.trim(), phone: normalizePhone(phone) };
        const validationErrors = validateContactForm(input);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitError("");
        setSubmitting(true);
        try {
            await onSubmit(input);
        } catch {
            setSubmitError("Não foi possível salvar. Tente novamente.");
            setSubmitting(false);
        }
    };

    return { name, setName, phone, handlePhoneChange, errors, submitError, submitting, handleSubmit };
}