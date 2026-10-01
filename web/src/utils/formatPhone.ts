export const normalizePhone = (value: string): string => value.replace(/\D/g, "");

export const formatPhone = (value: string): string => {
  const digits = normalizePhone(value).slice(0, 11);
  const ddd = digits.slice(0, 2);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${ddd}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${ddd}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${ddd}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};