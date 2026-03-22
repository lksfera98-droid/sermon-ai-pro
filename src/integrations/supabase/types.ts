export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { user_id: string; email: string; full_name: string; is_paid: boolean; };
        Insert: { user_id: string; email: string; full_name?: string; is_paid?: boolean; };
        Update: { user_id?: string; email?: string; full_name?: string; is_paid?: boolean; };
      };
      public_sermons: {
        Row: { id: string; title: string; content: string; theme: string; verse: string | null; language: string; user_id: string | null; created_at: string; };
        Insert: { id?: string; title: string; content: string; theme: string; verse?: string | null; language: string; user_id?: string | null; };
        Update: { title?: string; content?: string; theme?: string; verse?: string | null; language?: string; };
      };
      prayer_requests: {
        Row: { id: string; created_at: string; language: string; request_text: string; author_name: string | null; is_anonymous: boolean; image_url: string | null; user_id: string | null; delete_token: string | null; };
        Insert: { language: string; request_text: string; author_name?: string | null; is_anonymous?: boolean; image_url?: string | null; user_id?: string | null; delete_token?: string | null; };
        Update: { request_text?: string; author_name?: string | null; };
      };
      devotionals: {
        Row: { id: string; content: string; created_at: string; };
        Insert: { content: string; };
        Update: { content?: string; };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
