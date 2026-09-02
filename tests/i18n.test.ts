import { describe, expect, it } from 'vitest';
import { getDictionary, isLocale, otherLocale } from '@/lib/i18n';
import { localized, translationComplete } from '@/lib/types';
import { seedServices } from '@/lib/site-content';

describe('bilingual content', () => {
  it('supports only ID and EN locales', () => { expect(isLocale('id')).toBe(true); expect(isLocale('en')).toBe(true); expect(isLocale('fr')).toBe(false); expect(otherLocale('id')).toBe('en'); });
  it('provides translated system messages', () => { expect(getDictionary('id').submit).not.toBe(getDictionary('en').submit); expect(getDictionary('en').error).toBeTruthy(); });
  it('ships all eight services with complete translations', () => { expect(seedServices).toHaveLength(8); expect(seedServices.every(translationComplete)).toBe(true); expect(localized(seedServices[0],'title','id')).toBe('Corporate Event'); });
});
