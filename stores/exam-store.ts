import { create } from 'zustand'

interface ExamStore {
  isStarted: boolean
  setIsStarted: (isStarted: boolean) => void
}

export const useExamStore = create<ExamStore>()((set) => ({
  isStarted: false,
  setIsStarted: (isStarted) => set({ isStarted }),
}))
