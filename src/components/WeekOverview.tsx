import { getWeeklyCompletions, isHabitDoneOnDay } from '../lib/habits'
import type { Habit } from '../types'

type WeekOverviewProps = {
  habits: Habit[]
  weekDays: Array<{
    key: string
    label: string
    shortDate: string
    isToday: boolean
  }>
  onToggleDay: (habitId: string, dayKey: string) => void
}

export function WeekOverview({
  habits,
  weekDays,
  onToggleDay,
}: WeekOverviewProps) {
  return (
    <section className="panel week-panel">
      <div className="panel-heading">
        <span className="eyebrow">Semana</span>
        <h2>Visao semanal com check-ins rapidos</h2>
        <p>
          Clique em qualquer dia para ajustar o historico sem sair da tela
          principal.
        </p>
      </div>

      <div className="week-grid">
        <div className="week-grid__head">
          <span>Habito</span>
          {weekDays.map((day) => (
            <div key={day.key} className={day.isToday ? 'is-today' : undefined}>
              <strong>{day.label}</strong>
              <span>{day.shortDate}</span>
            </div>
          ))}
          <span>Meta</span>
        </div>

        {habits.map((habit) => (
          <div key={habit.id} className="week-grid__row">
            <div className="week-grid__habit">
              <strong>{habit.name}</strong>
              <span>{habit.category}</span>
            </div>

            {weekDays.map((day) => {
              const isChecked = isHabitDoneOnDay(habit, day.key)

              return (
                <button
                  key={day.key}
                  type="button"
                  className={`day-toggle ${isChecked ? 'is-checked' : ''} ${day.isToday ? 'is-today' : ''}`}
                  onClick={() => onToggleDay(habit.id, day.key)}
                  aria-label={`${habit.name} em ${day.shortDate}`}
                />
              )
            })}

            <div className="week-grid__summary">
              {getWeeklyCompletions(
                habit,
                weekDays.map((day) => day.key),
              )}
              /{habit.weeklyTarget}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
