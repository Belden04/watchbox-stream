export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      downloads: {
        Row: {
          completed_at: string | null
          content_id: string
          content_type: string
          created_at: string
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      highlights: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          thumbnail_url: string
          title: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          thumbnail_url: string
          title: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          thumbnail_url?: string
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      movies: {
        Row: {
          country: string | null
          created_at: string
          description: string | null
          director: string | null
          duration: string | null
          episode_number: number | null
          genre: string | null
          id: string
          is_translated: boolean
          is_trending: boolean
          language: string | null
          poster_url: string
          production_company: string | null
          rating: number | null
          season_number: number | null
          series_title: string | null
          thumbnail_url: string | null
          title: string
          translator: string | null
          video_url: string | null
          year: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          description?: string | null
          director?: string | null
          duration?: string | null
          episode_number?: number | null
          genre?: string | null
          id?: string
          is_translated?: boolean
          is_trending?: boolean
          language?: string | null
          poster_url: string
          production_company?: string | null
          rating?: number | null
          season_number?: number | null
          series_title?: string | null
          thumbnail_url?: string | null
          title: string
          translator?: string | null
          video_url?: string | null
          year?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string
          description?: string | null
          director?: string | null
          duration?: string | null
          episode_number?: number | null
          genre?: string | null
          id?: string
          is_translated?: boolean
          is_trending?: boolean
          language?: string | null
          poster_url?: string
          production_company?: string | null
          rating?: number | null
          season_number?: number | null
          series_title?: string | null
          thumbnail_url?: string | null
          title?: string
          translator?: string | null
          video_url?: string | null
          year?: number | null
        }
        Relationships: []
      }
      premium_payments: {
        Row: {
          amount: number
          created_at: string
          email: string
          full_name: string
          id: string
          method: string
          note: string | null
          payer_phone: string | null
          plan: string
          reference: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          email: string
          full_name: string
          id?: string
          method: string
          note?: string | null
          payer_phone?: string | null
          plan: string
          reference?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          method?: string
          note?: string | null
          payer_phone?: string | null
          plan?: string
          reference?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      views: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
