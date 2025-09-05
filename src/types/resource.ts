export type Resource = {
  id: string | number;
  title: string;
  slug: string;
  summary?: string | null;
  cover_image?: string | null;
  reading_minutes?: number | null;
  tags?: string[] | null;
  published?: boolean | null;
  created_at?: string | null;
};