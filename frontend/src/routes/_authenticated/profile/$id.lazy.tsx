import Profile from '@/pages/Profile'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/profile/$id')({
  component: Profile,
})
