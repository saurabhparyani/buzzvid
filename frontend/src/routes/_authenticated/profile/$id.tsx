import Profile from '@/pages/Profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile/$id')({
  component: Profile,
})
