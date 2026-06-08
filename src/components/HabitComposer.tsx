import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'

import { weekdayLabels } from '../lib/habits'
import type { Habit, HabitDraft } from '../types'

type HabitComposerProps = {
  onSubmit: (draft: HabitDraft) => void
  editingHabit?: Habit | null
  onCancelEdit?: () => void
}

const accentPresets = ['#5eead4', '#38bdf8', '#f59e0b', '#fb7185', '#c084fc']

const initialDraft: HabitDraft = {
  name: '',
  category: 'Produtividade',
  description: '',
  weeklyTarget: 4,
  preferredDays: [1, 2, 3, 4],
  accent: accentPresets[0],
}

export function HabitComposer({
  onSubmit,
  editingHabit = null,
  onCancelEdit,
}: HabitComposerProps) {
  const baseDraft = useMemo(() => {
    if (!editingHabit) {
      return initialDraft
    }

    return {
      name: editingHabit.name,
      category: editingHabit.category,
      description: editingHabit.description,
      weeklyTarget: editingHabit.weeklyTarget,
      preferredDays: editingHabit.preferredDays,
      accent: editingHabit.accent,
    }
  }, [editingHabit])

  const [draft, setDraft] = useState(baseDraft)

  function toggleDay(day: number) {
    setDraft((current) => {
      const nextDays = current.preferredDays.includes(day)
        ? current.preferredDays.filter((item) => item !== day)
        : [...current.preferredDays, day].sort((left, right) => left - right)

      return {
        ...current,
        preferredDays: nextDays.length > 0 ? nextDays : current.preferredDays,
      }
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!draft.name.trim()) {
      return
    }

    onSubmit({
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
    })

    setDraft(initialDraft)
  }

  return (
    <section className="panel composer-panel">
      <div className="panel-heading">
        <span className="eyebrow">
          {editingHabit ? 'Editar habito' : 'Novo habito'}
        </span>
        <h2>
          {editingHabit
            ? 'Atualize a rotina sem perder seu historico'
            : 'Monte uma rotina com cara de produto real'}
        </h2>
        <p>
          {editingHabit
            ? 'Ajuste nome, categoria, meta e dias preferidos mantendo os check-ins ja registrados.'
            : 'Defina objetivo semanal, dias preferidos e uma cor para diferenciar seus blocos.'}
        </p>
      </div>

      <form className="composer-form" onSubmit={handleSubmit}>
        <label>
          Nome do habito
          <input
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Ex.: Revisar backlog"
          />
        </label>

        <div className="form-grid">
          <label>
            Categoria
            <input
              value={draft.category}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              placeholder="Produtividade"
            />
          </label>

          <label>
            Meta semanal
            <input
              type="number"
              min="1"
              max="7"
              value={draft.weeklyTarget}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  weeklyTarget: Number(event.target.value),
                }))
              }
            />
          </label>
        </div>

        <label>
          Descricao
          <textarea
            rows={3}
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="O que exatamente precisa acontecer para considerar o habito concluido?"
          />
        </label>

        <fieldset className="weekday-picker">
          <legend>Dias preferidos</legend>
          <div>
            {weekdayLabels.map((label, index) => {
              const day = index + 1
              const isActive = draft.preferredDays.includes(day)

              return (
                <button
                  key={`${label}-${day}`}
                  type="button"
                  className={isActive ? 'is-active' : undefined}
                  onClick={() => toggleDay(day)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="accent-picker">
          <legend>Cor do habito</legend>
          <div>
            {accentPresets.map((accent) => (
              <button
                key={accent}
                type="button"
                className={draft.accent === accent ? 'is-active' : undefined}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    accent,
                  }))
                }
                aria-label={`Selecionar cor ${accent}`}
                style={{ '--accent-preview': accent } as CSSProperties}
              />
            ))}
          </div>
        </fieldset>

        <div className="composer-actions">
          <button className="primary-button" type="submit">
            {editingHabit ? 'Salvar alteracoes' : 'Criar habito'}
          </button>
          {editingHabit ? (
            <button
              className="secondary-button secondary-button--ghost"
              type="button"
              onClick={onCancelEdit}
            >
              Cancelar edicao
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}
