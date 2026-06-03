import type { CSSProperties } from 'react'
import { Check, Flame, Trash2 } from 'lucide-react'

import { getHabitStatusLabel, getHabitStreak, isHabitDoneOnDay } from '../lib/habits'
import type { Habit } from '../types'

type HabitCardProps = {
  habit: Habit
  todayKey: string
  weekKeys: string[]
  onToggleToday: (habitId: string) => void
  onDelete: (habitId: string) => void
}

export function HabitCard({
  habit,
  todayKey,
  weekKeys,
  onToggleToday,
  onDelete,
}: HabitCardProps) {
  const isDoneToday = isHabitDoneOnDay(habit, todayKey)
  const streak = getHabitStreak(habit)
  const statusLabel = getHabitStatusLabel(habit, weekKeys)

  return (
    <article
      className="habit-card"
      style={{ '--habit-accent': habit.accent } as CSSProperties}
    >
      <div className="habit-card__header">
        <div>
          <span>{habit.category}</span>
          <h3>{habit.name}</h3>
        </div>
        <button
          type="button"
          className="ghost-icon-button"
          aria-label={`Remover ${habit.name}`}
          onClick={() => onDelete(habit.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <p>{habit.description || 'Habito sem descricao detalhada ainda.'}</p>

      <div className="habit-card__meta">
        <span>
          <Flame size={15} />
          {streak} dia{streak === 1 ? '' : 's'} em sequencia
        </span>
        <span>{habit.weeklyTarget}x por semana</span>
        <span>{statusLabel}</span>
      </div>

      <button
        type="button"
        className={`check-button ${isDoneToday ? 'is-checked' : ''}`}
        onClick={() => onToggleToday(habit.id)}
      >
        <Check size={18} />
        {isDoneToday ? 'Concluido hoje' : 'Marcar hoje'}
      </button>
    </article>
  )
}
