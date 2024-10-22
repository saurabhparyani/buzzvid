import { create } from "zustand"

import { persist, devtools } from "zustand/middleware"

export interface User {
  id?: number
  fullname: string
  email?: string
  bio?: string
  image?: string
  googleImage?: string
}

export interface UserActions {
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<User & UserActions>()(
  devtools(
    persist(
      (set) => ({
        id: 0,
        fullname: "",
        email: "",
        bio: "",
        image: "",
        googleImage: "",

        setUser: (user) => set(user),
        logout: () => {
          set({ id: 0, fullname: "", email: "", bio: "", image: "", googleImage: "" })
        },
      }),
      {
        name: "user-storage",
      }
    )
  )
)