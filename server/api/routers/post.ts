import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'

export const postRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    return 'Hello World'
  }),

  getLatestPost: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      where: { authorId: ctx.session.userId },
      orderBy: { createdAt: 'desc' },
    })

    return post ?? null
  }),

  createPost: protectedProcedure.input(z.object({ content: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const post = await ctx.db.post.create({
      data: {
        content: input.content,
        author: { connect: { id: ctx.session.userId } },
      },
    })

    return post
  }),
})
