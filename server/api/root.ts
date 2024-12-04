import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { examRouter } from '@/server/api/routers/exam'
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'

const appRouter = createTRPCRouter({
  exam: examRouter,
})

// export type definition of API
type AppRouter = typeof appRouter

const createCaller = createCallerFactory(appRouter)

type RouterInputs = inferRouterInputs<AppRouter>

type RouterOutputs = inferRouterOutputs<AppRouter>

export { appRouter, createCaller }
export type { AppRouter, RouterInputs, RouterOutputs }
