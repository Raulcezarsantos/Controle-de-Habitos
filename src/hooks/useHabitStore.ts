import { useEffect, useState } from 'react'

import { getTodayKey } from '../lib/date'
import { createHabitId, seedHabits } from '../lib/habits'
import type { Habit, HabitDraft } from '../types'

const storageKey = 'controle-de-habitos:store:v1'

function getInitialHabits() {
  const stored = window.localStorage.getItem(storageKey)

  if (!stored) {
    return seedHabits
  }

  try {
    const parsed = JSON.parse(stored) as Habit[]

    return parsed.length > 0 ? parsed : seedHabits
  } catch {
    return seedHabits
  }
}

export function useHabitStore() {
  const [habits, setHabits] = useState<Habit[]>(getInitialHabits)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(habits))
  }, [habits])

  function addHabit(draft: HabitDraft) {
    setHabits((current) => [
      {
        ...draft,
        id: createHabitId(draft.name),
        checkIns: [],
        createdAt: getTodayKey(),
      },
      ...current,
    ])
  }

  function toggleHabitForDay(habitId: string, dayKey: string) {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== habitId) {
          return habit
        }

        return {
          ...habit,
          checkIns: habit.checkIns.includes(dayKey)
            ? habit.checkIns.filter((entry) => entry !== dayKey)
            : [...habit.checkIns, dayKey].sort(),
        }
      }),
    )
  }

  function removeHabit(habitId: string) {
    setHabits((current) => current.filter((habit) => habit.id !== habitId))
  }

  function resetHabits() {
    setHabits(seedHabits)
  }

  return {
    habits,
    addHabit,
    toggleHabitForDay,
    removeHabit,
    resetHabits,
  }
}
