import Upload from '@/pages/Upload'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/upload')({
  component: Upload,
})
