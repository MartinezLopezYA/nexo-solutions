export function capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function capitalize(value: string): string {
    if (!value) return value;
    return value.trim().toUpperCase();
}