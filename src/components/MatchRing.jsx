export default function MatchRing({ score }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const tone = score >= 100 ? 'high' : score >= 70 ? 'mid' : 'low'

  return (
    <svg className={`ring ring-${tone}`} viewBox="0 0 44 44" role="img" aria-label={`${score} percent match`}>
      <circle className="ring-bg" cx="22" cy="22" r={radius} />
      <circle
        className="ring-fg"
        cx="22"
        cy="22"
        r={radius}
        transform="rotate(-90 22 22)"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: circumference - (circumference * score) / 100,
        }}
      />
      <text className="ring-text" x="22" y="26" textAnchor="middle">
        {score}
      </text>
    </svg>
  )
}