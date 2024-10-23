import { create } from "zustand"

import { persist, devtools } from "zustand/middleware"

export interface User {
  id?: string
  fullname: string
  email?: string
  bio?: string
  image?: string
  googleImage?: string;
  googleId?: string;
}

export interface UserActions {
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<User & UserActions>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        fullname: "",
        email: "",
        bio: "",
        image: "",
        googleImage: "",
        googleId: "",
        setUser: (user) => set(user),
        logout: () => {
          set({ id: "", fullname: "", email: "", bio: "", image: "", googleImage: "" })
        },
      }),
      {
        name: "user-storage",
      }
    )
  )
)