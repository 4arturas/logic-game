import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/practice')({
  beforeLoad: async () => {
    throw redirect({
      to: '/',
    })
  },
})
