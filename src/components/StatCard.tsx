type StatCardProps = {
  eyebrow: string
  value: string
  label: string
  tone?: 'mint' | 'amber' | 'rose' | 'blue'
}

export function StatCard({
  eyebrow,
  value,
  label,
  tone = 'mint',
}: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span>{eyebrow}</span>
      <strong>{value}</strong>
      <p>{label}</p>
    </article>
  )
}
