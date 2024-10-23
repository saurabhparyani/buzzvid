import { createFileRoute } from '@tanstack/react-router'
import Feed from '../../pages/Feed'

export const Route = createFileRoute('/_authenticated/feed')({
  component: Feed,
})
