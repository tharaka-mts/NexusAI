import { format, isValid } from 'date-fns';

/**
 * Safely formats a date string or Date object.
 * Returns "-" if the value is invalid or null/undefined.
 * 
 * @param value - The date value to format (string | Date | null | undefined)
 * @param formatStr - The format string to use (default: "MMM d, yyyy")
 * @returns The formatted date string or "-"
 */
export const safeFormatDate = (
    value: string | Date | null | undefined,
    formatStr: string = 'MMM d, yyyy'
): string => {
    if (!value) return '-';

    const date = new Date(value);

    if (!isValid(date)) {
        return '-';
    }

    return format(date, formatStr);
};
