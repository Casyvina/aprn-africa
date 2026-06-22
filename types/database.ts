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
      ai_research_suggestions: {
        Row: {
          created_at: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          source_context: string | null
          status: string
          suggested_data: Json
          target_table: string
        }
        Insert: {
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_context?: string | null
          status?: string
          suggested_data: Json
          target_table: string
        }
        Update: {
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_context?: string | null
          status?: string
          suggested_data?: Json
          target_table?: string
        }
        Relationships: []
      }
      contractors_epc: {
        Row: {
          address: string | null
          company_name: string
          contact_person: string | null
          country_hq: string | null
          created_at: string | null
          email: string | null
          id: string
          key_projects_africa: string | null
          notes: string | null
          phone: string | null
          specialisation: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_person?: string | null
          country_hq?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          key_projects_africa?: string | null
          notes?: string | null
          phone?: string | null
          specialisation?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_person?: string | null
          country_hq?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          key_projects_africa?: string | null
          notes?: string | null
          phone?: string | null
          specialisation?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          amount_paid: number
          email: string
          full_name: string
          id: string
          organisation: string | null
          registered_at: string
          sanity_event_id: string
          status: string
          ticket_ref: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number
          email: string
          full_name: string
          id?: string
          organisation?: string | null
          registered_at?: string
          sanity_event_id: string
          status?: string
          ticket_ref?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          email?: string
          full_name?: string
          id?: string
          organisation?: string | null
          registered_at?: string
          sanity_event_id?: string
          status?: string
          ticket_ref?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          event_reminders: boolean | null
          member_activity: boolean | null
          newsletter_weekly: boolean | null
          platform_updates: boolean | null
          research_alerts: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          event_reminders?: boolean | null
          member_activity?: boolean | null
          newsletter_weekly?: boolean | null
          platform_updates?: boolean | null
          research_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          event_reminders?: boolean | null
          member_activity?: boolean | null
          newsletter_weekly?: boolean | null
          platform_updates?: boolean | null
          research_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      outreach_campaigns: {
        Row: {
          body_template: string | null
          campaign_type: string
          created_at: string
          created_by: string | null
          goal: string
          id: string
          name: string
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          body_template?: string | null
          campaign_type?: string
          created_at?: string
          created_by?: string | null
          goal: string
          id?: string
          name: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          body_template?: string | null
          campaign_type?: string
          created_at?: string
          created_by?: string | null
          goal?: string
          id?: string
          name?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      outreach_recipients: {
        Row: {
          campaign_id: string
          id: string
          notes: string | null
          opened_at: string | null
          personalized_body: string | null
          recipient_email: string | null
          recipient_id: string
          recipient_name: string
          recipient_type: string
          resend_message_id: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          id?: string
          notes?: string | null
          opened_at?: string | null
          personalized_body?: string | null
          recipient_email?: string | null
          recipient_id: string
          recipient_name: string
          recipient_type: string
          resend_message_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          id?: string
          notes?: string | null
          opened_at?: string | null
          personalized_body?: string | null
          recipient_email?: string | null
          recipient_id?: string
          recipient_name?: string
          recipient_type?: string
          resend_message_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_ngn: number
          created_at: string
          currency: string
          id: string
          metadata: Json
          paid_at: string | null
          payment_type: string
          paystack_ref: string
          paystack_txn_id: string | null
          related_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_ngn: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          paid_at?: string | null
          payment_type: string
          paystack_ref: string
          paystack_txn_id?: string | null
          related_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_ngn?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          paid_at?: string | null
          payment_type?: string
          paystack_ref?: string
          paystack_txn_id?: string | null
          related_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      pipeline_engineers: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          linkedin_web: string | null
          location: string | null
          notes: string | null
          organisation: string | null
          phone: string | null
          qualifications: string | null
          role_specialisation: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          linkedin_web?: string | null
          location?: string | null
          notes?: string | null
          organisation?: string | null
          phone?: string | null
          qualifications?: string | null
          role_specialisation?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          linkedin_web?: string | null
          location?: string | null
          notes?: string | null
          organisation?: string | null
          phone?: string | null
          qualifications?: string | null
          role_specialisation?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pipeline_operators: {
        Row: {
          company_name: string
          contact_person: string | null
          country: string | null
          created_at: string | null
          email: string | null
          hq_address: string | null
          id: string
          key_pipeline_assets: string | null
          notes: string | null
          phone: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          company_name: string
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          hq_address?: string | null
          id?: string
          key_pipeline_assets?: string | null
          notes?: string | null
          phone?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          company_name?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          hq_address?: string | null
          id?: string
          key_pipeline_assets?: string | null
          notes?: string | null
          phone?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          discipline: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          job_title: string | null
          last_seen_at: string | null
          linkedin_url: string | null
          membership_tier: string
          organisation: string | null
          topics: string[]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          discipline?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          job_title?: string | null
          last_seen_at?: string | null
          linkedin_url?: string | null
          membership_tier?: string
          organisation?: string | null
          topics?: string[]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          discipline?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          job_title?: string | null
          last_seen_at?: string | null
          linkedin_url?: string | null
          membership_tier?: string
          organisation?: string | null
          topics?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      regulators_associations: {
        Row: {
          contact_email: string | null
          country_region: string | null
          created_at: string | null
          id: string
          key_contact_title: string | null
          notes: string | null
          organisation: string
          phone: string | null
          relevance_to_aprn: string | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          country_region?: string | null
          created_at?: string | null
          id?: string
          key_contact_title?: string | null
          notes?: string | null
          organisation: string
          phone?: string | null
          relevance_to_aprn?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          country_region?: string | null
          created_at?: string | null
          id?: string
          key_contact_title?: string | null
          notes?: string | null
          organisation?: string
          phone?: string | null
          relevance_to_aprn?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      research_sources: {
        Row: {
          added_by: string | null
          category: string | null
          created_at: string | null
          date_published: string | null
          description: string | null
          id: string
          notes: string | null
          source_type: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          added_by?: string | null
          category?: string | null
          created_at?: string | null
          date_published?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          source_type?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          added_by?: string | null
          category?: string | null
          created_at?: string | null
          date_published?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          source_type?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          id: string
          item_id: string
          item_slug: string | null
          item_title: string | null
          item_type: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          item_slug?: string | null
          item_title?: string | null
          item_type: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          item_slug?: string | null
          item_title?: string | null
          item_type?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      strategy_approval_flow: {
        Row: {
          description: string | null
          step: string
          title: string
          updated_at: string | null
          who: string
        }
        Insert: {
          description?: string | null
          step: string
          title: string
          updated_at?: string | null
          who: string
        }
        Update: {
          description?: string | null
          step?: string
          title?: string
          updated_at?: string | null
          who?: string
        }
        Relationships: []
      }
      strategy_calendar_items: {
        Row: {
          created_at: string | null
          id: string
          item: string
          owner: string | null
          sort_order: number | null
          updated_at: string | null
          week_label: string
          week_number: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item: string
          owner?: string | null
          sort_order?: number | null
          updated_at?: string | null
          week_label: string
          week_number: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item?: string
          owner?: string | null
          sort_order?: number | null
          updated_at?: string | null
          week_label?: string
          week_number?: number
        }
        Relationships: []
      }
      strategy_channels: {
        Row: {
          audience: string | null
          content: string | null
          freq: string | null
          id: string
          name: string
          notes: string | null
          owner: string | null
          sort_order: number | null
          updated_at: string | null
          updated_by: string | null
          whatsapp_groups: Json | null
        }
        Insert: {
          audience?: string | null
          content?: string | null
          freq?: string | null
          id: string
          name: string
          notes?: string | null
          owner?: string | null
          sort_order?: number | null
          updated_at?: string | null
          updated_by?: string | null
          whatsapp_groups?: Json | null
        }
        Update: {
          audience?: string | null
          content?: string | null
          freq?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner?: string | null
          sort_order?: number | null
          updated_at?: string | null
          updated_by?: string | null
          whatsapp_groups?: Json | null
        }
        Relationships: []
      }
      strategy_documents_meta: {
        Row: {
          category: string | null
          description: string | null
          display_name: string | null
          doc_date: string | null
          doc_id: string
          filename: string
          notes: string | null
          updated_at: string | null
          updated_by: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          display_name?: string | null
          doc_date?: string | null
          doc_id: string
          filename: string
          notes?: string | null
          updated_at?: string | null
          updated_by?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          display_name?: string | null
          doc_date?: string | null
          doc_id?: string
          filename?: string
          notes?: string | null
          updated_at?: string | null
          updated_by?: string | null
          version?: string | null
        }
        Relationships: []
      }
      strategy_stakeholders_meta: {
        Row: {
          last_contact_date: string | null
          notes: string | null
          stakeholder_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          last_contact_date?: string | null
          notes?: string | null
          stakeholder_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          last_contact_date?: string | null
          notes?: string | null
          stakeholder_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      weekly_reports: {
        Row: {
          content: string
          created_at: string | null
          id: string
          raw_data: Json | null
          sent_at: string | null
          sent_by: string | null
          subject: string
          week_of: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          raw_data?: Json | null
          sent_at?: string | null
          sent_by?: string | null
          subject: string
          week_of: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          raw_data?: Json | null
          sent_at?: string | null
          sent_by?: string | null
          subject?: string
          week_of?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
