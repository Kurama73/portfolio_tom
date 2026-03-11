import { useTranslation } from 'react-i18next';

export function useSafeTranslation() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  /**
   * Translates a dynamic field from an entity.
   * Fallback chain: fieldEn -> field -> defaultText
   */
  const translateField = (entity: unknown, field: string): string => {
    if (!entity) return '';
    const e = entity as Record<string, unknown>;

    if (!isEn) return (e[field] as string) || '';

    const enValue = (e[`${field}En`] || e[`${field}_en`]);

    return (enValue as string) || (e[field] as string) || '';
  };

  const translateArray = (entity: unknown, field: string): string[] => {
    if (!entity) return [];
    const e = entity as Record<string, unknown>;
    
    if (!isEn) return (e[field] as string[]) || [];

    const enValue = (e[`${field}En`] || e[`${field}_en`]);
    
    return (enValue as string[]) || (e[field] as string[]) || [];
  };

  /**
   * Helper to translate a specific key from i18n files
   */
  const translateKey = (key: string, options?: Record<string, unknown>): string => {
    const result = t(key, options);
    return typeof result === 'string' ? result : String(result || key);
  };

  return {
    t: translateKey as (key: string, options?: Record<string, unknown>) => string,
    translateField,
    translateArray,
    isEn,
    language: i18n.language
  };
}
