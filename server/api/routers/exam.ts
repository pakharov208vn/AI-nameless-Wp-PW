import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const examRouter = createTRPCRouter({
  getExam: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const exam = await ctx.db.exams.findUnique({
      where: { id: input.id },
    })

    return exam ?? null
  }),

  getExams: protectedProcedure.query(async ({ ctx }) => {
    const exams = await ctx.db.exams.findMany({
      where: { byUserId: ctx.session.userId },
    })

    return exams
  }),

  createExam: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        timerMinutes: z.number().min(1),
        questions: z.array(z.object({ text: z.string().min(1), barem: z.string().min(1) })),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const exam = await ctx.db.exams.create({
        data: {
          title: input.title,
          timer: input.timerMinutes * 60,
          byUserId: ctx.session.userId,
          questions: {
            create: input.questions.map((q) => ({
              text: q.text,
              barem: q.barem,
            })),
          },
        },
      })

      return exam
    }),
})
