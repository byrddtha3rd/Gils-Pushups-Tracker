interface ProgressRingProps {
  percent: number
  total: number
}

export function ProgressRing({ percent, total }: ProgressRingProps) {
  const circumference = 2 * Math.PI * 74
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference

  return (
    <div className="progress-ring" aria-label={`${percent.toFixed(1)} percent complete`}>
      <svg viewBox="0 0 172 172" role="img">
        <circle className="ring-track" cx="86" cy="86" r="74" />
        <circle
          className="ring-value"
          cx="86"
          cy="86"
          r="74"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-copy">
        <strong>{total.toLocaleString()}</strong>
        <span>of 10,000</span>
        <b>{percent.toFixed(percent >= 10 ? 0 : 1)}%</b>
      </div>
    </div>
  )
}
