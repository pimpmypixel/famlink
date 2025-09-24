import { usePage } from '@inertiajs/react';

/**
 * Translation helper function for React components
 * Mimics Laravel's __() helper function
 *
 * @param key - The translation key (e.g., 'messages.save', 'auth.failed')
 * @param replacements - Object with replacement values
 * @returns The translated string
 */
export function __(key: string, replacements: Record<string, any> = {}): string {
    const { props } = usePage();
    const translations = (props as any).translations || {};

    // Split the key by dots to navigate through the translation object
    const keys = key.split('.');
    let value: any = translations;

    // Navigate through the nested object
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            // If key not found, return the original key
            return key;
        }
    }

    // If value is not a string, return the key
    if (typeof value !== 'string') {
        return key;
    }

    // Replace placeholders
    let translated = value;
    for (const [placeholder, replacement] of Object.entries(replacements)) {
        translated = translated.replace(new RegExp(`:${placeholder}`, 'g'), String(replacement));
    }

    return translated;
}

/**
 * Get all translations for a specific namespace
 *
 * @param namespace - The translation namespace (e.g., 'messages', 'auth')
 * @returns Object with all translations for the namespace
 */
export function trans(namespace: string): Record<string, any> {
    const { props } = usePage();
    const translations = (props as any).translations || {};

    return translations[namespace] || {};
}

/**
 * Check if a translation key exists
 *
 * @param key - The translation key
 * @returns Boolean indicating if the key exists
 */
export function hasTranslation(key: string): boolean {
    const { props } = usePage();
    const translations = (props as any).translations || {};

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return false;
        }
    }

    return typeof value === 'string';
}
