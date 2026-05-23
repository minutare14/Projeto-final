'use client'

interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>{current}/{total}</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}