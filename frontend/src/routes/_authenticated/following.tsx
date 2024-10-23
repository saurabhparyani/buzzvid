import Following from '@/pages/Following'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/following')({
  component: Following,
})
