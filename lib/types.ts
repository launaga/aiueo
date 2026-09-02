export type Locale = 'id' | 'en';
export type UserRole = 'super_admin' | 'editor' | 'viewer';
export type PublishStatus = 'draft' | 'published';
export type ContentResource = 'pages' | 'services' | 'events' | 'articles' | 'gallery_items';

export type LocalizedContent = {
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  body_id?: string;
  body_en?: string;
  slug_id: string;
  slug_en: string;
};

export type ContentRecord = LocalizedContent & {
  id: string;
  status: PublishStatus;
  featured_image_url?: string | null;
  sort_order?: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export function localized<T extends Record<string, unknown>>(record: T, field: string, locale: Locale): string {
  return String(record[`${field}_${locale}`] ?? '');
}

export function translationComplete(record: Partial<LocalizedContent>) {
  return Boolean(record.title_id?.trim() && record.title_en?.trim() && record.description_id?.trim() && record.description_en?.trim());
}
