import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { getAuthErrorMessage, validateRegisterForm } from "../utils";

export function useRegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validateRegisterForm({ name, email, password, confirm });
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await registerUser(name.trim(), email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name, setName, email, setEmail, password, setPassword,
    confirm, setConfirm, error, submitting, handleSubmit,
  };
}