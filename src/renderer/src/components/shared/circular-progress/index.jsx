import PropTypes from 'prop-types'

export const CircularProgress = function ({ percentage, size, strokeWidth }) {
  const radius = (size - strokeWidth) / 2
  const viewbox = `0 0 ${size} ${size}`

  const circumference = 2 * Math.PI * radius
  const offset = circumference - circumference * (percentage / 100)

  return (
    <svg width={size} height={size} viewBox={viewbox}>
      <circle
        className="circle-background"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className="circle-progress"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset === 100 ? 0 : offset,
          transition: 'all 100ms linear'
        }}
      />
    </svg>
  )
}

CircularProgress.propTypes = {
  size: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
  percentage: PropTypes.number.isRequired
}
