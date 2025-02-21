const DEFAULT_MAX_LENGTH = 100;

export const shorten = (text: string, maxLength: number = DEFAULT_MAX_LENGTH): string => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
};