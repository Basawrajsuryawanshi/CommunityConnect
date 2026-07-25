const colors = [
  'bg-emerald-600',
  'bg-teal-600',
  'bg-cyan-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-indigo-600',
  'bg-orange-600',
]

export function Avatar({
  initials,
  size = 'md',
  className = '',
}: {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClass =
    size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-sm'
  const colorIndex = initials.charCodeAt(0) % colors.length

  return (
    <div
      className={`${sizeClass} ${colors[colorIndex]} flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
    >
      {initials}
    </div>
  )
}
