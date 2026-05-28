import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/services/supabase'

interface AuthState {
  configured: boolean
  initialized: boolean
  user: User | null
  session: Session | null
  signInDialogOpen: boolean
  setSignInDialogOpen: (open: boolean) => void
  setSession: (session: Session | null) => void
  initialize: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  configured: isSupabaseConfigured,
  initialized: false,
  user: null,
  session: null,
  signInDialogOpen: false,

  setSignInDialogOpen: (open) => set({ signInDialogOpen: open }),

  setSession: (session) => set({ session, user: session?.user ?? null }),

  initialize: async () => {
    if (get().initialized || !supabase) {
      set({ initialized: true })
      return
    }
    const { data } = await supabase.auth.getSession()
    set({ session: data.session, user: data.session?.user ?? null, initialized: true })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null })
    })
  },

  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    set({ session: null, user: null })
  },
}))
