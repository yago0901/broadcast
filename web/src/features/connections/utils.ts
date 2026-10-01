export const validateConnectionName = (name: string): string | null => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return "Informe um nome com pelo menos 2 caracteres.";
    if (trimmed.length > 60) return "O nome pode ter no máximo 60 caracteres.";
    return null;
};

export const chunk = <T,>(items: T[], size: number): T[][] => {
    const groups: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        groups.push(items.slice(i, i + size));
    }
    return groups;
};