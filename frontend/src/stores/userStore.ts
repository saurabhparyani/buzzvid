import { create } from "zustand"

import { persist, devtools } from "zustand/middleware"

export interface User {
  _id?: string
  fullname: string
  email?: string
  bio?: string
  image?: string
}

export interface UserActions {
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<User & UserActions>()(
  devtools(
    persist(
      (set) => ({
        _id: "",
        fullname: "",
        email: "",
        bio: "",
        image: "",

        setUser: (user) => set(user),
        logout: () => {
          set({ _id: "", fullname: "", email: "", bio: "", image: "" })
        },
      }),
      {
        name: "user-storage",
      }
    )
  )
)