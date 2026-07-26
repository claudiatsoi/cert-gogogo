export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          school_grade: string | null
          role: 'student' | 'teacher' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          school_grade?: string | null
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          school_grade?: string | null
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
        }
      }
      teacher_students: {
        Row: {
          id: string
          teacher_id: string
          student_name: string
          student_email: string
          grade: string | null
          parent_email: string | null
          magic_link_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          student_name: string
          student_email: string
          grade?: string | null
          parent_email?: string | null
          magic_link_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          student_name?: string
          student_email?: string
          grade?: string | null
          parent_email?: string | null
          magic_link_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teacher_profiles: {
        Row: {
          id: string
          email: string
          phone: string | null
          title: string
          school_category: string
          school_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          title: string
          school_category: string
          school_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          title?: string
          school_category?: string
          school_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      competitions: {
        Row: {
          id: string
          title: string
          description: string | null
          registration_fee_cents: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          registration_fee_cents?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          registration_fee_cents?: number
          is_active?: boolean
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          competition_id: string
          type: 'word' | 'science'
          question_text: string
          correct_answer: string
          distractor_1: string
          distractor_2: string
          distractor_3: string
          created_at: string
        }
        Insert: {
          id?: string
          competition_id: string
          type: 'word' | 'science'
          question_text: string
          correct_answer: string
          distractor_1: string
          distractor_2: string
          distractor_3: string
          created_at?: string
        }
        Update: {
          id?: string
          competition_id?: string
          type?: 'word' | 'science'
          question_text?: string
          correct_answer?: string
          distractor_1?: string
          distractor_2?: string
          distractor_3?: string
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          competition_id: string
          raw_score: number
          tier: string | null
          payment_status: 'unpaid' | 'paid_ecert' | 'paid_physical'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          competition_id: string
          raw_score: number
          tier?: string | null
          payment_status?: 'unpaid' | 'paid_ecert' | 'paid_physical'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          competition_id?: string
          raw_score?: number
          tier?: string | null
          payment_status?: 'unpaid' | 'paid_ecert' | 'paid_physical'
          created_at?: string
        }
      }
    }
  }
}
