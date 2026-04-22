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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      business_inquiries: {
        Row: {
          additional_details: string | null
          business_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          event_date: string
          event_end_date: string | null
          event_type: string
          expected_guests: number
          id: string
          license_plate_state: string | null
          status: string
          updated_at: string
          venue_location: string
        }
        Insert: {
          additional_details?: string | null
          business_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          event_date: string
          event_end_date?: string | null
          event_type: string
          expected_guests: number
          id?: string
          license_plate_state?: string | null
          status?: string
          updated_at?: string
          venue_location: string
        }
        Update: {
          additional_details?: string | null
          business_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          event_date?: string
          event_end_date?: string | null
          event_type?: string
          expected_guests?: number
          id?: string
          license_plate_state?: string | null
          status?: string
          updated_at?: string
          venue_location?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      parking_requests: {
        Row: {
          assigned_employee_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          license_plate: string
          license_plate_state: string | null
          phone: string
          pickup_location: string
          service_type: string
          special_instructions: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          vehicle_color: string
          vehicle_make: string
          vehicle_model: string
        }
        Insert: {
          assigned_employee_id?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          license_plate: string
          license_plate_state?: string | null
          phone: string
          pickup_location: string
          service_type?: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          vehicle_color: string
          vehicle_make: string
          vehicle_model: string
        }
        Update: {
          assigned_employee_id?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          license_plate?: string
          license_plate_state?: string | null
          phone?: string
          pickup_location?: string
          service_type?: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          vehicle_color?: string
          vehicle_make?: string
          vehicle_model?: string
        }
        Relationships: [
          {
            foreignKeyName: "parking_requests_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_ping_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          parking_request_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          parking_request_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          parking_request_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pickup_ping_tokens_parking_request_id_fkey"
            columns: ["parking_request_id"]
            isOneToOne: false
            referencedRelation: "parking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_requests: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          completed_at: string | null
          created_at: string
          customer_email: string
          customer_name: string | null
          id: string
          notes: string | null
          parking_request_id: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          completed_at?: string | null
          created_at?: string
          customer_email: string
          customer_name?: string | null
          id?: string
          notes?: string | null
          parking_request_id: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          completed_at?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string | null
          id?: string
          notes?: string | null
          parking_request_id?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_requests_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_requests_parking_request_id_fkey"
            columns: ["parking_request_id"]
            isOneToOne: false
            referencedRelation: "parking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      request_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_by_customer: boolean
          read_by_employee: boolean
          request_id: string
          sender_name: string | null
          sender_role: string
          sender_user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_by_customer?: boolean
          read_by_employee?: boolean
          request_id: string
          sender_name?: string | null
          sender_role: string
          sender_user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_by_customer?: boolean
          read_by_employee?: boolean
          request_id?: string
          sender_name?: string | null
          sender_role?: string
          sender_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "parking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_notes: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          request_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          request_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_notes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "parking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_reminders_sent: {
        Row: {
          id: string
          reminder_type: string
          schedule_id: string
          sent_at: string
        }
        Insert: {
          id?: string
          reminder_type: string
          schedule_id: string
          sent_at?: string
        }
        Update: {
          id?: string
          reminder_type?: string
          schedule_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_reminders_sent_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "valet_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
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
      valet_schedules: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          license_plate: string
          license_plate_state: string | null
          pickup_location: string
          scheduled_date: string
          scheduled_time: string
          special_instructions: string | null
          status: string
          updated_at: string
          vehicle_color: string
          vehicle_make: string
          vehicle_model: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          license_plate: string
          license_plate_state?: string | null
          pickup_location: string
          scheduled_date: string
          scheduled_time: string
          special_instructions?: string | null
          status?: string
          updated_at?: string
          vehicle_color: string
          vehicle_make: string
          vehicle_model: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          license_plate?: string
          license_plate_state?: string | null
          pickup_location?: string
          scheduled_date?: string
          scheduled_time?: string
          special_instructions?: string | null
          status?: string
          updated_at?: string
          vehicle_color?: string
          vehicle_make?: string
          vehicle_model?: string
        }
        Relationships: []
      }
      vehicle_inspections: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          notes: string | null
          parking_description: string | null
          parking_latitude: number | null
          parking_longitude: number | null
          parking_photo_path: string | null
          request_id: string
          status: Database["public"]["Enums"]["inspection_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          notes?: string | null
          parking_description?: string | null
          parking_latitude?: number | null
          parking_longitude?: number | null
          parking_photo_path?: string | null
          request_id: string
          status?: Database["public"]["Enums"]["inspection_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          notes?: string | null
          parking_description?: string | null
          parking_latitude?: number | null
          parking_longitude?: number | null
          parking_photo_path?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["inspection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_inspections_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "parking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_photos: {
        Row: {
          angle: string
          created_at: string
          id: string
          inspection_id: string
          notes: string | null
          photo_path: string
        }
        Insert: {
          angle: string
          created_at?: string
          id?: string
          inspection_id: string
          notes?: string | null
          photo_path: string
        }
        Update: {
          angle?: string
          created_at?: string
          id?: string
          inspection_id?: string
          notes?: string | null
          photo_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_photos_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "vehicle_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_request_messages: { Args: never; Returns: undefined }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_queue_position: { Args: { p_request_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_employee: { Args: never; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "employee"
      inspection_status: "pending" | "photos_taken" | "parked" | "completed"
      request_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
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
      app_role: ["admin", "employee"],
      inspection_status: ["pending", "photos_taken", "parked", "completed"],
      request_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
