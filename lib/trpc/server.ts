import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { headers } from 'next/headers'
import { cache } from 'react'

import { createQueryClient } from '@/lib/trpc/query-client'
import type { AppRouter } from '@/server/api/root'
import { createCaller } from '@/server/api/root'
import { createTRPCContext } from '@/server/api/trpc'

const createContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads,
  })
})

const getQueryClient = cache(createQueryClient)
// @ts-expect-error - TODO: fix this
const caller = createCaller(createContext)

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(caller, getQueryClient)
