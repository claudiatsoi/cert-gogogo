export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          school_grade: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          school_grade?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          school_grade?: string | null
          created_at?: string
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
