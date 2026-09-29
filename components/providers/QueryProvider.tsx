'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toaster from '@/components/ui/Toaster'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes fresh data
            gcTime: 1000 * 60 * 30, // 30 minutes garbage collection time
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Serve cached data instantly on route navigation
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}