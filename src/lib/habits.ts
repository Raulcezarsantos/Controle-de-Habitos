import type { Habit } from '../types'
import { getDistanceInDays, getTodayKey } from './date'

export const weekdayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

export const seedHabits: Habit[] = [
  {
    id: 'focus-block',
    name: 'Bloco de foco profundo',
    category: 'Produtividade',
    description: 'Sessao de 90 minutos sem interrupcoes para trabalho estrategico.',
    weeklyTarget: 5,
    preferredDays: [1, 2, 3, 4, 5],
    accent: '#5eead4',
    checkIns: [],
    createdAt: getTodayKey(),
  },
  {
    id: 'english',
    name: 'Estudo de ingles',
    category: 'Aprendizado',
    description: 'Revisao de vocabulario e escuta ativa por pelo menos 30 minutos.',
    weeklyTarget: 4,
    preferredDays: [1, 2, 4, 6],
    accent: '#f59e0b',
    checkIns: [],
    createdAt: getTodayKey(),
  },
  {
    id: 'movement',
    name: 'Treino ou caminhada',
    category: 'Saude',
    description: 'Mover o corpo todos os dias para manter energia e constancia.',
    weeklyTarget: 6,
    preferredDays: [1, 2, 3, 4, 5, 6],
    accent: '#fb7185',
    checkIns: [],
    createdAt: getTodayKey(),
  },
]

export function isHabitDoneOnDay(habit: Habit, dayKey: string) {
  return habit.checkIns.includes(dayKey)
}

export function getWeeklyCompletions(habit: Habit, weekKeys: string[]) {
  return weekKeys.filter((key) => isHabitDoneOnDay(habit, key)).length
}

export function getConsistency(habits: Habit[], weekKeys: string[]) {
  const target = habits.reduce((sum, habit) => sum + habit.weeklyTarget, 0)

  if (target === 0) {
    return 0
  }

  const done = habits.reduce(
    (sum, habit) => sum + getWeeklyCompletions(habit, weekKeys),
    0,
  )

  return Math.min(100, Math.round((done / target) * 100))
}

export function getHabitStreak(habit: Habit) {
  if (habit.checkIns.length === 0) {
    return 0
  }

  const sorted = [...new Set(habit.checkIns)].sort((left, right) =>
    right.localeCompare(left),
  )

  let streak = 1

  for (let index = 0; index < sorted.length - 1; index += 1) {
    if (getDistanceInDays(sorted[index + 1], sorted[index]) === 1) {
      streak += 1
      continue
    }

    break
  }

  return streak
}

export function getLongestStreak(habits: Habit[]) {
  return habits.reduce((max, habit) => Math.max(max, getHabitStreak(habit)), 0)
}

export function getTopCategory(habits: Habit[]) {
  const counts = habits.reduce<Record<string, number>>((accumulator, habit) => {
    accumulator[habit.category] = (accumulator[habit.category] ?? 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0]
}

export function createHabitId(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
}

export function getHabitStatusLabel(habit: Habit, weekKeys: string[]) {
  const completions = getWeeklyCompletions(habit, weekKeys)

  if (completions >= habit.weeklyTarget) {
    return 'Meta batida'
  }

  const remaining = habit.weeklyTarget - completions

  return `${remaining} restante${remaining > 1 ? 's' : ''} na semana`
}

export function getSummary(habits: Habit[], todayKey: string, weekKeys: string[]) {
  const doneToday = habits.filter((habit) => isHabitDoneOnDay(habit, todayKey)).length
  const todayIndex = new Date().getDay() || 7
  const dueToday = habits.filter((habit) =>
    habit.preferredDays.includes(todayIndex),
  ).length

  return {
    active: habits.length,
    doneToday,
    dueToday,
    consistency: getConsistency(habits, weekKeys),
    bestStreak: getLongestStreak(habits),
    topCategory: getTopCategory(habits),
  }
}
