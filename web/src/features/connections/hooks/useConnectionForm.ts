import { useState, type FormEvent } from "react";
import { validateConnectionName } from "../utils";

export function useConnectionForm(initialName: string, onSubmit: (name: string) => Promise<void>) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationError = validateConnectionName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit(name.trim());
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
      setSubmitting(false);
    }
  };

  return { name, setName, error, submitting, handleSubmit };
}