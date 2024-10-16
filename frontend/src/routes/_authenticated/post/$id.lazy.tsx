import Post from '@/pages/Post'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/post/$id')({
  component: Post,
})
