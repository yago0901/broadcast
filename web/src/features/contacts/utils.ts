import { normalizePhone } from "../../utils/formatPhone";
import type { ContactFormErrors, ContactInput } from "./types";

export const validateContactName = (name: string): string | null => {
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Informe o nome do contato.";
  if (trimmed.length > 80) return "O nome pode ter no máximo 80 caracteres.";
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const digits = normalizePhone(phone);

  if (digits.length < 10 || digits.length > 11) {
    return "Informe o telefone com DDD (10 ou 11 dígitos).";
  }
  if (Number(digits.slice(0, 2)) < 11) return "DDD inválido.";
  if (digits.length === 11 && digits[2] !== "9") {
    return "Celular com 11 dígitos deve começar com 9 depois do DDD.";
  }
  return null;
};

export const validateContactForm = ({ name, phone }: ContactInput): ContactFormErrors => {
  const errors: ContactFormErrors = {};
  const nameError = validateContactName(name);
  const phoneError = validatePhone(phone);
  if (nameError) errors.name = nameError;
  if (phoneError) errors.phone = phoneError;
  return errors;
};