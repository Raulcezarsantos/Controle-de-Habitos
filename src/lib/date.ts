const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
})

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

export function getDayKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getTodayKey() {
  return getDayKey(new Date())
}

export function formatRelativeDateLabel(value: string) {
  const date = new Date(`${value}T12:00:00`)

  return monthFormatter.format(date)
}

export function getWeekDays(reference = new Date()) {
  const current = new Date(reference)
  const currentDay = current.getDay()
  const diff = currentDay === 0 ? -6 : 1 - currentDay
  current.setDate(current.getDate() + diff)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(current)
    date.setDate(current.getDate() + index)

    return {
      index,
      key: getDayKey(date),
      label: dayFormatter.format(date).replace('.', ''),
      shortDate: formatRelativeDateLabel(getDayKey(date)),
      date,
      isToday: getDayKey(date) === getTodayKey(),
    }
  })
}

export function getDistanceInDays(from: string, to: string) {
  const fromDate = new Date(`${from}T12:00:00`)
  const toDate = new Date(`${to}T12:00:00`)
  const diff = toDate.getTime() - fromDate.getTime()

  return Math.round(diff / 86400000)
}
