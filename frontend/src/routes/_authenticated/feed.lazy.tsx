import { createLazyFileRoute } from '@tanstack/react-router'
import Feed from '../../pages/Feed'

export const Route = createLazyFileRoute('/_authenticated/feed')({
  component: Feed,
})
