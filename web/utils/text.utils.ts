const DEFAULT_MAX_LENGTH = 100;

export const shorten = (text: string, maxLength: number = DEFAULT_MAX_LENGTH): string => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
};

export const getFontSizeByLength = (length: number) => {
    if (length < 50) return 48;
    if (length < 100) return 40;
    if (length < 200) return 32;
    if (length < 400) return 24;
    if (length < 800) return 16;
    if (length < 6000) return 12;
    return 8;
}