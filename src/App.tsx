import { useDeferredValue, useMemo, useState } from 'react'
import { CalendarRange, Filter, RefreshCcw, Sparkles, Target } from 'lucide-react'

import { HabitCard } from './components/HabitCard'
import { HabitComposer } from './components/HabitComposer'
import { StatCard } from './components/StatCard'
import { WeekOverview } from './components/WeekOverview'
import { useHabitStore } from './hooks/useHabitStore'
import { getTodayKey, getWeekDays } from './lib/date'
import { getSummary, isHabitDoneOnDay } from './lib/habits'
import type { HabitFilter } from './types'

function App() {
  const {
    habits,
    addHabit,
    updateHabit,
    removeHabit,
    resetHabits,
    toggleHabitForDay,
  } =
    useHabitStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<HabitFilter>('all')
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)

  const todayKey = getTodayKey()
  const weekDays = getWeekDays()
  const weekKeys = weekDays.map((day) => day.key)
  const summary = getSummary(habits, todayKey, weekKeys)
  const editingHabit = useMemo(
    () => habits.find((habit) => habit.id === editingHabitId) ?? null,
    [editingHabitId, habits],
  )

  const filteredHabits = habits.filter((habit) => {
    const matchesQuery =
      habit.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      habit.category.toLowerCase().includes(deferredQuery.toLowerCase())

    if (!matchesQuery) {
      return false
    }

    if (filter === 'done') {
      return isHabitDoneOnDay(habit, todayKey)
    }

    if (filter === 'pending') {
      return !isHabitDoneOnDay(habit, todayKey)
    }

    return true
  })

  function handleComposerSubmit(draft: Parameters<typeof addHabit>[0]) {
    if (editingHabit) {
      updateHabit(editingHabit.id, draft)
      setEditingHabitId(null)
      return
    }

    addHabit(draft)
  }

  function handleDeleteHabit(habitId: string) {
    if (editingHabitId === habitId) {
      setEditingHabitId(null)
    }

    removeHabit(habitId)
  }

  function handleResetHabits() {
    setEditingHabitId(null)
    resetHabits()
  }

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <nav className="topbar">
          <div className="brand">
            <span>H</span>
            <div>
              <strong>Controle de Habitos</strong>
              <small>Rotina com leitura rapida e foco em constancia</small>
            </div>
          </div>

          <button type="button" className="secondary-button" onClick={handleResetHabits}>
            <RefreshCcw size={16} />
            Resetar demo
          </button>
        </nav>

        <div className="hero-grid">
          <section className="hero-copy">
            <span className="pill">
              <Sparkles size={14} />
              Case modernizado em React + TypeScript
            </span>
            <h1>Seu tracker de habitos com cara de produto, nao de exercicio.</h1>
            <p>
              Organize rotinas, acompanhe streaks e visualize a semana inteira
              sem depender de backend para funcionar.
            </p>

            <div className="hero-actions">
              <label className="search-field">
                <Filter size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por habito ou categoria"
                />
              </label>

              <div className="filter-group" role="tablist" aria-label="Filtrar habitos">
                {[
                  ['all', 'Todos'],
                  ['done', 'Concluidos'],
                  ['pending', 'Pendentes'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={filter === value ? 'is-active' : undefined}
                    onClick={() => setFilter(value as HabitFilter)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="hero-highlight">
            <div className="highlight-card">
              <span className="eyebrow">Resumo de hoje</span>
              <strong>
                {summary.doneToday}/{summary.active}
              </strong>
              <p>habitos concluidos hoje</p>
            </div>
            <div className="highlight-meta">
              <div>
                <Target size={16} />
                <span>{summary.dueToday} habitos previstos para hoje</span>
              </div>
              <div>
                <CalendarRange size={16} />
                <span>{summary.consistency}% de consistencia nesta semana</span>
              </div>
            </div>
          </section>
        </div>

        <section className="stats-grid">
          <StatCard
            eyebrow="Habitos ativos"
            value={`${summary.active}`}
            label="rotinas monitoradas"
          />
          <StatCard
            eyebrow="Concluidos hoje"
            value={`${summary.doneToday}`}
            label="check-ins finalizados"
            tone="blue"
          />
          <StatCard
            eyebrow="Consistencia"
            value={`${summary.consistency}%`}
            label="progresso semanal"
            tone="amber"
          />
          <StatCard
            eyebrow="Melhor streak"
            value={`${summary.bestStreak}`}
            label="dias consecutivos"
            tone="rose"
          />
        </section>
      </header>

      <main className="content-grid">
        <div className="content-main">
          <section className="panel habits-panel">
            <div className="panel-heading">
              <span className="eyebrow">Hoje</span>
              <h2>Checklist pronto para desktop, tablet e celular</h2>
              <p>
                Toque para marcar o que foi feito e ajuste o historico da semana
                sem sair do fluxo.
              </p>
            </div>

            {filteredHabits.length > 0 ? (
              <div className="habits-list">
                {filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    todayKey={todayKey}
                    weekKeys={weekKeys}
                    onToggleToday={(habitId) => toggleHabitForDay(habitId, todayKey)}
                    onDelete={handleDeleteHabit}
                    onEdit={setEditingHabitId}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>Nenhum habito encontrado</h3>
                <p>
                  Ajuste o filtro atual ou crie um novo habito para preencher a
                  rotina.
                </p>
              </div>
            )}
          </section>

          <WeekOverview
            habits={habits}
            weekDays={weekDays}
            onToggleDay={toggleHabitForDay}
          />
        </div>

        <aside className="content-side">
          <HabitComposer
            key={editingHabit?.id ?? 'new-habit'}
            onSubmit={handleComposerSubmit}
            editingHabit={editingHabit}
            onCancelEdit={() => setEditingHabitId(null)}
          />

          <section className="panel insights-panel">
            <div className="panel-heading">
              <span className="eyebrow">Insights</span>
              <h2>Leitura rapida do que esta puxando seu ritmo</h2>
            </div>

            <div className="insight-stack">
              <article>
                <strong>{summary.topCategory?.[0] ?? 'Sem categoria'}</strong>
                <p>
                  Categoria com mais habitos ativos agora. Bom ponto para agrupar
                  rotinas semelhantes.
                </p>
              </article>
              <article>
                <strong>{filteredHabits.length}</strong>
                <p>
                  Habitos visiveis com o filtro atual. Ideal para manter foco sem
                  poluir a tela.
                </p>
              </article>
              <article>
                <strong>{summary.active - summary.doneToday}</strong>
                <p>
                  Itens ainda pendentes hoje. Use isso como fila curta para fechar
                  o dia.
                </p>
              </article>
            </div>
          </section>
        </aside>
      </main>
    </div>
  )
}

export default App
