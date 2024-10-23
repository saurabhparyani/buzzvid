import Post from '@/pages/Post'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/post/$id')({
  component: Post,
})
