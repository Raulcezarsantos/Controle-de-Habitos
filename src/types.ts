export type Habit = {
  id: string
  name: string
  category: string
  description: string
  weeklyTarget: number
  preferredDays: number[]
  accent: string
  checkIns: string[]
  createdAt: string
}

export type HabitDraft = Omit<Habit, 'id' | 'checkIns' | 'createdAt'>

export type HabitFilter = 'all' | 'done' | 'pending'
