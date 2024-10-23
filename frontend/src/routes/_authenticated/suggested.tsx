import Suggested from '@/pages/Suggested'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/suggested')({
  component: Suggested,
})
